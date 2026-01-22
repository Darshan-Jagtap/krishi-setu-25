import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mlPriceService } from '@/services/mlPriceService';
import AIImageAnalytics from '@/components/AIImageAnalytics';
import {
    TrendingUp,
    Package,
    DollarSign,
    BarChart3,
    AlertCircle,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight,
    Leaf,
    Camera,
    Droplets,
    Sun,
    Sparkles,
    Target,
    Eye,
    Upload,
    RefreshCw,
    Bell,
    MapPin,
    Clock,
    Gauge,
    Activity,
    Zap,
    ShoppingCart,
    TrendingDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

import { statsAPI, authAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FarmerStats {
    totalRevenue: number;
    activeListings: number;
    avgPrice: number;
    growthRate: number;
    pendingOrders: number;
    totalOrders: number;
    totalProducts: number;
    recentRevenue: number;
}

interface RecentOrder {
    _id: string;
    product_name: string;
    buyer_name: string;
    quantity: number;
    total_amount: number;
    status: string;
    created_at: string;
}

interface ProductPerformance {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    totalSold: number;
    revenue: number;
    status: string;
}

const FarmerDashboardEnhanced = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [stats, setStats] = useState<FarmerStats>({
        totalRevenue: 0,
        activeListings: 0,
        avgPrice: 0,
        growthRate: 0,
        pendingOrders: 0,
        totalOrders: 0,
        totalProducts: 0,
        recentRevenue: 0
    });

    const [animatedStats, setAnimatedStats] = useState<FarmerStats>({
        totalRevenue: 0,
        activeListings: 0,
        avgPrice: 0,
        growthRate: 0,
        pendingOrders: 0,
        totalOrders: 0,
        totalProducts: 0,
        recentRevenue: 0
    });

    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
    const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
    const [statusDistribution, setStatusDistribution] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [userData, setUserData] = useState<any>(null);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Load user data
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            setUserData(response.user);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // Load dashboard data
    useEffect(() => {
        loadDashboardData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            loadDashboardData(true);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async (silent = false) => {
        try {
            if (!silent) setIsLoading(true);

            const response = await statsAPI.getFarmerStats();

            if (response.success) {
                const newStats = response.stats;
                setStats(newStats);
                setRecentOrders(response.recentOrders || []);
                setRevenueTrend(response.revenueTrend || []);
                setProductPerformance(response.productPerformance || []);
                setStatusDistribution(response.statusDistribution || {});
                setLastUpdated(new Date());

                // Animate stats
                animateStats(newStats);

                if (silent) {
                    toast({
                        title: 'Dashboard Updated',
                        description: 'Latest data loaded successfully',
                        duration: 2000
                    });
                }
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            if (!silent) {
                toast({
                    title: 'Error',
                    description: 'Failed to load dashboard data',
                    variant: 'destructive'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const animateStats = (targetStats: FarmerStats) => {
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setAnimatedStats({
                totalRevenue: Math.round(targetStats.totalRevenue * easeOutQuart),
                activeListings: Math.round(targetStats.activeListings * easeOutQuart),
                avgPrice: Math.round(targetStats.avgPrice * easeOutQuart),
                growthRate: parseFloat((targetStats.growthRate * easeOutQuart).toFixed(1)),
                pendingOrders: Math.round(targetStats.pendingOrders * easeOutQuart),
                totalOrders: Math.round(targetStats.totalOrders * easeOutQuart),
                totalProducts: Math.round(targetStats.totalProducts * easeOutQuart),
                recentRevenue: Math.round(targetStats.recentRevenue * easeOutQuart)
            });

            if (currentStep >= steps) {
                clearInterval(interval);
                setAnimatedStats(targetStats);
            }
        }, stepDuration);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            performAIAnalysis(file);
        }
    };

    const performAIAnalysis = async (file: File) => {
        setIsAnalyzing(true);

        // Simulate AI analysis
        setTimeout(() => {
            const analysis = {
                quality: 'Premium',
                moisture: '8.5%',
                purity: '96%',
                oilContent: '42%',
                predictedPrice: 4500,
                confidence: 94,
                recommendations: [
                    'Optimal harvest time - current quality is at peak',
                    'Expected market price: ₹4,500/quintal',
                    'Storage recommendation: Cool, dry place for 2 weeks'
                ],
                defects: [],
                grade: 'A+'
            };
            setAiAnalysis(analysis);
            setIsAnalyzing(false);
        }, 3000);
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            'in-transit': 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    const statusChartData = Object.entries(statusDistribution).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value as number
    }));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
                    <p className="text-lg text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white border-l-4 border-green-600 p-6 rounded-xl shadow-md">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
                        <Leaf className="w-8 h-8 text-green-600" />
                        Welcome, {userData?.full_name || 'Farmer'}!
                    </h1>
                    <p className="text-gray-600 mt-2">Real-time farm management and marketplace insights</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-100"
                        onClick={() => loadDashboardData()}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        className="bg-green-600 text-white hover:bg-green-700 font-semibold"
                        onClick={() => navigate('/farmer-listings')}
                    >
                        <Package className="w-4 h-4 mr-2" />
                        List New Product
                    </Button>
                </div>
            </div>

            {/* Animated Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-green-500 bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full">
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(animatedStats.totalRevenue)}</div>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                            {animatedStats.growthRate >= 0 ? (
                                <ArrowUpRight className="w-3 h-3 text-green-600" />
                            ) : (
                                <ArrowDownRight className="w-3 h-3 text-red-600" />
                            )}
                            {Math.abs(animatedStats.growthRate)}% from last month
                        </p>
                        <Progress value={85} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-blue-500 bg-blue-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">Active Listings</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Package className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{animatedStats.activeListings}</div>
                        <p className="text-xs text-gray-600">
                            {animatedStats.totalProducts} total products
                        </p>
                        <Progress value={(animatedStats.activeListings / Math.max(animatedStats.totalProducts, 1)) * 100} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-purple-500 bg-purple-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">Avg Price/Quintal</CardTitle>
                        <div className="p-2 bg-purple-100 rounded-full">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(animatedStats.avgPrice)}</div>
                        <p className="text-xs text-gray-600">
                            Across all products
                        </p>
                        <Progress value={(animatedStats.avgPrice / 5000) * 100} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-orange-500 bg-orange-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">Pending Orders</CardTitle>
                        <div className="p-2 bg-orange-100 rounded-full">
                            <ShoppingCart className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{animatedStats.pendingOrders}</div>
                        <p className="text-xs text-gray-600">
                            {animatedStats.totalOrders} total orders
                        </p>
                        <Progress value={(animatedStats.pendingOrders / Math.max(animatedStats.totalOrders, 1)) * 100} className="mt-2 h-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <Activity className="w-4 h-4 mr-2" />
                        Recent Orders
                    </TabsTrigger>
                    <TabsTrigger value="products" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                        <Package className="w-4 h-4 mr-2" />
                        Top Products
                    </TabsTrigger>
                    <TabsTrigger value="ai-analysis" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                        <Camera className="w-4 h-4 mr-2" />
                        AI Analysis
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Trend Chart */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Revenue Trend
                                </CardTitle>
                                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {revenueTrend.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <AreaChart data={revenueTrend}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                            <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                                        No revenue data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Status Distribution */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gauge className="w-5 h-5 text-blue-600" />
                                    Order Status Distribution
                                </CardTitle>
                                <CardDescription>Breakdown of orders by status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {statusChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={statusChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {statusChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                                        No order data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Recent Orders Tab */}
                <TabsContent value="orders" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Recent Orders
                            </CardTitle>
                            <CardDescription>Latest orders from buyers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium">{order.product_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Buyer: {order.buyer_name} • Qty: {order.quantity}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">{formatCurrency(order.total_amount)}</p>
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No recent orders</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Top Products Tab */}
                <TabsContent value="products" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-purple-600" />
                                Top Performing Products
                            </CardTitle>
                            <CardDescription>Your best-selling products</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {productPerformance.length > 0 ? (
                                <div className="space-y-4">
                                    {productPerformance.map((product, index) => (
                                        <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.category} • {formatCurrency(product.price)}/qt
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                                                <p className="text-sm text-muted-foreground">{product.totalSold} sold</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No product data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* AI Analysis Tab */}
                <TabsContent value="ai-analysis" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Image Upload */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-blue-600" />
                                    AI Image Analysis
                                </CardTitle>
                                <CardDescription>Upload oilseed images for quality assessment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-lg font-medium">Upload Oilseed Image</p>
                                            <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                                        </label>
                                    </div>

                                    {selectedImage && (
                                        <div className="space-y-4">
                                            <img src={selectedImage} alt="Uploaded" className="w-full rounded-lg" />
                                            {isAnalyzing ? (
                                                <div className="text-center">
                                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                    <p>Analyzing image...</p>
                                                </div>
                                            ) : aiAnalysis && (
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-3 bg-green-50 rounded-lg">
                                                            <p className="text-sm text-green-600">Quality</p>
                                                            <p className="font-bold">{aiAnalysis.quality}</p>
                                                        </div>
                                                        <div className="p-3 bg-blue-50 rounded-lg">
                                                            <p className="text-sm text-blue-600">Predicted Price</p>
                                                            <p className="font-bold">₹{aiAnalysis.predictedPrice}/qt</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-purple-50 rounded-lg">
                                                        <p className="text-sm text-purple-600">AI Confidence</p>
                                                        <div className="flex items-center gap-2">
                                                            <Progress value={aiAnalysis.confidence} className="flex-1" />
                                                            <span className="font-bold">{aiAnalysis.confidence}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Recommendations */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-purple-600" />
                                    AI Recommendations
                                </CardTitle>
                                <CardDescription>Smart insights based on analysis</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {aiAnalysis ? (
                                        <>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-green-800">Optimal Harvest Time</p>
                                                        <p className="text-sm text-green-600">{aiAnalysis.recommendations[0]}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                                    <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-blue-800">Market Price</p>
                                                        <p className="text-sm text-blue-600">{aiAnalysis.recommendations[1]}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                                    <Package className="w-5 h-5 text-purple-600 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-purple-800">Storage Advice</p>
                                                        <p className="text-sm text-purple-600">{aiAnalysis.recommendations[2]}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-muted-foreground">Upload an image to get AI recommendations</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-600" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                            className="h-20 flex-col"
                            variant="outline"
                            onClick={() => navigate('/farmer-listings')}
                        >
                            <Package className="w-6 h-6 mb-2" />
                            <span>My Listings</span>
                        </Button>
                        <Button
                            className="h-20 flex-col"
                            variant="outline"
                            onClick={() => navigate('/farmer-transactions')}
                        >
                            <Eye className="w-6 h-6 mb-2" />
                            <span>View Orders</span>
                        </Button>
                        <Button
                            className="h-20 flex-col"
                            variant="outline"
                            onClick={() => navigate('/marketplace')}
                        >
                            <TrendingUp className="w-6 h-6 mb-2" />
                            <span>Market Analysis</span>
                        </Button>
                        <Button
                            className="h-20 flex-col"
                            variant="outline"
                            onClick={() => loadDashboardData()}
                        >
                            <RefreshCw className="w-6 h-6 mb-2" />
                            <span>Refresh Data</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FarmerDashboardEnhanced;
