import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { SmartContractService } from '../services/smartContractService';

// Create new order
export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const orderData = {
            ...req.body,
            buyer_id: req.user.id
        };

        const order = await Order.create(orderData);
        console.log(`✅ Order created: ${order._id}`);

        // Automatically create smart contract for ALL payment methods
        try {
            console.log(`🔄 Attempting to create smart contract for order ${order._id}...`);

            // Get product details for contract
            const product = await Product.findById(order.product_id);

            if (!product) {
                console.error(`❌ Product not found for order ${order._id}, product_id: ${order.product_id}`);
                throw new Error('Product not found');
            }

            console.log(`✅ Product found: ${product.name}`);

            // Determine quality grade (default to A if not specified)
            const agreedQualityGrade = req.body.agreed_quality_grade || 'A';

            // Create smart contract
            const contract = await SmartContractService.createContract({
                order_id: order._id.toString(),
                buyer_id: order.buyer_id.toString(),
                seller_id: order.seller_id || product.seller_id?.toString() || 'unknown',
                product_name: order.product_name || product.name,
                quantity: order.quantity,
                unit: product.unit || 'kg',
                agreed_quality_grade: agreedQualityGrade,
                base_price: product.price,
                buyer_wallet: req.body.buyer_wallet,
                seller_wallet: req.body.seller_wallet
            });

            // Update order with contract details
            order.smart_contract_id = contract.contract_id;
            order.blockchain_hash = contract.blockchain_hash;
            order.order_notes = JSON.stringify({
                agreed_quality_grade: contract.agreed_quality_grade,
                buyer_wallet: contract.buyer_wallet,
                seller_wallet: contract.seller_wallet,
                contract_created_at: contract.created_at
            });
            await order.save();

            console.log(`✅ Smart contract created: ${contract.contract_id} for order ${order._id}`);
        } catch (contractError: any) {
            console.error('⚠️ Failed to create smart contract:', contractError.message);
            console.error('Stack trace:', contractError.stack);
            // Don't fail the order creation if contract creation fails
        }

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error: any) {
        console.error('Create order error:', error);
        res.status(500).json({ error: error.message || 'Error creating order' });
    }
};

// Get user's orders
export const getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const orders = await Order.find({ buyer_id: req.user.id })
            .sort({ created_at: -1 });

        res.json({ orders });
    } catch (error: any) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: error.message || 'Error fetching orders' });
    }
};

// Get single order
export const getOrder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user is buyer or seller
        const isBuyer = order.buyer_id.toString() === req.user.id;
        const isSeller = order.seller_id === req.user.id;

        if (!isBuyer && !isSeller) {
            return res.status(403).json({ error: 'Not authorized to view this order' });
        }

        res.json({ order });
    } catch (error: any) {
        console.error('Get order error:', error);
        res.status(500).json({ error: error.message || 'Error fetching order' });
    }
};

// Update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { id } = req.params;
        const { status, progress } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Allow both buyer and seller to update
        const isBuyer = order.buyer_id.toString() === req.user.id;
        const isSeller = order.seller_id === req.user.id;

        if (!isBuyer && !isSeller) {
            return res.status(403).json({ error: 'Not authorized to update this order' });
        }

        if (status) order.status = status;
        if (progress !== undefined) order.progress = progress;

        await order.save();

        res.json({
            message: 'Order updated successfully',
            order
        });
    } catch (error: any) {
        console.error('Update order error:', error);
        res.status(500).json({ error: error.message || 'Error updating order' });
    }
};

// Get seller's orders with populated data
export const getSellerOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const orders = await Order.find({ seller_id: req.user.id })
            .sort({ created_at: -1 })
            .lean();

        // Populate buyer and product data
        const populatedOrders = await Promise.all(
            orders.map(async (order) => {
                // Get buyer data
                const buyer = await User.findById(order.buyer_id).select('full_name email phone location');

                // Get product data if product_id exists
                let product = null;
                if (order.product_id) {
                    product = await Product.findById(order.product_id).select('name category price unit');
                }

                return {
                    ...order,
                    buyer_id: buyer || { full_name: 'Unknown', email: 'N/A', phone: 'N/A', location: 'N/A' },
                    product_id: product || { name: order.product_name, category: 'N/A', price: 0, unit: 'units' },
                    total_amount: order.total_price
                };
            })
        );

        res.json({ orders: populatedOrders });
    } catch (error: any) {
        console.error('Get seller orders error:', error);
        res.status(500).json({ error: error.message || 'Error fetching orders' });
    }
};

// Cancel order
export const cancelOrder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { id } = req.params;
        const { reason } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user is buyer or seller
        const isBuyer = order.buyer_id.toString() === req.user.id;
        const isSeller = order.seller_id === req.user.id;

        if (!isBuyer && !isSeller) {
            return res.status(403).json({ error: 'Not authorized to cancel this order' });
        }

        // Only allow cancellation if order is pending or processing
        if (order.status !== 'pending' && order.status !== 'processing') {
            return res.status(400).json({ error: 'Cannot cancel order in current status' });
        }

        order.status = 'cancelled';
        if (reason) {
            order.order_notes = (order.order_notes || '') + `\nCancellation reason: ${reason}`;
        }

        await order.save();

        res.json({
            message: 'Order cancelled successfully',
            order
        });
    } catch (error: any) {
        console.error('Cancel order error:', error);
        res.status(500).json({ error: error.message || 'Error cancelling order' });
    }
};

