import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Order from '../models/Order';
import Product from '../models/Product';

// Get farmer dashboard statistics
export const getFarmerStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get all products by this farmer
        const products = await Product.find({ seller_id: userId });
        const productIds = products.map(p => p._id.toString());

        // Get all orders for farmer's products
        const orders = await Order.find({
            product_id: { $in: productIds }
        }).populate('product_id').populate('buyer_id', 'full_name email');

        // Calculate statistics
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Total Revenue (all delivered orders)
        const totalRevenue = orders
            .filter(o => o.status === 'delivered')
            .reduce((sum, o) => sum + (o.total_price || 0), 0);

        // Active Listings
        const activeListings = products.filter(p => p.status === 'available').length;

        // Average Price
        const avgPrice = products.length > 0
            ? Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length)
            : 0;

        // Recent Revenue (last 30 days)
        const recentRevenue = orders
            .filter(o => {
                const orderDate = new Date(o.created_at);
                return orderDate > thirtyDaysAgo && o.status === 'delivered';
            })
            .reduce((sum, o) => sum + (o.total_price || 0), 0);

        // Previous Revenue (30-60 days ago)
        const previousRevenue = orders
            .filter(o => {
                const orderDate = new Date(o.created_at);
                return orderDate > sixtyDaysAgo && orderDate <= thirtyDaysAgo && o.status === 'delivered';
            })
            .reduce((sum, o) => sum + (o.total_price || 0), 0);

        // Growth Rate
        const growthRate = previousRevenue > 0
            ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
            : recentRevenue > 0 ? 100 : 0;

        // Pending Orders
        const pendingOrders = orders.filter(o =>
            o.status === 'pending' || o.status === 'processing'
        ).length;

        // Recent Orders (last 10)
        const recentOrders = orders
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10)
            .map(order => {
                const buyerData: any = order.buyer_id;
                return {
                    _id: order._id,
                    product_name: order.product_name || 'Unknown Product',
                    buyer_name: buyerData?.full_name || order.delivery_info?.fullName || 'Unknown Buyer',
                    quantity: order.quantity,
                    total_amount: order.total_price,
                    status: order.status,
                    created_at: order.created_at
                };
            });

        // Monthly Revenue Trend (last 6 months)
        const monthlyRevenue: any = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        orders.forEach(order => {
            if (order.status === 'delivered') {
                const date = new Date(order.created_at);
                const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

                if (!monthlyRevenue[monthKey]) {
                    monthlyRevenue[monthKey] = {
                        month: monthNames[date.getMonth()],
                        revenue: 0,
                        count: 0
                    };
                }

                monthlyRevenue[monthKey].revenue += order.total_price || 0;
                monthlyRevenue[monthKey].count += 1;
            }
        });

        const revenueTrend = Object.values(monthlyRevenue)
            .slice(-6)
            .map((m: any) => ({
                month: m.month,
                revenue: Math.round(m.revenue),
                avgPrice: m.count > 0 ? Math.round(m.revenue / m.count) : 0
            }));

        // Product Performance
        const productPerformance = products.map(product => {
            const productOrders = orders.filter(o =>
                o.product_id === product._id.toString()
            );

            const totalSold = productOrders
                .filter(o => o.status === 'delivered')
                .reduce((sum, o) => sum + (o.quantity || 0), 0);

            const revenue = productOrders
                .filter(o => o.status === 'delivered')
                .reduce((sum, o) => sum + (o.total_price || 0), 0);

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
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        // Status Distribution
        const statusDistribution = {
            pending: orders.filter(o => o.status === 'pending').length,
            processing: orders.filter(o => o.status === 'processing').length,
            'in-transit': orders.filter(o => o.status === 'in-transit').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
        };

        res.json({
            success: true,
            stats: {
                totalRevenue: Math.round(totalRevenue),
                activeListings,
                avgPrice,
                growthRate: parseFloat(growthRate.toFixed(1)),
                pendingOrders,
                totalOrders: orders.length,
                totalProducts: products.length,
                recentRevenue: Math.round(recentRevenue)
            },
            recentOrders,
            revenueTrend,
            productPerformance,
            statusDistribution
        });
    } catch (error) {
        console.error('Error fetching farmer stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

// Get buyer dashboard statistics
export const getBuyerStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get all orders by this buyer
        const orders = await Order.find({ buyer_id: userId })
            .populate('product_id')
            .populate('seller_id', 'full_name email');

        // Calculate statistics
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total Spent
        const totalSpent = orders
            .filter(o => o.status === 'delivered')
            .reduce((sum, o) => sum + (o.total_price || 0), 0);

        // Active Orders
        const activeOrders = orders.filter(o =>
            o.status === 'pending' || o.status === 'processing' || o.status === 'in-transit'
        ).length;

        // Recent Orders (last 30 days)
        const recentOrdersCount = orders.filter(o => {
            const orderDate = new Date(o.created_at);
            return orderDate > thirtyDaysAgo;
        }).length;

        // Recent Orders (last 10)
        const recentOrders = orders
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10)
            .map(order => ({
                _id: order._id,
                product_name: order.product_name || 'Unknown Product',
                seller_name: order.supplier_name || 'Unknown Seller',
                quantity: order.quantity,
                total_amount: order.total_price,
                status: order.status,
                created_at: order.created_at
            }));

        // Monthly Spending Trend
        const monthlySpending: any = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        orders.forEach(order => {
            if (order.status === 'delivered') {
                const date = new Date(order.created_at);
                const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

                if (!monthlySpending[monthKey]) {
                    monthlySpending[monthKey] = {
                        month: monthNames[date.getMonth()],
                        spending: 0,
                        count: 0
                    };
                }

                monthlySpending[monthKey].spending += order.total_price || 0;
                monthlySpending[monthKey].count += 1;
            }
        });

        const spendingTrend = Object.values(monthlySpending)
            .slice(-6)
            .map((m: any) => ({
                month: m.month,
                spending: Math.round(m.spending),
                orders: m.count
            }));

        res.json({
            success: true,
            stats: {
                totalSpent: Math.round(totalSpent),
                activeOrders,
                totalOrders: orders.length,
                recentOrdersCount
            },
            recentOrders,
            spendingTrend
        });
    } catch (error) {
        console.error('Error fetching buyer stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
