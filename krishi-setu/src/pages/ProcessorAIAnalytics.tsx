import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Cpu,
  Thermometer,
  Droplets,
  Wind,
  Power,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Filter,
  Calendar,
  DollarSign,
  Package,
  Factory,
  Gauge,
  Sparkles,
  Bot
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ProcessorAIAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [isRealTime, setIsRealTime] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  // Real-time data simulation
  const [realTimeData, setRealTimeData] = useState({
    efficiency: 87.5,
    qualityScore: 94.2,
    productionRate: 1250,
    energyConsumption: 450,
    defectRate: 2.3,
    uptime: 98.7
  });

  // Enhanced AI predictions
  const [aiPredictions, setAiPredictions] = useState([
    {
      id: 'PRED001',
      type: 'production',
      title: 'Mustard Oil Production Optimization',
      prediction: 'Expected 15% increase in yield by adjusting temperature to 85°C',
      confidence: 92,
      impact: 'high',
      timeframe: 'Next 7 days',
      actionItems: ['Adjust processing temperature', 'Monitor viscosity', 'Update quality parameters'],
      savings: '₹2.5L/month',
      status: 'active',
      accuracy: 94
    },
    {
      id: 'PRED002',
      type: 'maintenance',
      title: 'OU002 Maintenance Alert',
      prediction: 'Bearing wear detected - schedule maintenance within 48 hours',
      confidence: 88,
      impact: 'critical',
      timeframe: '48 hours',
      actionItems: ['Inspect bearings', 'Check lubrication', 'Schedule downtime'],
      savings: 'Prevent ₹5L loss',
      status: 'urgent',
      accuracy: 91
    },
    {
      id: 'PRED003',
      type: 'quality',
      title: 'Soybean Oil Quality Enhancement',
      prediction: 'Implement filtration upgrade to improve purity by 3%',
      confidence: 85,
      impact: 'medium',
      timeframe: '2 weeks',
      actionItems: ['Install new filters', 'Train operators', 'Update QC protocols'],
      savings: '₹1.8L/month',
      status: 'pending',
      accuracy: 87
    },
    {
      id: 'PRED004',
      type: 'energy',
      title: 'Energy Consumption Optimization',
      prediction: 'Optimize motor timing to reduce energy usage by 12%',
      confidence: 90,
      impact: 'medium',
      timeframe: 'Next 5 days',
      actionItems: ['Reprogram PLC', 'Update motor schedules', 'Monitor consumption'],
      savings: '₹85K/month',
      status: 'active',
      accuracy: 89
    }
  ]);

  // Enhanced performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState([
    {
      unit: 'OU001',
      name: 'Mustard Processing Unit',
      efficiency: 92.5,
      quality: 96.8,
      output: 850,
      energy: 420,
      status: 'optimal',
      trend: 'up',
      maintenance: 'Scheduled in 15 days'
    },
    {
      unit: 'OU002',
      name: 'Soybean Processing Unit',
      efficiency: 78.3,
      quality: 91.2,
      output: 620,
      energy: 510,
      status: 'warning',
      trend: 'down',
      maintenance: 'Required - Bearing wear'
    },
    {
      unit: 'OU003',
      name: 'Groundnut Processing Unit',
      efficiency: 88.7,
      quality: 94.5,
      output: 450,
      energy: 380,
      status: 'good',
      trend: 'stable',
      maintenance: 'Scheduled in 30 days'
    },
    {
      unit: 'OU004',
      name: 'Sunflower Processing Unit',
      efficiency: 95.2,
      quality: 97.3,
      output: 780,
      energy: 390,
      status: 'optimal',
      trend: 'up',
      maintenance: 'Scheduled in 20 days'
    }
  ]);

  // Historical performance data
  const historicalData = [
    { month: 'Jun', efficiency: 82, quality: 88, output: 3200, energy: 1850 },
    { month: 'Jul', efficiency: 85, quality: 90, output: 3350, energy: 1820 },
    { month: 'Aug', efficiency: 87, quality: 91, output: 3480, energy: 1780 },
    { month: 'Sep', efficiency: 89, quality: 93, output: 3620, energy: 1750 },
    { month: 'Oct', efficiency: 91, quality: 94, output: 3750, energy: 1720 },
    { month: 'Nov', efficiency: 93, quality: 95, output: 3900, energy: 1680 },
    { month: 'Dec', efficiency: 94, quality: 96, output: 4050, energy: 1650 }
  ];

  // AI insights data
  const insightsData = [
    { category: 'Production', value: 35, color: '#8884d8' },
    { category: 'Quality', value: 25, color: '#82ca9d' },
    { category: 'Energy', value: 20, color: '#ffc658' },
    { category: 'Maintenance', value: 15, color: '#ff7c7c' },
    { category: 'Safety', value: 5, color: '#8dd1e1' }
  ];

  // Real-time sensor data
  const [sensorData, setSensorData] = useState([
    { id: 'TEMP001', name: 'Temperature Sensor', value: 85.4, unit: '°C', status: 'normal', location: 'OU001' },
    { id: 'PRESS001', name: 'Pressure Sensor', value: 2.8, unit: 'bar', status: 'normal', location: 'OU001' },
    { id: 'VIB001', name: 'Vibration Sensor', value: 4.2, unit: 'mm/s', status: 'warning', location: 'OU002' },
    { id: 'FLOW001', name: 'Flow Rate Sensor', value: 125.6, unit: 'L/min', status: 'normal', location: 'OU003' },
    { id: 'POWER001', name: 'Power Meter', value: 450, unit: 'kW', status: 'normal', location: 'OU004' }
  ]);

  // Quality control data
  const qualityData = [
    { parameter: 'Purity', current: 96.8, target: 97, trend: 'up' },
    { parameter: 'Moisture', current: 0.2, target: 0.3, trend: 'stable' },
    { parameter: 'Acid Value', current: 0.4, target: 0.5, trend: 'down' },
    { parameter: 'Color', current: 9.2, target: 10, trend: 'up' },
    { parameter: 'Odor', current: 8.8, target: 9, trend: 'stable' },
    { parameter: 'Taste', current: 9.5, target: 9.5, trend: 'up' }
  ];

  // Real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      // Update real-time metrics
      setRealTimeData(prev => ({
        efficiency: Math.min(99, Math.max(75, prev.efficiency + (Math.random() - 0.5) * 2)),
        qualityScore: Math.min(99, Math.max(85, prev.qualityScore + (Math.random() - 0.5) * 1)),
        productionRate: Math.floor(prev.productionRate + (Math.random() - 0.5) * 50),
        energyConsumption: Math.floor(prev.energyConsumption + (Math.random() - 0.5) * 20),
        defectRate: Math.max(0, prev.defectRate + (Math.random() - 0.5) * 0.5),
        uptime: Math.min(99.9, Math.max(95, prev.uptime + (Math.random() - 0.5) * 0.5))
      }));

      // Update sensor data
      setSensorData(prev => prev.map(sensor => ({
        ...sensor,
        value: sensor.value + (Math.random() - 0.5) * (sensor.unit === '°C' ? 2 : sensor.unit === 'bar' ? 0.2 : sensor.unit === 'mm/s' ? 0.5 : sensor.unit === 'L/min' ? 5 : 10),
        status: Math.random() > 0.9 ? 'warning' : 'normal'
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const generateNewInsights = () => {
    setIsGeneratingInsights(true);
    setTimeout(() => {
      const newPrediction = {
        id: `PRED${String(aiPredictions.length + 1).padStart(3, '0')}`,
        type: ['production', 'maintenance', 'quality', 'energy'][Math.floor(Math.random() * 4)],
        title: 'New AI Generated Insight',
        prediction: 'AI has identified a new optimization opportunity',
        confidence: Math.floor(Math.random() * 15) + 85,
        impact: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        timeframe: ['24 hours', '3 days', '1 week', '2 weeks'][Math.floor(Math.random() * 4)],
        actionItems: ['Action item 1', 'Action item 2', 'Action item 3'],
        savings: `₹${Math.floor(Math.random() * 500) + 100}K/month`,
        status: 'new',
        accuracy: Math.floor(Math.random() * 10) + 85
      };
      setAiPredictions([newPrediction, ...aiPredictions]);
      setIsGeneratingInsights(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200 animate-pulse';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            AI Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Advanced AI-powered insights for oilseed processing optimization</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsRealTime(!isRealTime)}
            className={isRealTime ? 'bg-green-50 border-green-200' : ''}
          >
            {isRealTime ? (
              <>
                <Activity className="w-4 h-4 mr-2 text-green-600" />
                Live Updates
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Paused
              </>
            )}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={generateNewInsights} disabled={isGeneratingInsights}>
            <Sparkles className={`w-4 h-4 mr-2 ${isGeneratingInsights ? 'animate-pulse' : ''}`} />
            {isGeneratingInsights ? 'Generating...' : 'Generate Insights'}
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Gauge className="w-5 h-5 text-blue-500" />
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
            <div className="text-2xl font-bold">{realTimeData.efficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Efficiency</p>
            <Progress value={realTimeData.efficiency} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
            <div className="text-2xl font-bold">{realTimeData.qualityScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Quality Score</p>
            <Progress value={realTimeData.qualityScore} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Factory className="w-5 h-5 text-purple-500" />
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
            <div className="text-2xl font-bold">{realTimeData.productionRate}</div>
            <p className="text-xs text-muted-foreground">L/hr Production</p>
            <Progress value={(realTimeData.productionRate / 1500) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Power className="w-5 h-5 text-orange-500" />
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
            <div className="text-2xl font-bold">{realTimeData.energyConsumption}</div>
            <p className="text-xs text-muted-foreground">kW Energy</p>
            <Progress value={(realTimeData.energyConsumption / 600) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
            <div className="text-2xl font-bold">{realTimeData.defectRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Defect Rate</p>
            <Progress value={realTimeData.defectRate} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <Badge variant="outline" className="text-xs">Live</Badge>
            </div>
            <div className="text-2xl font-bold">{realTimeData.uptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Uptime</p>
            <Progress value={realTimeData.uptime} className="mt-2 h-1" />
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
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Predictions
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Quality Control
          </TabsTrigger>
          <TabsTrigger value="sensors" className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            IoT Sensors
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Historical Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="efficiency" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="quality" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="output" stackId="3" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Insights Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={insightsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {insightsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {insightsData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="font-medium">{item.category}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unit Performance Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Unit Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Efficiency" dataKey="efficiency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Quality" dataKey="quality" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="space-y-4">
            {aiPredictions.map((prediction, index) => (
              <Card 
                key={prediction.id} 
                className="hover:shadow-lg transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{prediction.title}</h3>
                        <Badge className={getImpactColor(prediction.impact)}>
                          {prediction.impact.toUpperCase()} IMPACT
                        </Badge>
                        <Badge className={getStatusColor(prediction.status)}>
                          {prediction.status.toUpperCase()}
                        </Badge>
                        {prediction.status === 'urgent' && (
                          <Badge className="bg-red-100 text-red-800 animate-pulse">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{prediction.prediction}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Confidence</span>
                          <div className="flex items-center gap-2">
                            <Progress value={prediction.confidence} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{prediction.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Accuracy</span>
                          <div className="flex items-center gap-2">
                            <Progress value={prediction.accuracy} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{prediction.accuracy}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Timeframe</span>
                          <p className="text-sm font-medium">{prediction.timeframe}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Savings</span>
                          <p className="text-sm font-medium text-green-600">{prediction.savings}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-sm text-muted-foreground">Recommended Actions:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {prediction.actionItems.map((action, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <div className="text-right mb-3">
                        <div className="text-2xl font-bold text-primary">{prediction.confidence}%</div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedPrediction(prediction)}>
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{prediction.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Prediction Details</Label>
                                <p className="text-sm text-muted-foreground">{prediction.prediction}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Type</Label>
                                  <p className="font-medium capitalize">{prediction.type}</p>
                                </div>
                                <div>
                                  <Label>Impact Level</Label>
                                  <p className="font-medium capitalize">{prediction.impact}</p>
                                </div>
                                <div>
                                  <Label>Timeframe</Label>
                                  <p className="font-medium">{prediction.timeframe}</p>
                                </div>
                                <div>
                                  <Label>Expected Savings</Label>
                                  <p className="font-medium text-green-600">{prediction.savings}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Action Items</Label>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  {prediction.actionItems.map((action, idx) => (
                                    <li key={idx}>{action}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Implement
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceMetrics.map((unit) => (
              <Card key={unit.unit} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{unit.name}</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(unit.trend)}
                      <Badge className={getStatusColor(unit.status)}>
                        {unit.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Efficiency</span>
                        <span className="text-sm font-medium">{unit.efficiency}%</span>
                      </div>
                      <Progress value={unit.efficiency} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Quality Score</span>
                        <span className="text-sm font-medium">{unit.quality}%</span>
                      </div>
                      <Progress value={unit.quality} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Output:</span>
                        <p className="font-medium">{unit.output} L/hr</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Energy:</span>
                        <p className="font-medium">{unit.energy} kW</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Maintenance:</span>
                      <p className="text-sm font-medium">{unit.maintenance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quality Control Tab */}
        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quality Control Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityData.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{metric.parameter}</h4>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm font-medium">{metric.current}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Target: {metric.target}</span>
                        <div className="w-32">
                          <Progress 
                            value={(metric.current / metric.target) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IoT Sensors Tab */}
        <TabsContent value="sensors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sensorData.map((sensor) => (
              <Card key={sensor.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{sensor.name}</h3>
                    <Badge className={sensor.status === 'warning' ? 'bg-yellow-100 text-yellow-800 animate-pulse' : 'bg-green-100 text-green-800'}>
                      {sensor.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary">
                      {sensor.value.toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground">{sensor.unit}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{sensor.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sensor ID:</span>
                      <span className="font-medium">{sensor.id}</span>
                    </div>
                  </div>
                  {sensor.status === 'warning' && (
                    <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-yellow-700">⚠️ Requires attention</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessorAIAnalytics;
