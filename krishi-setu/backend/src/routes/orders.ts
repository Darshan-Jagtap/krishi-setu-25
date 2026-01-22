import express from 'express';
import {
    createOrder,
    getUserOrders,
    getOrder,
    updateOrderStatus,
    getSellerOrders,
    cancelOrder
} from '../controllers/orderController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Buyer routes
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);

// Seller routes
router.get('/seller-orders', getSellerOrders);

// Shared routes
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

export default router;

