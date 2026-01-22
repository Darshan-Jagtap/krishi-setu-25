import express from 'express';
import {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getSellerProducts
} from '../controllers/productController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);

// Protected routes (require authentication) - specific routes BEFORE parameterized routes
router.get('/seller/my-products', authenticate, getSellerProducts);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

// Parameterized routes (must be last)
router.get('/:id', getProduct);

export default router;
