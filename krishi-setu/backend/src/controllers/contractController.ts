import { Request, Response } from 'express';
import Order from '../models/Order';
import { SmartContractService } from '../services/smartContractService';

/**
 * Update order with smart contract details
 */
export const updateOrderContract = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const {
            smart_contract_id,
            blockchain_hash,
            agreed_quality_grade,
            buyer_wallet
        } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order with contract details
        order.smart_contract_id = smart_contract_id;
        order.blockchain_hash = blockchain_hash;

        // Store quality grade and wallet in order_notes as JSON
        const contractData = {
            agreed_quality_grade,
            buyer_wallet,
            contract_created_at: new Date().toISOString()
        };

        order.order_notes = JSON.stringify(contractData);
        await order.save();

        res.json({
            success: true,
            message: 'Order contract details updated successfully',
            order
        });
    } catch (error: any) {
        console.error('Error updating order contract:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order contract',
            error: error.message
        });
    }
};

/**
 * Create a smart contract for an order
 */
export const createSmartContract = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const {
            agreed_quality_grade,
            buyer_wallet,
            seller_wallet
        } = req.body;

        // Get the order
        const order = await Order.findById(orderId)
            .populate('buyer_id')
            .populate('seller_id')
            .populate('product_id');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Extract populated data safely
        const buyerId = (order.buyer_id as any)?._id?.toString() || order.buyer_id.toString();
        const sellerId = (order.seller_id as any)?._id?.toString() || order.seller_id || 'unknown';
        const productName = (order.product_id as any)?.name || order.product_name || 'Product';
        const productUnit = (order.product_id as any)?.unit || 'kg';
        const productPrice = (order.product_id as any)?.price || (order.total_price / order.quantity);

        // Create smart contract
        const contract = await SmartContractService.createContract({
            order_id: orderId,
            buyer_id: buyerId,
            seller_id: sellerId,
            product_name: productName,
            quantity: order.quantity,
            unit: productUnit,
            agreed_quality_grade: agreed_quality_grade || 'A',
            base_price: productPrice,
            buyer_wallet,
            seller_wallet
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

        res.json({
            success: true,
            message: 'Smart contract created successfully',
            contract: {
                contract_id: contract.contract_id,
                blockchain_hash: contract.blockchain_hash,
                transaction_hash: contract.transaction_hash,
                block_number: contract.block_number,
                status: contract.status,
                payment_status: contract.payment_status,
                total_amount: contract.total_amount,
                agreed_quality_grade: contract.agreed_quality_grade
            }
        });
    } catch (error: any) {
        console.error('Error creating smart contract:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create smart contract',
            error: error.message
        });
    }
};

/**
 * Get contract details for an order
 */
export const getOrderContract = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        // Get contract by order ID
        const contract = await SmartContractService.getContractByOrderId(orderId);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found for this order'
            });
        }

        res.json({
            success: true,
            contract: {
                contract_id: contract.contract_id,
                order_id: contract.order_id,
                blockchain_hash: contract.blockchain_hash,
                transaction_hash: contract.transaction_hash,
                block_number: contract.block_number,
                buyer_wallet: contract.buyer_wallet,
                seller_wallet: contract.seller_wallet,
                product_name: contract.product_name,
                quantity: contract.quantity,
                unit: contract.unit,
                agreed_quality_grade: contract.agreed_quality_grade,
                measured_quality_grade: contract.measured_quality_grade,
                base_price: contract.base_price,
                total_amount: contract.total_amount,
                final_amount: contract.final_amount,
                price_adjustment: contract.price_adjustment,
                adjustment_percentage: contract.adjustment_percentage,
                status: contract.status,
                payment_status: contract.payment_status,
                iot_data: contract.iot_data,
                created_at: contract.created_at,
                funded_at: contract.funded_at,
                delivered_at: contract.delivered_at,
                completed_at: contract.completed_at
            }
        });
    } catch (error: any) {
        console.error('Error getting contract:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contract details',
            error: error.message
        });
    }
};

/**
 * Finalize delivery with IoT quality measurement
 */
export const finalizeDelivery = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { measured_quality_grade, iot_data } = req.body;

        // Get contract
        const existingContract = await SmartContractService.getContractByOrderId(orderId);

        if (!existingContract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found for this order'
            });
        }

        // Finalize delivery
        const contract = await SmartContractService.finalizeDelivery(
            existingContract.contract_id,
            measured_quality_grade,
            iot_data
        );

        // Update order status
        const order = await Order.findById(orderId);
        if (order) {
            order.status = 'delivered';
            order.order_notes = JSON.stringify({
                ...JSON.parse(order.order_notes || '{}'),
                measured_quality_grade: contract.measured_quality_grade,
                final_amount: contract.final_amount,
                price_adjustment: contract.price_adjustment,
                iot_data: contract.iot_data,
                delivered_at: contract.delivered_at
            });
            await order.save();
        }

        res.json({
            success: true,
            message: 'Delivery finalized successfully',
            contract: {
                contract_id: contract.contract_id,
                measured_quality_grade: contract.measured_quality_grade,
                final_amount: contract.final_amount,
                price_adjustment: contract.price_adjustment,
                adjustment_percentage: contract.adjustment_percentage,
                status: contract.status,
                payment_status: contract.payment_status,
                iot_data: contract.iot_data
            }
        });
    } catch (error: any) {
        console.error('Error finalizing delivery:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to finalize delivery',
            error: error.message
        });
    }
};

/**
 * Calculate price adjustment
 */
export const calculatePriceAdjustment = async (req: Request, res: Response) => {
    try {
        const { agreed_quality_grade, measured_quality_grade, total_amount } = req.body;

        const result = SmartContractService.calculatePriceAdjustment(
            agreed_quality_grade,
            measured_quality_grade,
            total_amount
        );

        res.json({
            success: true,
            calculation: {
                agreed_quality_grade,
                measured_quality_grade,
                total_amount,
                final_amount: result.finalAmount,
                price_adjustment: result.adjustment,
                adjustment_percentage: result.percentage
            }
        });
    } catch (error: any) {
        console.error('Error calculating price adjustment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate price adjustment',
            error: error.message
        });
    }
};

/**
 * Simulate IoT measurement for testing
 */
export const simulateIoTMeasurement = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        // Get contract
        const contract = await SmartContractService.getContractByOrderId(orderId);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found for this order'
            });
        }

        // Simulate IoT measurement
        const { grade, data } = SmartContractService.simulateIoTMeasurement(
            contract.agreed_quality_grade
        );

        res.json({
            success: true,
            message: 'IoT measurement simulated',
            measurement: {
                agreed_quality_grade: contract.agreed_quality_grade,
                measured_quality_grade: grade,
                iot_data: data,
                note: 'This is a simulated measurement for testing purposes'
            }
        });
    } catch (error: any) {
        console.error('Error simulating IoT measurement:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to simulate IoT measurement',
            error: error.message
        });
    }
};

/**
 * Get contract by contract ID
 */
export const getContractById = async (req: Request, res: Response) => {
    try {
        const { contractId } = req.params;

        const contract = await SmartContractService.getContract(contractId);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        res.json({
            success: true,
            contract: {
                contract_id: contract.contract_id,
                order_id: contract.order_id,
                blockchain_hash: contract.blockchain_hash,
                transaction_hash: contract.transaction_hash,
                block_number: contract.block_number,
                buyer_id: contract.buyer_id,
                seller_id: contract.seller_id,
                buyer_wallet: contract.buyer_wallet,
                seller_wallet: contract.seller_wallet,
                product_name: contract.product_name,
                quantity: contract.quantity,
                unit: contract.unit,
                agreed_quality_grade: contract.agreed_quality_grade,
                measured_quality_grade: contract.measured_quality_grade,
                base_price: contract.base_price,
                total_amount: contract.total_amount,
                final_amount: contract.final_amount,
                price_adjustment: contract.price_adjustment,
                adjustment_percentage: contract.adjustment_percentage,
                status: contract.status,
                payment_status: contract.payment_status,
                iot_data: contract.iot_data,
                created_at: contract.created_at,
                funded_at: contract.funded_at,
                delivered_at: contract.delivered_at,
                completed_at: contract.completed_at
            }
        });
    } catch (error: any) {
        console.error('Error getting contract by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contract',
            error: error.message
        });
    }
};

/**
 * Get contract by blockchain hash
 */
export const getContractByHash = async (req: Request, res: Response) => {
    try {
        const { hash } = req.params;

        // Find contract by blockchain hash
        const contract = await SmartContractService.getContractByHash(hash);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found with this hash'
            });
        }

        res.json({
            success: true,
            contract: {
                contract_id: contract.contract_id,
                order_id: contract.order_id,
                blockchain_hash: contract.blockchain_hash,
                transaction_hash: contract.transaction_hash,
                block_number: contract.block_number,
                buyer_id: contract.buyer_id,
                seller_id: contract.seller_id,
                buyer_wallet: contract.buyer_wallet,
                seller_wallet: contract.seller_wallet,
                product_name: contract.product_name,
                quantity: contract.quantity,
                unit: contract.unit,
                agreed_quality_grade: contract.agreed_quality_grade,
                measured_quality_grade: contract.measured_quality_grade,
                base_price: contract.base_price,
                total_amount: contract.total_amount,
                final_amount: contract.final_amount,
                price_adjustment: contract.price_adjustment,
                adjustment_percentage: contract.adjustment_percentage,
                status: contract.status,
                payment_status: contract.payment_status,
                iot_data: contract.iot_data,
                created_at: contract.created_at,
                funded_at: contract.funded_at,
                delivered_at: contract.delivered_at,
                completed_at: contract.completed_at
            }
        });
    } catch (error: any) {
        console.error('Error getting contract by hash:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contract',
            error: error.message
        });
    }
};
