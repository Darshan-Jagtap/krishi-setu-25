import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  ShoppingCart,
  TrendingDown,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Zap,
  Users,
  Star,
  Heart,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Globe,
  DollarSign,
  Target,
  Truck,
  Eye,
  MessageSquare,
  ThumbsUp,
  Award,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const BuyerDashboard = () => {
  const [activeOrders, setActiveOrders] = useState([
    {
      id: 'ORD001',
      product: 'Mustard Oil',
      seller: 'Farmer John',
      quantity: 500,
      unit: 'kg',
      price: 4800,
      status: 'confirmed',
      deliveryDate: '2024-12-15',
      totalAmount: 2400000,
      tracking: 'TRK001234',
      rating: 4.5,
      quality: 'A'
    },
    {
      id: 'ORD002',
      product: 'Soybean Meal',
      seller: 'Green Farm',
      quantity: 1000,
      unit: 'kg',
      price: 3200,
      status: 'pending',
      deliveryDate: '2024-12-20',
      totalAmount: 3200000,
      tracking: 'TRK001235',
      rating: 4.8,
      quality: 'A'
    }
  ]);

  const [savedSuppliers] = useState([
    { id: 'SUP001', name: 'Farmer John', location: 'Punjab', rating: 4.5, products: 12, responseTime: '2 hours', reliability: 98 },
    { id: 'SUP002', name: 'Green Farm', location: 'Maharashtra', rating: 4.8, products: 8, responseTime: '1 hour', reliability: 99 },
    { id: 'SUP003', name: 'Organic Valley', location: 'Gujarat', rating: 4.6, products: 15, responseTime: '3 hours', reliability: 95 }
  ]);

  const [marketTrends] = useState([
    { product: 'Mustard Oil', currentPrice: 4800, previousPrice: 4500, trend: 'up', change: 6.7 },
    { product: 'Soybean Meal', currentPrice: 3200, previousPrice: 3400, trend: 'down', change: -5.9 },
    { product: 'Sunflower Oil', currentPrice: 5200, previousPrice: 5100, trend: 'up', change: 2.0 },
    { product: 'Groundnut Oil', currentPrice: 6800, previousPrice: 7000, trend: 'down', change: -2.9 }
  ]);

  const [favorites] = useState([
    { id: 'FAV001', product: 'Mustard Oil', seller: 'Farmer John', price: 4800, rating: 4.5, inStock: true },
    { id: 'FAV002', product: 'Soybean Meal', seller: 'Green Farm', price: 3200, rating: 4.8, inStock: true },
    { id: 'FAV003', product: 'Organic Mustard', seller: 'Organic Valley', price: 5500, rating: 4.6, inStock: false }
  ]);

  const [notifications] = useState([
    { type: 'price_drop', message: 'Soybean Meal price dropped by 5%', time: '1 hour ago', productId: 'PROD001' },
    { type: 'new_supplier', message: 'New verified supplier in your region', time: '3 hours ago', supplierId: 'SUP004' },
    { type: 'order_delivered', message: 'Order ORD001 has been delivered', time: '1 day ago', orderId: 'ORD001' },
    { type: 'back_in_stock', message: 'Organic Mustard is back in stock', time: '2 days ago', productId: 'PROD003' }
  ]);

  const [priceAlerts] = useState([
    { product: 'Mustard Oil', targetPrice: 4500, currentPrice: 4800, status: 'above' },
    { product: 'Soybean Meal', targetPrice: 3000, currentPrice: 3200, status: 'above' },
    { product: 'Sunflower Oil', targetPrice: 5000, currentPrice: 5200, status: 'above' }
  ]);

  const stats = [
    {
      title: 'Total Purchases',
      value: '₹58,50,000',
      change: '+15.2%',
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Active Orders',
      value: '8',
      change: '2 pending',
      icon: Package,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Avg Savings',
      value: '12.5%',
      change: 'vs market',
      icon: TrendingDown,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Pending Agreements',
      value: '3',
      change: 'Awaiting sign',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const purchaseData = [
    { month: 'Aug', purchases: 450000, orders: 5 },
    { month: 'Sep', purchases: 620000, orders: 7 },
    { month: 'Oct', purchases: 580000, orders: 6 },
    { month: 'Nov', purchases: 750000, orders: 8 },
    { month: 'Dec', purchases: 920000, orders: 9 }
  ];

  const categoryData = [
    { name: 'Oilseeds', value: 45, color: '#3b82f6' },
    { name: 'By-Products', value: 30, color: '#10b981' },
    { name: 'Processed', value: 25, color: '#f59e0b' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'delivered':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          Buyer Dashboard
        </h1>
        <p className="text-muted-foreground">Manage purchases and track orders efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-blue-600 mt-2">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Purchase Trends */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            Purchase Trends (5 Months)
          </CardTitle>
          <CardDescription>Track your purchasing patterns and spending</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={purchaseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `₹${Number(value) / 100000}L`} />
              <Legend />
              <Bar dataKey="purchases" fill="#3b82f6" name="Purchase Amount" />
              <Bar dataKey="orders" fill="#10b981" name="Number of Orders" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase by Category */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Purchase by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-semibold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              View Pending Agreements
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Track Shipments
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertCircle className="w-4 h-4 mr-2" />
              Manage Disputes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Active Orders
          </CardTitle>
          <CardDescription>Your recent purchases and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeOrders.map((order, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow animate-scale-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{order.product}</h4>
                    <p className="text-sm text-muted-foreground">From: {order.seller}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} border capitalize`}>
                    {order.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Quantity</p>
                    <p className="font-semibold">{order.quantity} {order.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Price/Unit</p>
                    <p className="font-semibold">₹{order.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Total Amount</p>
                    <p className="font-semibold text-green-600">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Delivery</p>
                    <p className="font-semibold">{order.deliveryDate}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Agreement
                  </Button>
                  <Button size="sm" variant="outline">
                    Track Order
                  </Button>
                  {order.status === 'pending' && (
                    <Button size="sm" className="ml-auto">
                      Sign Agreement
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Suppliers */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Saved Suppliers
          </CardTitle>
          <CardDescription>Your trusted and preferred suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedSuppliers.map((supplier, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{supplier.name}</h4>
                    <p className="text-sm text-muted-foreground">{supplier.location}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{supplier.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Products</p>
                    <p className="font-semibold">{supplier.products}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Response Time</p>
                    <p className="font-semibold">{supplier.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Reliability</p>
                    <p className="font-semibold">{supplier.reliability}%</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Market Trends
          </CardTitle>
          <CardDescription>Real-time price movements and market analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketTrends.map((trend, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{trend.product}</h4>
                    <p className="text-sm text-muted-foreground">Current market price</p>
                  </div>
                  <Badge className={trend.trend === 'up' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}>
                    {trend.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(trend.change)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">₹{trend.currentPrice.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Previous: ₹{trend.previousPrice.toLocaleString()}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Target className="w-3 h-3 mr-1" />
                    Set Alert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Products */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Favorite Products
          </CardTitle>
          <CardDescription>Products you've saved for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {favorites.map((favorite, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{favorite.product}</h4>
                    <p className="text-sm text-muted-foreground">From: {favorite.seller}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{favorite.rating}</span>
                    </div>
                    <Badge className={favorite.inStock ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}>
                      {favorite.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">₹{favorite.price.toLocaleString()}</p>
                  <Button size="sm" disabled={!favorite.inStock}>
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    {favorite.inStock ? 'Order Now' : 'Notify Me'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Stay updated with latest market activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${notification.type === 'price_drop' ? 'bg-green-100 text-green-600' : notification.type === 'new_supplier' ? 'bg-blue-100 text-blue-600' : notification.type === 'order_delivered' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                    {notification.type === 'price_drop' ? <TrendingDown className="w-4 h-4" /> : notification.type === 'new_supplier' ? <Users className="w-4 h-4" /> : notification.type === 'order_delivered' ? <Package className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Alerts */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Price Alerts
          </CardTitle>
          <CardDescription>Track products and get notified when prices drop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priceAlerts.map((alert, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{alert.product}</h4>
                    <p className="text-sm text-muted-foreground">Target price: ₹{alert.targetPrice.toLocaleString()}</p>
                  </div>
                  <Badge className={alert.status === 'below' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'}>
                    {alert.status === 'below' ? 'Below Target' : 'Above Target'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="text-sm font-semibold">₹{alert.currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Difference</span>
                    <span className={`text-sm font-semibold ${alert.status === 'below' ? 'text-green-600' : 'text-red-600'}`}>
                      {alert.status === 'below' ? '-' : '+'}₹{Math.abs(alert.currentPrice - alert.targetPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Settings className="w-3 h-3 mr-1" />
                    Edit Alert
                  </Button>
                  <Button size="sm" variant="outline">
                    <Bell className="w-3 h-3 mr-1" />
                    Notify Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">📊 Buying Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Bulk orders of 500+ kg get 5-10% additional discounts</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Soybean meal prices are trending down - good time to buy</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Set up alerts for your favorite products to catch deals</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Review seller ratings before placing large orders</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerDashboard;
