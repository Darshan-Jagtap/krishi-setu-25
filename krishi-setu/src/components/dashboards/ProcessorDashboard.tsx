import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { statsAPI, productsAPI, ordersAPI } from '@/lib/api';
import {
  Store,
  TrendingUp,
  Package,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const ProcessorDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time data from backend
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeListings: 0,
    avgPrice: 0,
    growthRate: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState({});
  const [categoryDistribution, setCategoryDistribution] = useState({});
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [products, setProducts] = useState([]);

  // Load dashboard data
  const loadDashboardData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);

      console.log('Loading processor dashboard data...');

      // Try to load stats
      let statsResponse;
      try {
        statsResponse = await statsAPI.getProcessorStats();
        console.log('Stats response:', statsResponse);

        if (statsResponse.success) {
          setStats(statsResponse.stats);
          setRecentOrders(statsResponse.recentOrders || []);
          setRevenueTrend(statsResponse.revenueTrend || []);
          setProductPerformance(statsResponse.productPerformance || []);
          setStatusDistribution(statsResponse.statusDistribution || {});
          setCategoryDistribution(statsResponse.categoryDistribution || {});
          setLowStockProducts(statsResponse.lowStockProducts || []);
        }
      } catch (statsError) {
        console.error('Stats API error:', statsError);
        // Set default values if stats fail
        setStats({
          totalRevenue: 0,
          activeListings: 0,
          avgPrice: 0,
          growthRate: 0,
          pendingOrders: 0,
          processingOrders: 0,
          completedOrders: 0,
          totalOrders: 0,
          totalProducts: 0,
          recentRevenue: 0
        });
        setRecentOrders([]);
        setRevenueTrend([]);
        setProductPerformance([]);
        setStatusDistribution({});
        setCategoryDistribution({});
        setLowStockProducts([]);
      }

      // Try to load products
      try {
        const productsResponse = await productsAPI.getMyProducts();
        console.log('Products response:', productsResponse);

        if (productsResponse.success) {
          setProducts(productsResponse.products || []);
        }
      } catch (productsError) {
        console.error('Products API error:', productsError);
        setProducts([]);
      }

      if (!silent) {
        toast({
          title: 'Dashboard Updated',
          description: 'Latest data loaded successfully',
        });
      }
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      console.error('Error details:', error.message, error.response);

      toast({
        title: 'Error Loading Data',
        description: error.message || 'Failed to load dashboard data. Please check your connection.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData(true); // Silent refresh
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Store className="w-10 h-10 text-blue-600" />
            Processor Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Real-time business analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Revenue</CardTitle>
            <div className="p-2 bg-green-200 rounded-full">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              ₹{(stats.totalRevenue / 100000).toFixed(2)}L
            </div>
            <p className="text-xs text-green-600 mt-1">
              {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate.toFixed(1)}% from last month
            </p>
            <div className="flex items-center gap-1 mt-2">
              {stats.growthRate >= 0 ? (
                <ArrowUpRight className="w-3 h-3 text-green-600" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-600" />
              )}
              <span className={`text-xs font-medium ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.growthRate >= 0 ? 'Growing' : 'Declining'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Orders</CardTitle>
            <div className="p-2 bg-blue-200 rounded-full">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {stats.totalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">{stats.pendingOrders} pending</p>
            <div className="flex items-center gap-1 mt-2">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">{stats.processingOrders} processing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Active Products</CardTitle>
            <div className="p-2 bg-purple-200 rounded-full">
              <Package className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {stats.activeListings}
            </div>
            <p className="text-xs text-purple-600 mt-1">of {stats.totalProducts} total</p>
            <div className="flex items-center gap-1 mt-2">
              <AlertTriangle className="w-3 h-3 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">{lowStockProducts.length} low stock</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Avg Price</CardTitle>
            <div className="p-2 bg-amber-200 rounded-full">
              <Star className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">₹{stats.avgPrice.toFixed(0)}</div>
            <p className="text-xs text-amber-600 mt-1">Per unit average</p>
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">{stats.completedOrders} completed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-gray-50 to-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Order Status Distribution
                </CardTitle>
                <CardDescription>Breakdown of orders by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={Object.entries(statusDistribution).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(statusDistribution).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Your best-selling products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productPerformance.map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{product.totalSold} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Manage your product listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.map(product => (
                  <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">₹{product.price}</p>
                        <p className="text-sm text-muted-foreground">{product.quantity} {product.unit}</p>
                      </div>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Products running low on inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockProducts.map(product => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        {product.quantity} left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                    <div>
                      <p className="font-semibold">{order.product_name}</p>
                      <p className="text-sm text-muted-foreground">{order.buyer_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{order.total_amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{order.quantity} units</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Products by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categoryDistribution).map(([category, count], index) => {
                    const productCount = Number(count);
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category}</span>
                          <span className="text-muted-foreground">{productCount} products</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${stats.totalProducts > 0 ? (productCount / stats.totalProducts) * 100 : 0}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Completed Orders</span>
                    <span className="text-lg font-bold text-green-600">{stats.completedOrders}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Processing Orders</span>
                    <span className="text-lg font-bold text-blue-600">{stats.processingOrders}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">Pending Orders</span>
                    <span className="text-lg font-bold text-yellow-600">{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Recent Revenue (30d)</span>
                    <span className="text-lg font-bold text-purple-600">₹{(stats.recentRevenue / 100000).toFixed(2)}L</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessorDashboard;
