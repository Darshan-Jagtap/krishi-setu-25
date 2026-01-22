import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import FPOMember from '../models/FPOMember';
import FPOPaymentDistribution from '../models/FPOPaymentDistribution';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import mongoose from 'mongoose';

// Get all FPO members
export const getFPOMembers = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fpoId = req.user.id;

        // Verify user is an FPO
        if (req.user.role !== 'fpo') {
            return res.status(403).json({ error: 'Only FPOs can access member management' });
        }

        // Get all FPO members
        const members = await FPOMember.find({ fpo_id: fpoId })
            .populate('farmer_id', 'full_name email phone location')
            .sort({ created_at: -1 });

        res.json({ members });
    } catch (error: any) {
        console.error('Error fetching FPO members:', error);
        res.status(500).json({ error: error.message || 'Error fetching FPO members' });
    }
};

// Add a new member to FPO
export const addFPOMember = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fpoId = req.user.id;
        const { farmer_email, farmer_id, membership_number, contribution_percentage, notes, tags } = req.body;

        // Verify user is an FPO
        if (req.user.role !== 'fpo') {
            return res.status(403).json({ error: 'Only FPOs can add members' });
        }

        // Find farmer by email or ID
        let farmer;
        if (farmer_id) {
            farmer = await User.findById(farmer_id);
        } else if (farmer_email) {
            farmer = await User.findOne({ email: farmer_email.toLowerCase().trim(), role: 'farmer' });
        } else {
            return res.status(400).json({ error: 'Either farmer_email or farmer_id is required' });
        }

        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found. Please ensure the email is correct and the user has a "farmer" role.' });
        }

        // Verify farmer is actually a farmer
        if (farmer.role !== 'farmer') {
            return res.status(400).json({ error: 'User is not a farmer. Only users with "farmer" role can be added as FPO members.' });
        }

        // Check if farmer is already a member
        const existingMember = await FPOMember.findOne({ fpo_id: fpoId, farmer_id: farmer._id });
        if (existingMember) {
            return res.status(400).json({ error: 'Farmer is already a member of this FPO' });
        }

        // Get all current members to validate contribution percentages
        const currentMembers = await FPOMember.find({ fpo_id: fpoId });
        const currentTotalContribution = currentMembers.reduce((sum, member) => sum + (member.contribution_percentage || 0), 0);
        const newContribution = contribution_percentage || 0;
        const projectedTotal = currentTotalContribution + newContribution;

        // Validate that total contributions don't exceed 100%
        if (projectedTotal > 100) {
            return res.status(400).json({ 
                error: `Total contributions would be ${projectedTotal}%, which exceeds 100%. Current total: ${currentTotalContribution}%, New member: ${newContribution}%` 
            });
        }

        // Generate membership number if not provided
        const membershipNum = membership_number || `FPO-${fpoId.toString().slice(-4)}-${Date.now().toString().slice(-6)}`;

        const newMember = await FPOMember.create({
            fpo_id: fpoId,
            farmer_id: farmer._id,
            membership_number: membershipNum,
            contribution_percentage: contribution_percentage || 0,
            notes: notes || '',
            tags: tags || []
        });

        const populatedMember = await FPOMember.findById(newMember._id)
            .populate('farmer_id', 'full_name email phone location');

        res.status(201).json({
            message: 'Member added successfully',
            member: populatedMember,
            contribution_summary: {
                current_total: projectedTotal,
                remaining_for_100: 100 - projectedTotal
            }
        });
    } catch (error: any) {
        console.error('Error adding FPO member:', error);
        res.status(500).json({ error: error.message || 'Error adding FPO member' });
    }
};

// Update FPO member
export const updateFPOMember = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fpoId = req.user.id;
        const { id } = req.params;
        const { status, contribution_percentage, notes, tags } = req.body;

        // Verify user is an FPO
        if (req.user.role !== 'fpo') {
            return res.status(403).json({ error: 'Only FPOs can update members' });
        }

        // Verify member belongs to this FPO
        const member = await FPOMember.findOne({ _id: id, fpo_id: fpoId });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        // Get all current members to validate contribution percentages
        const currentMembers = await FPOMember.find({ fpo_id: fpoId });
        const currentTotalContribution = currentMembers.reduce((sum, m) => sum + (m.contribution_percentage || 0), 0);
        const newContribution = contribution_percentage !== undefined ? contribution_percentage : member.contribution_percentage;
        const projectedTotal = currentTotalContribution - (member.contribution_percentage || 0) + newContribution;

        // Validate that total contributions don't exceed 100%
        if (projectedTotal > 100) {
            return res.status(400).json({ 
                error: `Total contributions would be ${projectedTotal}%, which exceeds 100%. Current total: ${currentTotalContribution}%, Updated member: ${newContribution}%` 
            });
        }

        // Update member
        if (status) member.status = status;
        if (contribution_percentage !== undefined) member.contribution_percentage = contribution_percentage;
        if (notes !== undefined) member.notes = notes;
        if (tags !== undefined) member.tags = tags;

        await member.save();

        const updatedMember = await FPOMember.findById(id)
            .populate('farmer_id', 'full_name email phone location');

        res.json({
            message: 'Member updated successfully',
            member: updatedMember
        });
    } catch (error: any) {
        console.error('Error updating FPO member:', error);
        res.status(500).json({ error: error.message || 'Error updating FPO member' });
    }
};

// Remove FPO member
export const removeFPOMember = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fpoId = req.user.id;
        const { id } = req.params;

        // Verify user is an FPO
        if (req.user.role !== 'fpo') {
            return res.status(403).json({ error: 'Only FPOs can remove members' });
        }

        // Verify member belongs to this FPO
        const member = await FPOMember.findOne({ _id: id, fpo_id: fpoId });
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        await FPOMember.deleteOne({ _id: id });

        res.json({ message: 'Member removed successfully' });
    } catch (error: any) {
        console.error('Error removing FPO member:', error);
        res.status(500).json({ error: error.message || 'Error removing FPO member' });
    }
};

// Get FPO member analytics
export const getFPOMemberAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fpoId = req.user.id;

        // Verify user is an FPO
        if (req.user.role !== 'fpo') {
            return res.status(403).json({ error: 'Only FPOs can access analytics' });
        }

        // Get all members (not just active) for comprehensive analytics
        const allMembers = await FPOMember.find({ fpo_id: fpoId })
            .populate('farmer_id', 'full_name email phone location');
        
        const members = allMembers;

        // Get orders for FPO products
        const fpoProducts = await Product.find({ seller_id: fpoId });
        const orders = await Order.find({
            seller_id: fpoId.toString(),
            status: { $in: ['delivered', 'completed'] }
        });

        // Get all farmer IDs for member products
        const farmerIds = members.map(m => {
            const farmerId = typeof m.farmer_id === 'object' && m.farmer_id !== null 
                ? (m.farmer_id as any)._id || m.farmer_id 
                : m.farmer_id;
            return new mongoose.Types.ObjectId(farmerId);
        });

        // Calculate analytics for each member
        const analyticsPromises = members.map(async (member) => {
            const farmerId = typeof member.farmer_id === 'object' && member.farmer_id !== null 
                ? (member.farmer_id as any)._id || member.farmer_id 
                : member.farmer_id;

            // Get products from this member farmer
            const productCount = await Product.countDocuments({ seller_id: farmerId });

            // Calculate revenue from member's products (if products are sold)
            // This is a simplified calculation - in production, you'd track which member's products were in each FPO order
            // For now, we use the member's stored revenue or estimate based on contribution percentage
            let revenueGenerated = member.total_revenue_generated || 0;
            const contributionPercent: number = (member.contribution_percentage ?? 0);
            
            // If no stored revenue, estimate based on contribution percentage and total FPO revenue
            if (revenueGenerated === 0 && orders.length > 0 && contributionPercent > 0) {
                const totalFPORevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
                revenueGenerated = (totalFPORevenue * contributionPercent) / 100;
            }

            return {
                member: {
                    _id: member._id,
                    membership_number: member.membership_number,
                    farmer: member.farmer_id,
                    status: member.status,
                    member_since: member.member_since
                },
                stats: {
                    total_products: productCount,
                    revenue_generated: Math.round(revenueGenerated * 100) / 100, // Round to 2 decimal places
                    contribution_percentage: member.contribution_percentage || 0,
                    pending_payment: member.pending_payment || 0
                }
            };
        });

        const analytics = await Promise.all(analyticsPromises);

        // Calculate total FPO stats (use the already fetched members)
        const totalMembers = allMembers.length;
        const activeMembers = allMembers.filter(m => m.status === 'active').length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
        const totalPendingPayment = allMembers.reduce((sum, m) => sum + (m.pending_payment || 0), 0);
        const averageContribution = allMembers.length > 0
            ? allMembers.reduce((sum, m) => sum + (m.contribution_percentage || 0), 0) / allMembers.length
            : 0;

        res.json({
            analytics,
            summary: {
                total_members: totalMembers,
                active_members: activeMembers,
                total_revenue: totalRevenue,
                total_pending_payment: totalPendingPayment,
                average_contribution: Math.round(averageContribution * 10) / 10 // Round to 1 decimal place
            }
        });
    } catch (error: any) {
        console.error('Error fetching FPO member analytics:', error);
        res.status(500).json({ error: error.message || 'Error fetching FPO member analytics' });
    }
};

// Create payment distribution for an order
export const createPaymentDistribution = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fpoId = req.user.id;
        const { order_id, distributions, notes } = req.body;

        // Verify user is an FPO
        if (req.user.role !== 'fpo') {
            return res.status(403).json({ error: 'Only FPOs can create payment distributions' });
        }

        // Verify order belongs to FPO
        const order = await Order.findById(order_id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Verify order belongs to this FPO (seller_id can be string or ObjectId)
        const orderSellerId = order.seller_id?.toString() || '';
        const fpoIdString = fpoId.toString();
        
        if (orderSellerId !== fpoIdString) {
            return res.status(403).json({ error: 'Order does not belong to this FPO' });
        }

        // Check if order is in a valid status for distribution
        if (!['delivered'].includes(order.status)) {
            return res.status(400).json({ error: 'Only delivered orders can have payment distributions' });
        }

        // Check if distribution already exists for this order
        const existingDistribution = await FPOPaymentDistribution.findOne({ 
            fpo_id: fpoId, 
            order_id: order._id 
        });
        
        if (existingDistribution) {
            return res.status(400).json({ error: 'Payment distribution already exists for this order' });
        }

        // Validate distributions array
        if (!Array.isArray(distributions) || distributions.length === 0) {
            return res.status(400).json({ error: 'At least one distribution item is required' });
        }

        // Validate each distribution item
        for (const dist of distributions) {
            if (!dist.member_id || !dist.farmer_id) {
                return res.status(400).json({ error: 'Each distribution must have member_id and farmer_id' });
            }
            if (typeof dist.amount !== 'number' || dist.amount < 0) {
                return res.status(400).json({ error: 'Each distribution must have a valid amount (>= 0)' });
            }
            if (typeof dist.percentage !== 'number' || dist.percentage < 0 || dist.percentage > 100) {
                return res.status(400).json({ error: 'Each distribution must have a valid percentage (0-100)' });
            }
        }

        // Calculate total amount
        const totalAmount = distributions.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

        if (Math.abs(totalAmount - order.total_price) > 0.01) {
            return res.status(400).json({ 
                error: `Distribution amounts (₹${totalAmount.toFixed(2)}) do not match order total (₹${order.total_price.toFixed(2)})` 
            });
        }

        // Validate percentages sum to approximately 100%
        const totalPercentage = distributions.reduce((sum: number, d: any) => sum + (d.percentage || 0), 0);
        if (Math.abs(totalPercentage - 100) > 0.01 && distributions.length > 1) {
            return res.status(400).json({ 
                error: `Distribution percentages (${totalPercentage.toFixed(2)}%) must sum to 100%` 
            });
        }

        // Validate all members exist and belong to this FPO
        const memberIds = distributions.map((d: any) => d.member_id);
        const validMembers = await FPOMember.find({
            _id: { $in: memberIds },
            fpo_id: fpoId
        });

        if (validMembers.length !== memberIds.length) {
            return res.status(400).json({ error: 'One or more members are invalid or do not belong to this FPO' });
        }

        // Create distribution
        const distribution = await FPOPaymentDistribution.create({
            fpo_id: fpoId,
            order_id: order._id,
            total_amount: order.total_price,
            distributions,
            notes: notes || ''
        });

        // Update member pending payments
        for (const dist of distributions) {
            const member = await FPOMember.findById(dist.member_id);
            if (member) {
                member.pending_payment = (member.pending_payment || 0) + dist.amount;
                member.total_revenue_generated = (member.total_revenue_generated || 0) + dist.amount;
                await member.save();
            }
        }

        const populatedDistribution = await FPOPaymentDistribution.findById(distribution._id)
            .populate('order_id')
            .populate('distributions.member_id')
            .populate('distributions.farmer_id', 'full_name email');

        res.status(201).json({
            message: 'Payment distribution created successfully',
            distribution: populatedDistribution
        });
    } catch (error: any) {
        console.error('Error creating payment distribution:', error);
        res.status(500).json({ error: error.message || 'Error creating payment distribution' });
    }
};

// Get payment distributions
export const getPaymentDistributions = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fpoId = req.user.id;

        // Verify user is an FPO
        if (req.user.role !== 'fpo') {
            return res.status(403).json({ error: 'Only FPOs can access payment distributions' });
        }

        const distributions = await FPOPaymentDistribution.find({ fpo_id: fpoId })
            .populate('order_id')
            .populate('distributions.member_id')
            .populate('distributions.farmer_id', 'full_name email')
            .sort({ created_at: -1 });

        res.json({ distributions });
    } catch (error: any) {
        console.error('Error fetching payment distributions:', error);
        res.status(500).json({ error: error.message || 'Error fetching payment distributions' });
    }
};

// Auto-balance contributions among all FPO members
export const autoBalanceContributions = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fpoId = req.user.id;

        // Verify user is an FPO
        if (req.user.role !== 'fpo') {
            return res.status(403).json({ error: 'Only FPOs can balance contributions' });
        }

        // Get all active members
        const members = await FPOMember.find({ fpo_id: fpoId, status: 'active' });
        
        if (members.length === 0) {
            return res.status(400).json({ error: 'No active members found to balance contributions' });
        }

        // Calculate equal contribution percentage
        const equalContribution = Math.floor(100 / members.length);
        const remainder = 100 - (equalContribution * members.length);

        // Update all members with equal contributions
        const updatePromises = members.map(async (member, index) => {
            const contribution = equalContribution + (index < remainder ? 1 : 0);
            return FPOMember.findByIdAndUpdate(member._id, { 
                contribution_percentage: contribution 
            });
        });

        await Promise.all(updatePromises);

        // Get updated members
        const updatedMembers = await FPOMember.find({ fpo_id: fpoId })
            .populate('farmer_id', 'full_name email phone location')
            .sort({ created_at: -1 });

        res.json({
            message: 'Contributions balanced successfully',
            members: updatedMembers,
            summary: {
                total_members: members.length,
                equal_contribution: equalContribution,
                remainder_distributed: remainder,
                total_percentage: 100
            }
        });
    } catch (error: any) {
        console.error('Error balancing contributions:', error);
        res.status(500).json({ error: error.message || 'Error balancing contributions' });
    }
};

// Update payment distribution status (mark as paid)
export const updatePaymentDistribution = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fpoId = req.user.id;
        const { id } = req.params;
        const { distribution_index, payment_method, transaction_hash } = req.body;

        // Verify user is an FPO
        if (req.user.role !== 'fpo') {
            return res.status(403).json({ error: 'Only FPOs can update payment distributions' });
        }

        const distribution = await FPOPaymentDistribution.findOne({ _id: id, fpo_id: fpoId });
        if (!distribution) {
            return res.status(404).json({ error: 'Distribution not found' });
        }

        // Update specific distribution
        if (distribution_index !== undefined && distribution.distributions[distribution_index]) {
            distribution.distributions[distribution_index].status = 'paid';
            distribution.distributions[distribution_index].payment_method = payment_method;
            distribution.distributions[distribution_index].transaction_hash = transaction_hash;
            distribution.distributions[distribution_index].paid_at = new Date();

            // Update member's pending payment
            const member = await FPOMember.findById(distribution.distributions[distribution_index].member_id);
            if (member) {
                member.pending_payment = Math.max(0, (member.pending_payment || 0) - distribution.distributions[distribution_index].amount);
                await member.save();
            }
        }

        // Check if all distributions are paid
        const allPaid = distribution.distributions.every(d => d.status === 'paid');
        if (allPaid) {
            distribution.distribution_status = 'completed';
        } else if (distribution.distributions.some(d => d.status === 'paid')) {
            distribution.distribution_status = 'processing';
        }

        await distribution.save();

        const updatedDistribution = await FPOPaymentDistribution.findById(id)
            .populate('order_id')
            .populate('distributions.member_id')
            .populate('distributions.farmer_id', 'full_name email');

        res.json({
            message: 'Payment distribution updated successfully',
            distribution: updatedDistribution
        });
    } catch (error: any) {
        console.error('Error updating payment distribution:', error);
        res.status(500).json({ error: error.message || 'Error updating payment distribution' });
    }
};
