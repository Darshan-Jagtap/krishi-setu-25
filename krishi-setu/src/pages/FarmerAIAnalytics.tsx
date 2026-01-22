import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  Activity,
  Zap,
  Target,
  Lightbulb,
  RefreshCw,
  Download,
  Settings,
  Clock,
  Droplets,
  Wind,
  Sun,
  Cloud,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Filter,
  Calendar,
  DollarSign,
  Package,
  Leaf,
  Sprout,
  Thermometer,
  Gauge,
  Sparkles,
  Bot,
  Wheat,
  Barley
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const FarmerAIAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('mustard');
  const [timeRange, setTimeRange] = useState('7d');
  const [animatedMetrics, setAnimatedMetrics] = useState({
    avgHealth: 0,
    predictedYield: 0,
    marketValue: 0,
    aiConfidence: 0
  });
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [isRealTime, setIsRealTime] = useState(true);

  // Animated metrics effect
  useEffect(() => {
    const targetMetrics = {
      avgHealth: 91.7,
      predictedYield: 2.7,
      marketValue: 305000,
      aiConfidence: 93
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedMetrics({
        avgHealth: Math.round(targetMetrics.avgHealth * easeOutQuart),
        predictedYield: parseFloat((targetMetrics.predictedYield * easeOutQuart).toFixed(1)),
        marketValue: Math.round(targetMetrics.marketValue * easeOutQuart),
        aiConfidence: Math.round(targetMetrics.aiConfidence * easeOutQuart)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // AI-powered crop insights data
  const [cropInsights, setCropInsights] = useState([
    {
      crop: 'Mustard',
      healthScore: 92,
      yieldPrediction: 2.8,
      marketPrice: 4500,
      optimalHarvest: '2025-03-15',
      diseaseRisk: 'Low',
      waterRequirement: 'Medium',
      fertilizerRecommendation: 'NPK 20:20:20',
      growthStage: 'Flowering',
      estimatedRevenue: 126000,
      confidence: 94
    },
    {
      crop: 'Wheat',
      healthScore: 88,
      yieldPrediction: 3.2,
      marketPrice: 2200,
      optimalHarvest: '2025-04-20',
      diseaseRisk: 'Medium',
      waterRequirement: 'High',
      fertilizerRecommendation: 'NPK 15:15:15',
      growthStage: 'Vegetative',
      estimatedRevenue: 70400,
      confidence: 89
    },
    {
      crop: 'Soybean',
      healthScore: 95,
      yieldPrediction: 2.1,
      marketPrice: 5200,
      optimalHarvest: '2025-03-25',
      diseaseRisk: 'Very Low',
      waterRequirement: 'Low',
      fertilizerRecommendation: 'NPK 25:25:25',
      growthStage: 'Pod Development',
      estimatedRevenue: 109200,
      confidence: 96
    }
  ]);

  // Market trend data
  const [marketTrends, setMarketTrends] = useState([
    { date: 'Mon', mustard: 4400, wheat: 2100, soybean: 5100 },
    { date: 'Tue', mustard: 4450, wheat: 2150, soybean: 5150 },
    { date: 'Wed', mustard: 4500, wheat: 2200, soybean: 5200 },
    { date: 'Thu', mustard: 4480, wheat: 2180, soybean: 5180 },
    { date: 'Fri', mustard: 4520, wheat: 2220, soybean: 5250 },
    { date: 'Sat', mustard: 4500, wheat: 2200, soybean: 5200 },
    { date: 'Sun', mustard: 4500, wheat: 2200, soybean: 5200 }
  ]);

  // Weather prediction data
  const [weatherPredictions, setWeatherPredictions] = useState([
    { day: 'Today', temp: 28, humidity: 65, rainfall: 0, condition: 'Sunny' },
    { day: 'Tomorrow', temp: 26, humidity: 70, rainfall: 2, condition: 'Partly Cloudy' },
    { day: 'Day 3', temp: 24, humidity: 75, rainfall: 8, condition: 'Light Rain' },
    { day: 'Day 4', temp: 25, humidity: 72, rainfall: 0, condition: 'Cloudy' },
    { day: 'Day 5', temp: 27, humidity: 68, rainfall: 0, condition: 'Sunny' }
  ]);

  // AI recommendations
  const [aiRecommendations, setAiRecommendations] = useState([
    {
      id: 1,
      type: 'irrigation',
      priority: 'high',
      title: 'Increase Irrigation for Wheat Field',
      description: 'Soil moisture levels are below optimal. Recommended to irrigate wheat field tomorrow morning for 2 hours.',
      impact: '+12% yield improvement',
      action: 'Schedule Irrigation',
      icon: Droplets
    },
    {
      id: 2,
      type: 'fertilizer',
      priority: 'medium',
      title: 'Apply NPK Fertilizer to Mustard',
      description: 'Mustard crop entering flowering stage. Apply NPK 20:20:20 for optimal flower development.',
      impact: '+8% yield improvement',
      action: 'Order Fertilizer',
      icon: Sprout
    },
    {
      id: 3,
      type: 'pesticide',
      priority: 'low',
      title: 'Monitor for Aphids in Soybean',
      description: 'Weather conditions favorable for aphid development. Monitor soybean field for next 3 days.',
      impact: 'Prevent 15% loss',
      action: 'Set Monitoring Alert',
      icon: AlertTriangle
    }
  ]);

  // Yield prediction chart data
  const [yieldData, setYieldData] = useState([
    { month: 'Jan', actual: 2.1, predicted: 2.3 },
    { month: 'Feb', actual: 2.4, predicted: 2.5 },
    { month: 'Mar', actual: 2.8, predicted: 2.9 },
    { month: 'Apr', actual: 3.1, predicted: 3.2 },
    { month: 'May', actual: 2.9, predicted: 3.0 },
    { month: 'Jun', predicted: 2.7 }
  ]);

  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGeneratingInsights(false);
    }, 3000);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'Cloudy': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'Light Rain': return <Cloud className="w-5 h-5 text-blue-500" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Farm Analytics</h1>
          <p className="text-muted-foreground">AI-powered insights for optimal farming decisions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={generateAIInsights} disabled={isGeneratingInsights}>
            {isGeneratingInsights ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Insights...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Insights
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="crops">Crop Analysis</TabsTrigger>
          <TabsTrigger value="weather">Weather & Climate</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Crop Health</CardTitle>
                <div className="p-2 bg-green-100 rounded-full animate-pulse">
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{animatedMetrics.avgHealth}%</div>
                <p className="text-xs text-muted-foreground">
                  <ArrowUpRight className="w-3 h-3 inline text-green-600" />
                  +3.2% from last week
                </p>
                <Progress value={animatedMetrics.avgHealth} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{animationDelay: '100ms'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Predicted Yield</CardTitle>
                <div className="p-2 bg-blue-100 rounded-full animate-pulse">
                  <Wheat className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{animatedMetrics.predictedYield} t/ha</div>
                <p className="text-xs text-muted-foreground">
                  <ArrowUpRight className="w-3 h-3 inline text-green-600" />
                  Above average
                </p>
                <Progress value={(animatedMetrics.predictedYield / 4) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{animationDelay: '200ms'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Value</CardTitle>
                <div className="p-2 bg-purple-100 rounded-full animate-pulse">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">₹{(animatedMetrics.marketValue / 1000).toFixed(0)}L</div>
                <p className="text-xs text-muted-foreground">
                  <ArrowUpRight className="w-3 h-3 inline text-green-600" />
                  +8.5% potential
                </p>
                <Progress value={(animatedMetrics.marketValue / 400000) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{animationDelay: '300ms'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
                <div className="p-2 bg-amber-100 rounded-full animate-pulse">
                  <Brain className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{animatedMetrics.aiConfidence}%</div>
                <p className="text-xs text-muted-foreground">
                  Prediction accuracy
                </p>
                <Progress value={animatedMetrics.aiConfidence} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Yield Prediction Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Yield Prediction Trend</CardTitle>
              <p className="text-sm text-muted-foreground">AI-powered yield predictions vs actual performance</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="predicted" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crop Analysis Tab */}
        <TabsContent value="crops" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {cropInsights.map((crop, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{crop.crop}</CardTitle>
                      <p className="text-sm text-muted-foreground">Stage: {crop.growthStage}</p>
                    </div>
                    <Badge className={getHealthColor(crop.healthScore)}>
                      {crop.healthScore}% Healthy
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Yield Prediction</p>
                      <p className="text-lg font-bold">{crop.yieldPrediction} t/ha</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Market Price</p>
                      <p className="text-lg font-bold">₹{crop.marketPrice}/qtl</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue Est.</p>
                      <p className="text-lg font-bold text-green-600">₹{(crop.estimatedRevenue/1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-lg font-bold">{crop.confidence}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disease Risk</span>
                      <Badge variant={crop.diseaseRisk === 'Very Low' ? 'default' : 'destructive'}>
                        {crop.diseaseRisk}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Water Need</span>
                      <span>{crop.waterRequirement}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Optimal Harvest</span>
                      <span>{crop.optimalHarvest}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Recommended: {crop.fertilizerRecommendation}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full" onClick={() => setSelectedInsight(crop)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Detailed Analysis
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Sprout className="w-5 h-5 text-green-600" />
                            Detailed Crop Analysis - {selectedInsight?.crop || crop.crop}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Health Metrics */}
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Health Score</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-green-600">{selectedInsight?.healthScore || crop.healthScore}%</div>
                                <Progress value={selectedInsight?.healthScore || crop.healthScore} className="mt-2" />
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Yield Prediction</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{selectedInsight?.yieldPrediction || crop.yieldPrediction} t/ha</div>
                                <p className="text-xs text-muted-foreground">Confidence: {selectedInsight?.confidence || crop.confidence}%</p>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Growth Timeline */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">Growth Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {['Planting', 'Germination', 'Vegetative', 'Flowering', 'Pod Development', 'Harvesting'].map((stage, index) => (
                                  <div key={stage} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                      index <= 2 ? 'bg-green-500' : 
                                      index === 3 ? 'bg-blue-500 animate-pulse' : 
                                      'bg-gray-300'
                                    }`}></div>
                                    <span className={`text-sm ${
                                      index <= 2 ? 'text-green-600' : 
                                      index === 3 ? 'text-blue-600 font-medium' : 
                                      'text-gray-400'
                                    }`}>{stage}</span>
                                    {index === 3 && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Current</span>}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* AI Recommendations */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">AI Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Optimal Conditions Detected</p>
                                    <p className="text-xs text-muted-foreground">Current weather and soil conditions are ideal for {selectedInsight?.crop || crop.crop} growth</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Droplets className="w-4 h-4 text-blue-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Irrigation Schedule</p>
                                    <p className="text-xs text-muted-foreground">Next irrigation recommended in 2 days for 45 minutes</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Sprout className="w-4 h-4 text-purple-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Nutrient Management</p>
                                    <p className="text-xs text-muted-foreground">Apply {selectedInsight?.fertilizerRecommendation || crop.fertilizerRecommendation} within 5-7 days</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Download className="w-4 h-4 mr-2" />
                              Export Report
                            </Button>
                            <Button className="flex-1">
                              <Target className="w-4 h-4 mr-2" />
                              Set Action Plan
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Market Price Trends</CardTitle>
              <p className="text-sm text-muted-foreground">7-day price movement for your crops</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={marketTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mustard" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="wheat" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="soybean" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weather & Climate Tab */}
        <TabsContent value="weather" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weather Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>5-Day Weather Forecast</CardTitle>
                <p className="text-sm text-muted-foreground">AI-powered weather predictions for your location</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weatherPredictions.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(day.condition)}
                        <div>
                          <p className="font-medium">{day.day}</p>
                          <p className="text-sm text-muted-foreground">{day.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{day.temp}°C</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>💧 {day.humidity}%</span>
                          {day.rainfall > 0 && <span>🌧️ {day.rainfall}mm</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Climate Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Climate Insights</CardTitle>
                <p className="text-sm text-muted-foreground">AI analysis of climate patterns</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Thermometer className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Temperature Trend:</strong> Optimal conditions expected for next 3 days. Good for crop growth.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Droplets className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Rainfall Alert:</strong> Light rain expected on Day 3. Consider adjusting irrigation schedule.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Wind className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Humidity Levels:</strong> Moderate humidity (65-75%) ideal for most crops. Low disease risk.
                    </AlertDescription>
                  </Alert>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Seasonal Outlook</h4>
                    <p className="text-sm text-muted-foreground">
                      AI predicts above-average yields this season due to favorable weather patterns. 
                      Consider expanding cultivation area by 15%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {aiRecommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <Card key={rec.id} className={`border-l-4 ${getPriorityColor(rec.priority).split(' ')[2]}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getPriorityColor(rec.priority)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">{rec.impact}</span>
                          <Button size="sm">
                            {rec.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* AI Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Accuracy and reliability metrics</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Yield Prediction Accuracy</span>
                    <span className="text-sm font-bold">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Weather Forecast Accuracy</span>
                    <span className="text-sm font-bold">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Disease Detection Accuracy</span>
                    <span className="text-sm font-bold">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerAIAnalytics;
