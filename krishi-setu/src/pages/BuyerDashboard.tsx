import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    ShoppingCart,
    Package,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Shield,
    Clock,
    CheckCircle2,
    ArrowRight,
    Zap,
    Star,
    Users,
    BarChart3,
    Download,
    RefreshCw,
    Bell,
    Search,
    Filter,
    Eye,
    Heart,
    MapPin,
    Truck,
    AlertCircle,
    Award,
    Target,
    Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const BuyerDashboard = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');

    const stats = [
        {
            title: 'Total Spent',
            value: '₹58.5L',
            change: '+15.2%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
            textColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            title: 'Active Orders',
            value: '24',
            change: '8 pending',
            trend: 'neutral',
            icon: Package,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            textColor: 'text-purple-600 dark:text-purple-400'
        },
        {
            title: 'Avg Savings',
            value: '12.5%',
            change: 'vs market',
            trend: 'up',
            icon: TrendingDown,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            textColor: 'text-green-600 dark:text-green-400'
        },
        {
            title: 'Smart Contracts',
            value: '156',
            change: 'All verified',
            trend: 'up',
            icon: Shield,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950/20',
            textColor: 'text-orange-600 dark:text-orange-400'
        }
    ];

    const recentOrders = [
        { id: 'ORD001', product: 'Soybean Meal', quantity: '1000 kg', amount: 45000, status: 'delivered', date: '2 days ago', supplier: 'Green Valley', progress: 100 },
        { id: 'ORD002', product: 'Mustard Oil Cake', quantity: '500 kg', amount: 14000, status: 'in-transit', date: '1 day ago', supplier: 'Harvest Mills', progress: 65 },
        { id: 'ORD003', product: 'Groundnut Husk', quantity: '800 kg', amount: 12000, status: 'processing', date: '3 hours ago', supplier: 'Agro Solutions', progress: 30 }
    ];

    const topSuppliers = [
        { name: 'Green Valley Processors', orders: 45, rating: 4.9, reliability: 98, savings: '15%' },
        { name: 'Harvest Oil Mills', orders: 32, rating: 4.7, reliability: 95, savings: '12%' },
        { name: 'Agro Waste Solutions', orders: 28, rating: 4.8, reliability: 97, savings: '18%' }
    ];

    const purchaseData = [
        { month: 'Jul', amount: 420, orders: 12 },
        { month: 'Aug', amount: 580, orders: 15 },
        { month: 'Sep', amount: 650, orders: 18 },
        { month: 'Oct', amount: 720, orders: 21 },
        { month: 'Nov', amount: 850, orders: 24 },
        { month: 'Dec', amount: 920, orders: 28 }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400';
            case 'in-transit': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
            case 'processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Buyer Dashboard
                        </h1>
                        <p className="text-muted-foreground">Welcome back, {user?.email?.split('@')[0] || 'Buyer'}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 hover:scale-105 transition-transform" onClick={() => {
                            toast({ title: 'Exporting data...', description: 'Your report will be downloaded shortly' });
                        }}>
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-transform" onClick={() => navigate('/marketplace')}>
                            <ShoppingCart className="w-4 h-4" />
                            New Order
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1">
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                                    {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                                    <span className="text-sm text-muted-foreground">{stat.change}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Purchase Trends */}
                    <Card className="lg:col-span-2 border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-primary" />
                                        Purchase Trends
                                    </CardTitle>
                                    <CardDescription>Last 6 months performance</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={purchaseData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { icon: ShoppingCart, label: 'Browse Marketplace', color: 'text-blue-600', path: '/marketplace' },
                                { icon: Package, label: 'Track Orders', color: 'text-purple-600', path: '/buyer-orders' },
                                { icon: Users, label: 'Find Suppliers', color: 'text-green-600', path: '/buyer-suppliers' },
                                { icon: BarChart3, label: 'View Analytics', color: 'text-orange-600', path: '/buyer-analytics' }
                            ].map((action, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    className="w-full justify-start gap-3 hover:bg-accent hover:scale-105 transition-all"
                                    onClick={() => navigate(action.path)}
                                >
                                    <action.icon className={`w-5 h-5 ${action.color}`} />
                                    {action.label}
                                    <ArrowRight className="w-4 h-4 ml-auto" />
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" />
                                    Recent Orders
                                </CardTitle>
                                <CardDescription>Track your latest purchases</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/buyer-orders')}>
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map((order, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-lg border hover:shadow-md transition-all duration-300 hover:border-primary group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-lg">{order.product}</h4>
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {order.quantity}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {order.supplier}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {order.date}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">₹{order.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">{order.id}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-semibold">{order.progress}%</span>
                                        </div>
                                        <Progress value={order.progress} className="h-2" />
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Button size="sm" variant="outline" className="gap-2 hover:scale-105 transition-transform" onClick={() => navigate('/buyer-orders')}>
                                            <Eye className="w-3 h-3" />
                                            View
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-2 hover:scale-105 transition-transform" onClick={() => {
                                            toast({ title: 'Tracking order...', description: `Tracking ${order.id}` });
                                        }}>
                                            <Truck className="w-3 h-3" />
                                            Track
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Suppliers */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            Top Suppliers
                        </CardTitle>
                        <CardDescription>Your most reliable partners</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topSuppliers.map((supplier, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-lg border hover:shadow-md transition-all duration-300 hover:border-primary"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                {supplier.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{supplier.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                        <span className="text-sm font-semibold">{supplier.rating}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {supplier.orders} orders
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" className="gap-2 hover:scale-105 transition-transform" onClick={() => navigate('/buyer-suppliers')}>
                                            View Profile
                                            <ArrowRight className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground text-xs mb-1">Reliability</p>
                                            <p className="font-semibold text-green-600">{supplier.reliability}%</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs mb-1">Avg Savings</p>
                                            <p className="font-semibold text-blue-600">{supplier.savings}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs mb-1">Status</p>
                                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default BuyerDashboard;
