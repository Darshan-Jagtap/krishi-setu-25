import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Get Processor Statistics
export const getProcessorStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get all products by this processor
        const products = await Product.find({ seller_id: userId });
        const productIds = products.map(p => p._id.toString());

        // Get all orders for processor's products
        const allOrders = await Order.find({ product_id: { $in: productIds } })
            .populate('buyer_id', 'full_name email')
            .sort({ created_at: -1 });

        // Calculate statistics
        const totalRevenue = allOrders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, order) => sum + (order.total_price || 0), 0);

        const activeListings = products.filter(p => p.status === 'available').length;
        const totalProducts = products.length;

        const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
        const processingOrders = allOrders.filter(o => o.status === 'processing').length;
        const completedOrders = allOrders.filter(o => o.status === 'delivered').length;
        const totalOrders = allOrders.length;

        // Calculate average price
        const avgPrice = products.length > 0
            ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length
            : 0;

        // Calculate growth rate (comparing last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const recentRevenue = allOrders
            .filter(o => new Date(o.created_at) >= thirtyDaysAgo && o.status !== 'cancelled')
            .reduce((sum, order) => sum + (order.total_price || 0), 0);

        const previousRevenue = allOrders
            .filter(o =>
                new Date(o.created_at) >= sixtyDaysAgo &&
                new Date(o.created_at) < thirtyDaysAgo &&
                o.status !== 'cancelled'
            )
            .reduce((sum, order) => sum + (order.total_price || 0), 0);

        const growthRate = previousRevenue > 0
            ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
            : 0;

        // Get recent orders (last 10)
        const recentOrders = allOrders.slice(0, 10).map(order => {
            const product = products.find(p => p._id.toString() === order.product_id);
            return {
                _id: order._id,
                product_name: order.product_name || product?.name || 'Unknown Product',
                buyer_name: (order.buyer_id as any)?.full_name || 'Unknown Buyer',
                quantity: order.quantity,
                total_amount: order.total_price,
                status: order.status,
                created_at: order.created_at,
                progress: order.progress || 0
            };
        });

        // Revenue trend (last 6 months)
        const revenueTrend = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);

            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);

            const monthRevenue = allOrders
                .filter(o => {
                    const orderDate = new Date(o.created_at);
                    return orderDate >= monthStart && orderDate < monthEnd && o.status !== 'cancelled';
                })
                .reduce((sum, order) => sum + (order.total_price || 0), 0);

            revenueTrend.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
                revenue: monthRevenue
            });
        }

        // Product performance (top 5 products by revenue)
        const productPerformance = await Promise.all(
            products.map(async (product) => {
                const productOrders = allOrders.filter(o =>
                    o.product_id === product._id.toString() &&
                    o.status !== 'cancelled'
                );

                const revenue = productOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
                const totalSold = productOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);

                return {
                    _id: product._id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    quantity: product.quantity,
                    totalSold,
                    revenue,
                    status: product.status
                };
            })
        );

        // Sort by revenue and take top 5
        productPerformance.sort((a, b) => b.revenue - a.revenue);
        const topProducts = productPerformance.slice(0, 5);

        // Status distribution
        const statusDistribution = {
            pending: allOrders.filter(o => o.status === 'pending').length,
            processing: allOrders.filter(o => o.status === 'processing').length,
            'in-transit': allOrders.filter(o => o.status === 'in-transit').length,
            delivered: allOrders.filter(o => o.status === 'delivered').length,
            cancelled: allOrders.filter(o => o.status === 'cancelled').length
        };

        // Category distribution
        const categoryDistribution: { [key: string]: number } = {};
        products.forEach(product => {
            const category = product.category || 'Other';
            categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
        });

        // Inventory alerts (low stock products)
        const lowStockProducts = products
            .filter(p => p.quantity < 100 && p.status === 'available')
            .map(p => ({
                _id: p._id,
                name: p.name,
                quantity: p.quantity,
                category: p.category
            }));

        res.json({
            success: true,
            stats: {
                totalRevenue,
                activeListings,
                avgPrice,
                growthRate,
                pendingOrders,
                processingOrders,
                completedOrders,
                totalOrders,
                totalProducts,
                recentRevenue
            },
            recentOrders,
            revenueTrend,
            productPerformance: topProducts,
            statusDistribution,
            categoryDistribution,
            lowStockProducts
        });

    } catch (error) {
        console.error('Error fetching processor stats:', error);
        res.status(500).json({ error: 'Failed to fetch processor statistics' });
    }
};
