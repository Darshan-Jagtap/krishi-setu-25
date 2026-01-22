import { Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Get all products (public)
export const getAllProducts = async (req: AuthRequest, res: Response) => {
    try {
        const { category, status, search } = req.query;

        console.log('🔍 Fetching products with filters:', { category, status, search });

        let query: any = {};

        if (category) query.category = category;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query)
            .populate('seller_id', 'full_name email')
            .sort({ created_at: -1 });

        console.log(`✅ Found ${products.length} products`);

        res.json({ products });
    } catch (error: any) {
        console.error('❌ Get products error:', error);
        res.status(500).json({ error: error.message || 'Error fetching products' });
    }
};

// Get single product
export const getProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('seller_id', 'full_name email phone location');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error: any) {
        console.error('Get product error:', error);
        res.status(500).json({ error: error.message || 'Error fetching product' });
    }
};

// Create product (seller only)
export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        console.log('📦 Creating product...');
        console.log('User:', req.user);
        console.log('Request body:', req.body);

        if (!req.user) {
            console.log('❌ No user authenticated');
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const productData = {
            ...req.body,
            seller_id: req.user.id
        };

        console.log('Product data to save:', productData);

        const product = await Product.create(productData);

        console.log('✅ Product created successfully:', product._id);

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error: any) {
        console.error('❌ Create product error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ error: error.message || 'Error creating product' });
    }
};

// Update product (seller only)
export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if user is the seller
        if (product.seller_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this product' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error: any) {
        console.error('Update product error:', error);
        res.status(500).json({ error: error.message || 'Error updating product' });
    }
};

// Delete product (seller only)
export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if user is the seller
        if (product.seller_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this product' });
        }

        await Product.findByIdAndDelete(id);

        res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: error.message || 'Error deleting product' });
    }
};

// Get seller's products
export const getSellerProducts = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const products = await Product.find({ seller_id: req.user.id })
            .sort({ created_at: -1 });

        res.json({ products });
    } catch (error: any) {
        console.error('Get seller products error:', error);
        res.status(500).json({ error: error.message || 'Error fetching products' });
    }
};
