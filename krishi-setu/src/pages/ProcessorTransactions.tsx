import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Receipt,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  FileText,
  Banknote,
  CreditCard,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  PieChart,
  Activity,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  MessageSquare,
  Settings,
  Bell,
  BellOff,
  FilterOff,
  Zap,
  Shield,
  Award,
  Target,
  Timer,
  Archive,
  Send,
  Paperclip,
  Link,
  Globe,
  Building,
  User,
  ShoppingCart,
  Warehouse,
  Factory,
  Route,
  Navigation
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { OrderContractDetails } from '@/components/OrderContractDetails';
import { ContractSearch } from '@/components/ContractSearch';

const ProcessorTransactions = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState('30days');

  // Enhanced transactions data
  const [transactions, setTransactions] = useState([
    {
      id: 'TRX001',
      orderId: 'ORD-2025-001',
      customerName: 'Rajesh Kumar Foods',
      customerType: 'wholesale',
      email: 'rajesh@kumarfoods.com',
      phone: '+91-98765-43210',
      location: 'Mumbai, Maharashtra',
      products: [
        { name: 'Refined Mustard Oil', quantity: 500, unit: 'L', price: 150, total: 75000 },
        { name: 'Mustard Oil Cake', quantity: 1000, unit: 'kg', price: 13, total: 13000 }
      ],
      totalAmount: 88000,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'completed',
      orderStatus: 'delivered',
      orderDate: '2025-01-07',
      deliveryDate: '2025-01-10',
      estimatedDelivery: '2025-01-10',
      trackingNumber: 'TRK123456789',
      deliveryAddress: '123 Industrial Area, Mumbai - 400001',
      specialInstructions: 'Deliver before 5 PM',
      discount: 5,
      tax: 7920,
      shipping: 500,
      rating: 5,
      review: 'Excellent quality and timely delivery',
      driverName: 'Ramesh Singh',
      driverPhone: '+91-87654-32109',
      vehicleNumber: 'MH-12-AB-1234',
      warehouse: 'Warehouse A',
      processingUnit: 'OU001',
      priority: 'high',
      source: 'website',
      salesChannel: 'direct',
      fulfillmentType: 'delivery',
      carbonFootprint: 12.5,
      estimatedDeliveryTime: '2-3 days'
    },
    {
      id: 'TRX002',
      orderId: 'ORD-2025-002',
      customerName: 'Sita Organic Store',
      customerType: 'retail',
      email: 'info@sitaorganic.com',
      phone: '+91-98765-43211',
      location: 'Bangalore, Karnataka',
      products: [
        { name: 'Organic Soybean Oil', quantity: 200, unit: 'L', price: 180, total: 36000 }
      ],
      totalAmount: 36000,
      paymentMethod: 'upi',
      paymentStatus: 'completed',
      orderStatus: 'processing',
      orderDate: '2025-01-08',
      deliveryDate: null,
      estimatedDelivery: '2025-01-12',
      trackingNumber: 'TRK123456790',
      deliveryAddress: '456 Commercial St, Bangalore - 560001',
      specialInstructions: 'Handle with care',
      discount: 0,
      tax: 3240,
      shipping: 300,
      rating: null,
      review: null,
      driverName: null,
      driverPhone: null,
      vehicleNumber: null,
      warehouse: 'Warehouse B',
      processingUnit: 'OU002',
      priority: 'medium',
      source: 'mobile_app',
      salesChannel: 'online',
      fulfillmentType: 'pickup',
      carbonFootprint: 8.2,
      estimatedDeliveryTime: '3-4 days'
    },
    {
      id: 'TRX003',
      orderId: 'ORD-2025-003',
      customerName: 'Global Exports Ltd',
      customerType: 'export',
      email: 'exports@global.com',
      phone: '+91-98765-43212',
      location: 'Delhi, NCR',
      products: [
        { name: 'Premium Groundnut Oil', quantity: 1000, unit: 'L', price: 220, total: 220000 },
        { name: 'Sunflower Oil', quantity: 1500, unit: 'L', price: 140, total: 210000 }
      ],
      totalAmount: 430000,
      paymentMethod: 'credit_card',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      orderDate: '2025-01-09',
      deliveryDate: null,
      estimatedDelivery: '2025-01-20',
      trackingNumber: null,
      deliveryAddress: 'International Terminal, Delhi - 110001',
      specialInstructions: 'Export quality packaging required',
      discount: 10,
      tax: 35100,
      shipping: 5000,
      rating: null,
      review: null,
      driverName: null,
      driverPhone: null,
      vehicleNumber: null,
      warehouse: 'Warehouse C',
      processingUnit: 'OU003',
      priority: 'high',
      source: 'phone',
      salesChannel: 'b2b',
      fulfillmentType: 'shipping',
      carbonFootprint: 45.8,
      estimatedDeliveryTime: '10-12 days'
    },
    {
      id: 'TRX004',
      orderId: 'ORD-2025-004',
      customerName: 'Local Restaurant Chain',
      customerType: 'retail',
      email: 'procurement@restaurant.com',
      phone: '+91-98765-43213',
      location: 'Pune, Maharashtra',
      products: [
        { name: 'Sunflower Oil', quantity: 300, unit: 'L', price: 140, total: 42000 },
        { name: 'Soybean Meal', quantity: 500, unit: 'kg', price: 27, total: 13500 }
      ],
      totalAmount: 55500,
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      orderStatus: 'shipped',
      orderDate: '2025-01-10',
      deliveryDate: null,
      estimatedDelivery: '2025-01-13',
      trackingNumber: 'TRK123456791',
      deliveryAddress: '789 Food Court, Pune - 411001',
      specialInstructions: 'Morning delivery preferred',
      discount: 3,
      tax: 4995,
      shipping: 400,
      rating: null,
      review: null,
      driverName: 'Amit Kumar',
      driverPhone: '+91-76543-21098',
      vehicleNumber: 'MH-12-CD-5678',
      warehouse: 'Warehouse D',
      processingUnit: 'OU004',
      priority: 'medium',
      source: 'website',
      salesChannel: 'direct',
      fulfillmentType: 'delivery',
      carbonFootprint: 15.3,
      estimatedDeliveryTime: '2-3 days'
    },
    {
      id: 'TRX005',
      orderId: 'ORD-2025-005',
      customerName: 'Health Food Co.',
      customerType: 'wholesale',
      email: 'orders@healthfood.com',
      phone: '+91-98765-43214',
      location: 'Chennai, Tamil Nadu',
      products: [
        { name: 'Organic Soybean Oil', quantity: 800, unit: 'L', price: 180, total: 144000 },
        { name: 'Sunflower Meal', quantity: 2000, unit: 'kg', price: 25, total: 50000 }
      ],
      totalAmount: 194000,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'completed',
      orderStatus: 'cancelled',
      orderDate: '2025-01-05',
      deliveryDate: null,
      estimatedDelivery: '2025-01-15',
      trackingNumber: null,
      deliveryAddress: '321 Health Street, Chennai - 600001',
      specialInstructions: 'Organic certification required',
      discount: 8,
      tax: 16048,
      shipping: 800,
      rating: null,
      review: 'Order cancelled due to supply issues',
      driverName: null,
      driverPhone: null,
      vehicleNumber: null,
      warehouse: 'Warehouse A',
      processingUnit: 'OU002',
      priority: 'low',
      source: 'email',
      salesChannel: 'b2b',
      fulfillmentType: 'pickup',
      carbonFootprint: 0,
      estimatedDeliveryTime: 'N/A'
    }
  ]);

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    revenue: {
      daily: 450000,
      weekly: 2850000,
      monthly: 11200000,
      yearly: 134400000
    },
    orders: {
      daily: 12,
      weekly: 78,
      monthly: 312,
      yearly: 3744
    },
    avgOrderValue: {
      daily: 37500,
      weekly: 36538,
      monthly: 35897,
      yearly: 35897
    },
    conversionRate: 8.5,
    customerRetention: 72.3,
    topProducts: [
      { name: 'Refined Mustard Oil', revenue: 2850000, orders: 45 },
      { name: 'Organic Soybean Oil', revenue: 2160000, orders: 32 },
      { name: 'Premium Groundnut Oil', revenue: 1980000, orders: 28 },
      { name: 'Sunflower Oil', revenue: 1560000, orders: 38 }
    ],
    paymentMethods: [
      { method: 'Bank Transfer', count: 45, percentage: 42 },
      { method: 'UPI', count: 28, percentage: 26 },
      { method: 'Credit Card', count: 18, percentage: 17 },
      { method: 'Cash on Delivery', count: 15, percentage: 14 }
    ],
    customerTypes: [
      { type: 'Wholesale', count: 38, percentage: 36 },
      { type: 'Retail', count: 42, percentage: 39 },
      { type: 'Export', count: 26, percentage: 24 }
    ]
  });

  // Historical data for charts
  const [historicalData, setHistoricalData] = useState([
    { date: '2025-01-01', revenue: 320000, orders: 8, avgOrderValue: 40000 },
    { date: '2025-01-02', revenue: 385000, orders: 10, avgOrderValue: 38500 },
    { date: '2025-01-03', revenue: 420000, orders: 11, avgOrderValue: 38182 },
    { date: '2025-01-04', revenue: 375000, orders: 9, avgOrderValue: 41667 },
    { date: '2025-01-05', revenue: 445000, orders: 12, avgOrderValue: 37083 },
    { date: '2025-01-06', revenue: 490000, orders: 13, avgOrderValue: 37692 },
    { date: '2025-01-07', revenue: 450000, orders: 12, avgOrderValue: 37500 }
  ]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update historical data with new transactions
      setHistoricalData(prev => {
        const newData = [...prev.slice(1)];
        const lastEntry = prev[prev.length - 1];
        newData.push({
          date: new Date().toISOString().split('T')[0],
          revenue: lastEntry.revenue + (Math.random() - 0.5) * 50000,
          orders: Math.max(5, lastEntry.orders + Math.floor((Math.random() - 0.5) * 3)),
          avgOrderValue: lastEntry.avgOrderValue + (Math.random() - 0.5) * 2000
        });
        return newData;
      });

      // Update analytics
      setAnalyticsData(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          daily: prev.revenue.daily + (Math.random() - 0.5) * 10000
        },
        orders: {
          ...prev.orders,
          daily: Math.max(5, prev.orders.daily + Math.floor((Math.random() - 0.5) * 2))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer': return <Banknote className="w-4 h-4" />;
      case 'upi': return <Smartphone className="w-4 h-4" />;
      case 'credit_card': return <CreditCard className="w-4 h-4" />;
      case 'cash_on_delivery': return <DollarSign className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || transaction.orderStatus === filterStatus;
    const matchesType = filterType === 'all' || transaction.customerType === filterType;
    const matchesPayment = filterPayment === 'all' || transaction.paymentMethod === filterPayment;
    return matchesSearch && matchesStatus && matchesType && matchesPayment;
  });

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalOrders = filteredTransactions.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Receipt className="w-8 h-8 text-primary" />
            Transaction Management
          </h1>
          <p className="text-muted-foreground">Track orders, payments, and deliveries for oil products</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Smart Contract Search */}
      <ContractSearch />

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <Badge variant="outline" className="text-xs">Today</Badge>
            </div>
            <div className="text-2xl font-bold">₹{(analyticsData.revenue.daily / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Daily Revenue</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+12% vs yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <Badge variant="outline" className="text-xs">Today</Badge>
            </div>
            <div className="text-2xl font-bold">{analyticsData.orders.daily}</div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+8% vs yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <Badge variant="outline" className="text-xs">Average</Badge>
            </div>
            <div className="text-2xl font-bold">₹{(avgOrderValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Avg Order Value</p>
            <div className="flex items-center gap-1 mt-2">
              <Minus className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">No change</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-orange-500" />
              <Badge variant="outline" className="text-xs">Rate</Badge>
            </div>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+2.1% improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Delivery
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue & Orders Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="orders" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Payment Methods Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={analyticsData.paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ method, percentage }) => `${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analyticsData.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {analyticsData.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getPaymentMethodIcon(method.method.toLowerCase().replace(' ', '_'))}
                          <span className="font-medium">{method.method}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{method.count} ({method.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">₹{(product.revenue / 100000).toFixed(1)}L</div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Enhanced Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer, order ID, or product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="retail">Retail</option>
                  <option value="export">Export</option>
                </select>
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="all">All Payments</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Transaction List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => (
              <Card
                key={transaction.id}
                className="hover:shadow-lg transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{transaction.customerName}</h3>
                        <Badge className={getPriorityColor(transaction.priority)}>
                          {transaction.priority.toUpperCase()} PRIORITY
                        </Badge>
                        <Badge variant="outline">{transaction.customerType}</Badge>
                        <Badge className={getStatusColor(transaction.orderStatus)}>
                          {transaction.orderStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{transaction.orderId} • {transaction.location}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Order Date:</span>
                          <p className="font-medium">{transaction.orderDate}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Est. Delivery:</span>
                          <p className="font-medium">{transaction.estimatedDelivery}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payment:</span>
                          <div className="flex items-center gap-1">
                            {getPaymentMethodIcon(transaction.paymentMethod)}
                            <span className="font-medium capitalize">{transaction.paymentMethod.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Warehouse:</span>
                          <p className="font-medium">{transaction.warehouse}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-sm text-muted-foreground">Products:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {transaction.products.map((product, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {product.name} ({product.quantity} {product.unit})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold mb-1">₹{(transaction.totalAmount / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {transaction.products.length} items
                      </div>
                      <div className="flex flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{transaction.customerName} - Order Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Order ID</Label>
                                  <p className="font-medium">{transaction.orderId}</p>
                                </div>
                                <div>
                                  <Label>Customer Type</Label>
                                  <p className="font-medium capitalize">{transaction.customerType}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="font-medium">{transaction.email}</p>
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <p className="font-medium">{transaction.phone}</p>
                                </div>
                                <div>
                                  <Label>Order Date</Label>
                                  <p className="font-medium">{transaction.orderDate}</p>
                                </div>
                                <div>
                                  <Label>Delivery Date</Label>
                                  <p className="font-medium">{transaction.deliveryDate || 'Pending'}</p>
                                </div>
                              </div>

                              <div>
                                <Label>Products</Label>
                                <div className="space-y-2 mt-2">
                                  {transaction.products.map((product, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 border rounded">
                                      <span>{product.name}</span>
                                      <span>{product.quantity} {product.unit} × ₹{product.price} = ₹{product.total.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Delivery Address</Label>
                                  <p className="text-sm">{transaction.deliveryAddress}</p>
                                </div>
                                <div>
                                  <Label>Special Instructions</Label>
                                  <p className="text-sm">{transaction.specialInstructions}</p>
                                </div>
                              </div>

                              {transaction.driverName && (
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label>Driver</Label>
                                    <p className="font-medium">{transaction.driverName}</p>
                                  </div>
                                  <div>
                                    <Label>Driver Phone</Label>
                                    <p className="font-medium">{transaction.driverPhone}</p>
                                  </div>
                                  <div>
                                    <Label>Vehicle</Label>
                                    <p className="font-medium">{transaction.vehicleNumber}</p>
                                  </div>
                                </div>
                              )}

                              {transaction.rating && (
                                <div>
                                  <Label>Customer Review</Label>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < transaction.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                      ))}
                                    </div>
                                    <span className="text-sm">{transaction.rating}/5</span>
                                  </div>
                                  <p className="text-sm mt-1">{transaction.review}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {transaction.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        {transaction.trackingNumber || 'No tracking'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Factory className="w-4 h-4" />
                        {transaction.processingUnit}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {transaction.orderStatus === 'processing' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Package className="w-4 h-4 mr-1" />
                          Process Order
                        </Button>
                      )}
                      {transaction.orderStatus === 'shipped' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Truck className="w-4 h-4 mr-1" />
                          Track Delivery
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Types Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.customerTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-blue-500"></div>
                        <span className="font-medium">{type.type}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{type.count} customers</div>
                        <div className="text-sm text-muted-foreground">{type.percentage}% of total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Conversion Rate</span>
                    <span className="font-medium">{analyticsData.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Customer Retention</span>
                    <span className="font-medium">{analyticsData.customerRetention}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg Order Value</span>
                    <span className="font-medium">₹{analyticsData.avgOrderValue.daily.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Monthly Revenue</span>
                    <span className="font-medium">₹{(analyticsData.revenue.monthly / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.slice(0, 6).map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{transaction.customerName}</h3>
                    <Badge variant="outline" className="capitalize">{transaction.customerType}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{transaction.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{transaction.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{transaction.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Orders:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Spent:</span>
                      <span className="font-medium">₹{(transaction.totalAmount * 12 / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  {transaction.rating && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{transaction.rating}/5</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Delivery Tab */}
        <TabsContent value="delivery" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {transactions.filter(t => t.orderStatus === 'shipped' || t.orderStatus === 'processing').map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{transaction.customerName}</h3>
                      <p className="text-sm text-muted-foreground">{transaction.orderId}</p>
                    </div>
                    <Badge className={getStatusColor(transaction.orderStatus)}>
                      {transaction.orderStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Address:</span>
                      <span className="font-medium">{transaction.deliveryAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Delivery:</span>
                      <span className="font-medium">{transaction.estimatedDelivery}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tracking:</span>
                      <span className="font-medium">{transaction.trackingNumber || 'Not assigned'}</span>
                    </div>
                    {transaction.driverName && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Driver:</span>
                          <span className="font-medium">{transaction.driverName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vehicle:</span>
                          <span className="font-medium">{transaction.vehicleNumber}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Navigation className="w-4 h-4 mr-1" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Contact Driver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterPayment !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Start by adding your first transaction'
              }
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Transaction
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcessorTransactions;
