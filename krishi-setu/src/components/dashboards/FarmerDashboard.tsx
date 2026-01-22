import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Zap,
  Image as ImageIcon,
  Camera,
  Cpu,
  Droplets,
  Thermometer,
  Wifi,
  Battery,
  Activity,
  Sparkles,
  Target,
  Eye,
  Upload,
  RefreshCw,
  Bell,
  MapPin,
  Clock,
  Sun,
  Cloud,
  Wind,
  Gauge,
  Database
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

import { productsAPI, ordersAPI, authAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PriceComparison {
  product: string;
  offlineRate: number;
  platformRate: number;
  advantage: number;
}

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [animatedMetrics, setAnimatedMetrics] = useState({
    totalRevenue: 0,
    activeListings: 0,
    avgPrice: 0,
    growthRate: 0
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceComparisons, setPriceComparisons] = useState<PriceComparison[]>([]);
  const [marketTrends, setMarketTrends] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('mustard');
  const [iotDevices, setIotDevices] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

  // Load user data from MongoDB
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      const user = response.user;
      setUserData(user);
      console.log('👤 Loaded user data:', user);
      console.log('👤 User full name:', user.full_name);
    } catch (error) {
      console.error('❌ Error loading user data:', error);
    }
  };

  // Load real data from MongoDB
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      console.log('📊 Loading Farmer Dashboard data...');

      // Fetch products
      const productsRes = await productsAPI.getMyProducts();
      const fetchedProducts = productsRes.products || [];
      setProducts(fetchedProducts);
      console.log(`✅ Loaded ${fetchedProducts.length} products`);

      // Fetch orders
      const ordersRes = await ordersAPI.getSellerOrders();
      const fetchedOrders = ordersRes.orders || [];
      setOrders(fetchedOrders);
      console.log(`✅ Loaded ${fetchedOrders.length} orders`);

      // Calculate and animate metrics
      calculateAndAnimateMetrics(fetchedProducts, fetchedOrders);

      // Load price comparisons with real data
      loadPriceComparisons(fetchedProducts);

      // Load market trends from order history
      loadMarketTrends(fetchedOrders);

      // Load IoT devices (still mock for now)
      loadIoTDevices();

      // Load weather data (still mock for now)
      loadWeatherData();

      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const calculateAndAnimateMetrics = (products: any[], orders: any[]) => {
    // Calculate Total Revenue from completed orders
    const totalRevenue = orders
      .filter(o => o.status === 'completed' || o.status === 'delivered')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    // Calculate Active Listings
    const activeListings = products.filter(p => p.status === 'available').length;

    // Calculate Average Price
    const avgPrice = products.length > 0
      ? Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length)
      : 0;

    // Calculate Growth Rate (last 30 days vs previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentRevenue = orders
      .filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate > thirtyDaysAgo && (o.status === 'completed' || o.status === 'delivered');
      })
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const previousRevenue = orders
      .filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate > sixtyDaysAgo && orderDate <= thirtyDaysAgo && (o.status === 'completed' || o.status === 'delivered');
      })
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const growthRate = previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : recentRevenue > 0 ? 100 : 0;

    const targetMetrics = {
      totalRevenue: Math.round(totalRevenue),
      activeListings,
      avgPrice,
      growthRate: parseFloat(growthRate.toFixed(1))
    };

    console.log('📈 Calculated metrics:', targetMetrics);

    // Animate to target values
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedMetrics({
        totalRevenue: Math.round(targetMetrics.totalRevenue * easeOutQuart),
        activeListings: Math.round(targetMetrics.activeListings * easeOutQuart),
        avgPrice: Math.round(targetMetrics.avgPrice * easeOutQuart),
        growthRate: parseFloat((targetMetrics.growthRate * easeOutQuart).toFixed(1))
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);
  };

  const loadPriceComparisons = (products: any[]) => {
    if (products.length === 0) {
      // Fallback to default products if no products
      const defaultProducts = ['mustard', 'soybean', 'sunflower', 'groundnut', 'sesame'];
      const comparisons = defaultProducts.map(product => {
        const comparison = mlPriceService.getPriceComparison(product);
        return {
          product: product.charAt(0).toUpperCase() + product.slice(1),
          offlineRate: comparison.offlineRate,
          platformRate: comparison.platformRate,
          advantage: comparison.percentageDifference
        };
      });
      setPriceComparisons(comparisons);
    } else {
      // Use real product data
      const comparisons = products.slice(0, 5).map(product => {
        const category = product.category || 'mustard';
        const comparison = mlPriceService.getPriceComparison(category);
        return {
          product: product.name,
          offlineRate: comparison.offlineRate,
          platformRate: product.price,
          advantage: ((product.price - comparison.offlineRate) / comparison.offlineRate) * 100
        };
      });
      setPriceComparisons(comparisons);
    }
  };

  const loadMarketTrends = (orders: any[]) => {
    if (orders.length === 0) {
      // Fallback to default trends
      const trends = [
        { month: 'Jan', price: 3800 },
        { month: 'Feb', price: 3900 },
        { month: 'Mar', price: 4100 },
        { month: 'Apr', price: 4200 },
        { month: 'May', price: 4300 },
        { month: 'Jun', price: 4200 }
      ];
      setMarketTrends(trends);
    } else {
      // Calculate from real order data
      const monthlyData: any = {};
      orders.forEach(order => {
        const date = new Date(order.created_at);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, totalRevenue: 0, count: 0 };
        }
        monthlyData[month].totalRevenue += order.total_amount || 0;
        monthlyData[month].count += 1;
      });

      const trends = Object.values(monthlyData).map((m: any) => ({
        month: m.month,
        price: m.count > 0 ? Math.round(m.totalRevenue / m.count) : 0
      }));

      setMarketTrends(trends.length > 0 ? trends : [
        { month: 'Jan', price: 3800 },
        { month: 'Feb', price: 3900 },
        { month: 'Mar', price: 4100 },
        { month: 'Apr', price: 4200 },
        { month: 'May', price: 4300 },
        { month: 'Jun', price: 4200 }
      ]);
    }
  };

  const loadIoTDevices = () => {
    // IoT devices data (still mock for now)
    const devices = [
      {
        id: 'FS001',
        name: 'Soil Moisture Sensor',
        type: 'sensor',
        status: 'active',
        battery: 85,
        lastUpdate: '2 mins ago',
        moisture: 72,
        temperature: 24,
        location: 'Field A'
      },
      {
        id: 'FS002',
        name: 'Weather Station',
        type: 'weather',
        status: 'active',
        battery: 92,
        lastUpdate: '1 min ago',
        temperature: 28,
        humidity: 65,
        location: 'Farm Center'
      },
      {
        id: 'FS003',
        name: 'Smart Irrigation',
        type: 'irrigation',
        status: 'active',
        battery: 78,
        lastUpdate: '5 mins ago',
        flowRate: 120,
        activeZones: ['Zone 1', 'Zone 3'],
        location: 'Pump House'
      }
    ];
    setIotDevices(devices);
  };

  const loadWeatherData = () => {
    // Weather data (still mock for now)
    const weather = {
      temperature: 28,
      humidity: 65,
      rainfall: 0,
      windSpeed: 12,
      condition: 'Sunny',
      forecast: [
        { day: 'Today', temp: 28, condition: 'Sunny' },
        { day: 'Tomorrow', temp: 26, condition: 'Partly Cloudy' },
        { day: 'Day 3', temp: 24, condition: 'Light Rain' }
      ]
    };
    setWeatherData(weather);
  };

  const handleProductChange = (product: string) => {
    setSelectedProduct(product);
    const trends = [
      { month: 'Jan', price: 3800 },
      { month: 'Feb', price: 3900 },
      { month: 'Mar', price: 4100 },
      { month: 'Apr', price: 4200 },
      { month: 'May', price: 4300 },
      { month: 'Jun', price: 4200 }
    ];
    setMarketTrends(trends);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      performAIAnalysis(file);
    }
  };

  const performAIAnalysis = async (file) => {
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

  const [showPriceComparison, setShowPriceComparison] = useState(true);
  const [showMLRecommendations, setShowMLRecommendations] = useState(true);

  const stats = [
    {
      title: 'Active Listings',
      value: '12',
      change: '+2',
      icon: Package,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Revenue',
      value: '₹2,45,000',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Avg Price Advantage',
      value: '+8.3%',
      change: 'vs offline',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Pending Orders',
      value: '5',
      change: '2 ready',
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const features = [
    {
      title: 'Price Comparison',
      description: 'Compare platform rates with offline market prices',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
      textColor: 'text-blue-700',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => setShowPriceComparison(true)
    },
    {
      title: 'ML Recommendations',
      description: 'Upload product images to get AI-powered price recommendations',
      icon: ImageIcon,
      color: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
      textColor: 'text-purple-700',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => setShowMLRecommendations(true)
    }
  ];

  const navigate = useNavigate();

  const handleListProduct = () => {
    navigate('/farmer-listings');
  };

  const handleViewOrders = () => {
    navigate('/farmer-transactions');
  };

  const handleMarketAnalysis = () => {
    navigate('/marketplace');
  };

  const handleNotifications = () => {
    toast({
      title: 'Notifications',
      description: 'No new notifications at this time'
    });
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-green-50/50 to-blue-50/50 min-h-screen">
      {/* Header with gradient */}
      <div className="flex justify-between items-center bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Leaf className="w-8 h-8" />
            Welcome, {userData?.full_name || 'Farmer'}!
          </h1>
          <p className="text-green-100 mt-2">AI-powered farm management and marketplace insights</p>
        </div>
        <Button
          className="bg-white text-green-600 hover:bg-green-50 font-semibold"
          onClick={handleListProduct}
        >
          <Package className="w-4 h-4 mr-2" />
          List New Product
        </Button>
      </div>

      {/* Animated Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
            <div className="p-2 bg-white/20 rounded-full animate-pulse">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{animatedMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-100">
              <ArrowUpRight className="w-3 h-3 inline" />
              +{animatedMetrics.growthRate}% from last month
            </p>
            <Progress value={85} className="mt-2 h-2 bg-white/30" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Active Listings</CardTitle>
            <div className="p-2 bg-white/20 rounded-full animate-pulse">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animatedMetrics.activeListings}</div>
            <p className="text-xs text-blue-100">
              <ArrowUpRight className="w-3 h-3 inline" />
              +2 this week
            </p>
            <Progress value={(animatedMetrics.activeListings / 20) * 100} className="mt-2 h-2 bg-white/30" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Avg Price/Quintal</CardTitle>
            <div className="p-2 bg-white/20 rounded-full animate-pulse">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{animatedMetrics.avgPrice.toLocaleString()}</div>
            <p className="text-xs text-purple-100">
              <ArrowUpRight className="w-3 h-3 inline" />
              +5.2% from last week
            </p>
            <Progress value={(animatedMetrics.avgPrice / 5000) * 100} className="mt-2 h-2 bg-white/30" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Quality Score</CardTitle>
            <div className="p-2 bg-white/20 rounded-full animate-pulse">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-orange-100">
              <CheckCircle2 className="w-3 h-3 inline" />
              Excellent quality
            </p>
            <Progress value={94} className="mt-2 h-2 bg-white/30" />
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
          <TabsTrigger value="ai-analysis" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Camera className="w-4 h-4 mr-2" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="iot-devices" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Cpu className="w-4 h-4 mr-2" />
            IoT Devices
          </TabsTrigger>
          <TabsTrigger value="market" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Market
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Trends Chart */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Market Trends
                </CardTitle>
                <CardDescription>Oilseed price trends over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={marketTrends}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weather Widget */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-orange-500" />
                  Weather Conditions
                </CardTitle>
                <CardDescription>Current weather and 3-day forecast</CardDescription>
              </CardHeader>
              <CardContent>
                {weatherData && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-full">
                          <Sun className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                          <p className="text-sm text-muted-foreground">{weatherData.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p className="font-semibold">{weatherData.humidity}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {weatherData.forecast.map((day, idx) => (
                        <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-muted-foreground">{day.day}</p>
                          <p className="font-semibold">{day.temp}°C</p>
                          <p className="text-xs">{day.condition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
                <CardDescription>Upload oilseed images for quality assessment and price prediction</CardDescription>
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
                <CardDescription>Smart insights based on your farm data</CardDescription>
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

        {/* IoT Devices Tab */}
        <TabsContent value="iot-devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {iotDevices.map((device, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {device.type === 'sensor' && <Droplets className="w-5 h-5 text-blue-500" />}
                      {device.type === 'weather' && <Sun className="w-5 h-5 text-orange-500" />}
                      {device.type === 'irrigation' && <Droplets className="w-5 h-5 text-green-500" />}
                      {device.name}
                    </span>
                    <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                      {device.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {device.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Battery</span>
                      <div className="flex items-center gap-2">
                        <Battery className="w-4 h-4" />
                        <span className="font-medium">{device.battery}%</span>
                      </div>
                    </div>
                    <Progress value={device.battery} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Update</span>
                      <span className="text-sm">{device.lastUpdate}</span>
                    </div>

                    {device.type === 'sensor' && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="text-xs text-blue-600">Moisture</p>
                          <p className="font-bold">{device.moisture}%</p>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <p className="text-xs text-orange-600">Temperature</p>
                          <p className="font-bold">{device.temperature}°C</p>
                        </div>
                      </div>
                    )}

                    {device.type === 'weather' && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <p className="text-xs text-orange-600">Temperature</p>
                          <p className="font-bold">{device.temperature}°C</p>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="text-xs text-blue-600">Humidity</p>
                          <p className="font-bold">{device.humidity}%</p>
                        </div>
                      </div>
                    )}

                    {device.type === 'irrigation' && (
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground mb-2">Active Zones</p>
                        <div className="flex gap-2">
                          {device.activeZones.map((zone, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {zone}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Flow Rate</span>
                          <span className="font-bold">{device.flowRate} L/min</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <div className={`w-2 h-2 rounded-full ${device.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-muted-foreground">
                        {device.status === 'active' ? 'Device Online' : 'Device Offline'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Comparison */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Price Comparison
                </CardTitle>
                <CardDescription>Platform vs Offline rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priceComparisons.map((comparison, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{comparison.product}</p>
                        <p className="text-sm text-muted-foreground">
                          Offline: ₹{comparison.offlineRate} | Platform: ₹{comparison.platformRate}
                        </p>
                      </div>
                      <Badge className={comparison.advantage > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {comparison.advantage > 0 ? '+' : ''}{comparison.advantage.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="h-20 flex-col"
                    variant="outline"
                    onClick={handleListProduct}
                  >
                    <Package className="w-6 h-6 mb-2" />
                    <span>List Product</span>
                  </Button>
                  <Button
                    className="h-20 flex-col"
                    variant="outline"
                    onClick={handleViewOrders}
                  >
                    <Eye className="w-6 h-6 mb-2" />
                    <span>View Orders</span>
                  </Button>
                  <Button
                    className="h-20 flex-col"
                    variant="outline"
                    onClick={handleMarketAnalysis}
                  >
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <span>Market Analysis</span>
                  </Button>
                  <Button
                    className="h-20 flex-col"
                    variant="outline"
                    onClick={handleNotifications}
                  >
                    <Bell className="w-6 h-6 mb-2" />
                    <span>Notifications</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerDashboard;
