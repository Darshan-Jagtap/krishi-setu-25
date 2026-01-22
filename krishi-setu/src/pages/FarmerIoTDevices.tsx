import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Droplets, 
  Thermometer, 
  Gauge, 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Settings, 
  Wifi, 
  WifiOff,
  Battery,
  BatteryLow,
  RefreshCw,
  Power,
  PowerOff,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  Sun,
  Cloud,
  Wind,
  Sprout,
  Leaf,
  Smartphone,
  Camera,
  Satellite,
  Radio,
  Cpu,
  Database,
  Bell,
  Save,
  Eye,
  Power,
  Clock
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const FarmerIoTDevices = () => {
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    activeDevices: 0,
    needAttention: 0,
    avgBattery: 0,
    dataPoints: 0
  });
  const [selectedDeviceDetail, setSelectedDeviceDetail] = useState(null);
  const [isRealTime, setIsRealTime] = useState(true);
  const [controlPanelOpen, setControlPanelOpen] = useState(false);

  // Animated stats effect
  useEffect(() => {
    const targetStats = {
      activeDevices: 5,
      needAttention: 1,
      avgBattery: 68,
      dataPoints: 1247
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedStats({
        activeDevices: Math.round(targetStats.activeDevices * easeOutQuart),
        needAttention: Math.round(targetStats.needAttention * easeOutQuart),
        avgBattery: Math.round(targetStats.avgBattery * easeOutQuart),
        dataPoints: Math.round(targetStats.dataPoints * easeOutQuart)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Real-time data simulation
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setIoTDevices(prevDevices => 
        prevDevices.map(device => ({
          ...device,
          battery: Math.max(0, device.battery - Math.random() * 0.5),
          lastUpdate: 'Just now'
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isRealTime]);

  // IoT devices data for farm monitoring
  const [iotDevices, setIoTDevices] = useState([
    {
      id: 'FS001',
      name: 'Soil Moisture Sensor - Field A',
      type: 'soil_sensor',
      status: 'active',
      online: true,
      battery: 85,
      lastUpdate: '2 mins ago',
      location: 'North Field',
      moisture: 72,
      temperature: 24,
      ph: 6.8,
      nitrogen: 45,
      phosphorus: 32,
      potassium: 28,
      health: 'Good',
      alerts: ['Optimal moisture levels'],
      firmware: 'v2.1.0',
      signalStrength: 85
    },
    {
      id: 'FS002',
      name: 'Weather Station - Main',
      type: 'weather_station',
      status: 'active',
      online: true,
      battery: 92,
      lastUpdate: '1 min ago',
      location: 'Farm Center',
      temperature: 28,
      humidity: 65,
      rainfall: 0,
      windSpeed: 12,
      pressure: 1013,
      uvIndex: 6,
      health: 'Excellent',
      alerts: [],
      firmware: 'v3.0.1',
      signalStrength: 95
    },
    {
      id: 'FS003',
      name: 'Smart Irrigation Controller',
      type: 'irrigation',
      status: 'active',
      online: true,
      battery: 78,
      lastUpdate: '5 mins ago',
      location: 'Pump House',
      flowRate: 120,
      pressure: 2.5,
      activeZones: ['Zone 1', 'Zone 3'],
      scheduledNext: 'Tomorrow 6:00 AM',
      waterUsed: 4500,
      health: 'Good',
      alerts: ['Zone 2 maintenance due'],
      firmware: 'v1.8.2',
      signalStrength: 88
    },
    {
      id: 'FS004',
      name: 'Crop Health Camera - Mustard Field',
      type: 'camera',
      status: 'active',
      online: true,
      battery: 68,
      lastUpdate: '10 mins ago',
      location: 'Mustard Field',
      healthScore: 92,
      growthStage: 'Flowering',
      diseaseDetection: 'Clear',
      pestDetection: 'Low activity',
      lastImage: '15 mins ago',
      health: 'Good',
      alerts: [],
      firmware: 'v2.3.0',
      signalStrength: 76
    },
    {
      id: 'FS005',
      name: 'Soil Moisture Sensor - Field B',
      type: 'soil_sensor',
      status: 'warning',
      online: true,
      battery: 25,
      lastUpdate: '30 mins ago',
      location: 'South Field',
      moisture: 45,
      temperature: 26,
      ph: 7.2,
      nitrogen: 38,
      phosphorus: 28,
      potassium: 22,
      health: 'Low Battery',
      alerts: ['Battery low - Replace soon', 'Low moisture - Irrigation needed'],
      firmware: 'v2.1.0',
      signalStrength: 65
    },
    {
      id: 'FS006',
      name: 'Drone Camera - Field Monitoring',
      type: 'drone',
      status: 'inactive',
      online: false,
      battery: 100,
      lastUpdate: '2 hours ago',
      location: 'Charging Station',
      lastFlight: 'Yesterday 4:30 PM',
      flightTime: 45,
      coverage: '85%',
      health: 'Charging',
      alerts: ['Scheduled flight tomorrow'],
      firmware: 'v1.5.0',
      signalStrength: 0
    }
  ]);

  // Sensor data history for charts
  const [sensorHistory, setSensorHistory] = useState([
    { time: '00:00', moisture: 68, temperature: 22, humidity: 70 },
    { time: '04:00', moisture: 67, temperature: 20, humidity: 72 },
    { time: '08:00', moisture: 70, temperature: 24, humidity: 68 },
    { time: '12:00', moisture: 72, temperature: 28, humidity: 65 },
    { time: '16:00', moisture: 71, temperature: 26, humidity: 64 },
    { time: '20:00', moisture: 69, temperature: 23, humidity: 69 },
    { time: '23:59', moisture: 68, temperature: 21, humidity: 71 }
  ]);

  // Water usage data
  const [waterUsage, setWaterUsage] = useState([
    { day: 'Mon', usage: 1200, target: 1500 },
    { day: 'Tue', usage: 1400, target: 1500 },
    { day: 'Wed', usage: 1100, target: 1500 },
    { day: 'Thu', usage: 1300, target: 1500 },
    { day: 'Fri', usage: 1600, target: 1500 },
    { day: 'Sat', usage: 900, target: 1500 },
    { day: 'Sun', usage: 1000, target: 1500 }
  ]);

  const refreshDevices = async () => {
    setIsRefreshing(true);
    // Simulate device refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery >= 70) return 'text-green-600';
    if (battery >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSignalStrength = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'soil_sensor': return <Droplets className="w-5 h-5" />;
      case 'weather_station': return <Cloud className="w-5 h-5" />;
      case 'irrigation': return <Gauge className="w-5 h-5" />;
      case 'camera': return <Camera className="w-5 h-5" />;
      case 'drone': return <Satellite className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const filteredDevices = selectedDevice === 'all' 
    ? iotDevices 
    : iotDevices.filter(device => device.type === selectedDevice);

  const activeDevices = iotDevices.filter(d => d.status === 'active').length;
  const devicesNeedingAttention = iotDevices.filter(d => d.status === 'warning').length;
  const avgBattery = Math.round(iotDevices.reduce((sum, d) => sum + d.battery, 0) / iotDevices.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Farm IoT Devices</h1>
          <p className="text-muted-foreground">Monitor and manage your smart farm devices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Device Settings
          </Button>
          <Button onClick={refreshDevices} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh All
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
            <div className="p-2 bg-green-100 rounded-full animate-pulse">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{animatedStats.activeDevices}/{iotDevices.length}</div>
            <p className="text-xs text-muted-foreground">
              Devices online and functioning
            </p>
            <Progress value={(animatedStats.activeDevices / iotDevices.length) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{animationDelay: '100ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full animate-pulse">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{animatedStats.needAttention}</div>
            <p className="text-xs text-muted-foreground">
              Devices require maintenance
            </p>
            <Progress value={animatedStats.needAttention > 0 ? 20 : 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{animationDelay: '200ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Battery</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full animate-pulse">
              <Battery className={`h-4 w-4 ${getBatteryColor(animatedStats.avgBattery)}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getBatteryColor(animatedStats.avgBattery)}`}>{animatedStats.avgBattery}%</div>
            <Progress value={animatedStats.avgBattery} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{animationDelay: '300ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points Today</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full animate-pulse">
              <Database className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{animatedStats.dataPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline text-green-600" />
              +12% from yesterday
            </p>
            <Progress value={(animatedStats.dataPoints / 2000) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Real-time Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-muted-foreground">
            {isRealTime ? 'Real-time monitoring active' : 'Real-time monitoring paused'}
          </span>
        </div>
        <Button
          variant={isRealTime ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsRealTime(!isRealTime)}
        >
          {isRealTime ? 'Pause Real-time' : 'Enable Real-time'}
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devices">All Devices</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-6">
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedDevice === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDevice('all')}
            >
              All Devices
            </Button>
            <Button
              variant={selectedDevice === 'soil_sensor' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDevice('soil_sensor')}
            >
              Soil Sensors
            </Button>
            <Button
              variant={selectedDevice === 'weather_station' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDevice('weather_station')}
            >
              Weather
            </Button>
            <Button
              variant={selectedDevice === 'irrigation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDevice('irrigation')}
            >
              Irrigation
            </Button>
            <Button
              variant={selectedDevice === 'camera' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDevice('camera')}
            >
              Cameras
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDevices.map((device) => (
              <Card key={device.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${device.online ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{device.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(device.status)}>
                        {device.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {device.online ? (
                          <Wifi className="w-3 h-3 text-green-600" />
                        ) : (
                          <WifiOff className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {device.lastUpdate}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Device-specific data */}
                  {device.type === 'soil_sensor' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Moisture</p>
                        <p className="text-lg font-bold">{device.moisture}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-lg font-bold">{device.temperature}°C</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">pH Level</p>
                        <p className="text-lg font-bold">{device.ph}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nitrogen</p>
                        <p className="text-lg font-bold">{device.nitrogen} ppm</p>
                      </div>
                    </div>
                  )}

                  {device.type === 'weather_station' && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-lg font-bold">{device.temperature}°C</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p className="text-lg font-bold">{device.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Wind Speed</p>
                        <p className="text-lg font-bold">{device.windSpeed} km/h</p>
                      </div>
                    </div>
                  )}

                  {device.type === 'irrigation' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Flow Rate</span>
                        <span className="font-bold">{device.flowRate} L/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Pressure</span>
                        <span className="font-bold">{device.pressure} bar</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Active Zones</span>
                        <span className="font-bold">{device.activeZones.join(', ')}</span>
                      </div>
                    </div>
                  )}

                  {device.type === 'camera' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Health Score</span>
                        <span className="font-bold">{device.healthScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Growth Stage</span>
                        <span className="font-bold">{device.growthStage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Disease Detection</span>
                        <span className="font-bold text-green-600">{device.diseaseDetection}</span>
                      </div>
                    </div>
                  )}

                  {/* Device Status */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Battery className={`w-4 h-4 ${getBatteryColor(device.battery)}`} />
                      <div>
                        <p className="text-xs text-muted-foreground">Battery</p>
                        <p className="text-sm font-bold">{device.battery}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio className={`w-4 h-4 ${getSignalStrength(device.signalStrength)}`} />
                      <div>
                        <p className="text-xs text-muted-foreground">Signal</p>
                        <p className="text-sm font-bold">{device.signalStrength}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  {device.alerts.length > 0 && (
                    <Alert>
                      <Bell className="h-4 w-4" />
                      <AlertDescription>
                        {device.alerts.join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedDeviceDetail(device)}>
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getDeviceIcon(device.type)}
                            Device Control - {selectedDeviceDetail?.name || device.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Device Status */}
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Status</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${device.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                  <span className="text-sm font-medium">{device.status}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Last update: {device.lastUpdate}</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Battery</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center gap-2">
                                  <Battery className={`w-4 h-4 ${getBatteryColor(device.battery)}`} />
                                  <span className="text-sm font-bold">{device.battery}%</span>
                                </div>
                                <Progress value={device.battery} className="mt-2" />
                              </CardContent>
                            </Card>
                          </div>

                          {/* Device Controls */}
                          {device.type === 'irrigation' && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Irrigation Control</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Active Zones</label>
                                    <div className="flex gap-2 mt-2">
                                      {['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'].map(zone => (
                                        <Button
                                          key={zone}
                                          variant={device.activeZones?.includes(zone) ? 'default' : 'outline'}
                                          size="sm"
                                          className="text-xs"
                                        >
                                          {zone}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Flow Rate</label>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Input type="number" defaultValue={device.flowRate} className="w-20" />
                                      <span className="text-sm text-muted-foreground">L/min</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <Power className="w-4 h-4 mr-2" />
                                    Start Irrigation
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Schedule
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {device.type === 'soil_sensor' && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Sensor Configuration</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Moisture Threshold</label>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Input type="number" defaultValue="60" className="w-20" />
                                      <span className="text-sm text-muted-foreground">%</span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Reading Interval</label>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Select defaultValue="30">
                                        <SelectTrigger className="w-24">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="15">15 min</SelectItem>
                                          <SelectItem value="30">30 min</SelectItem>
                                          <SelectItem value="60">1 hour</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Calibrate
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Bell className="w-4 h-4 mr-2" />
                                    Set Alerts
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {device.type === 'camera' && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm">Camera Settings</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Capture Frequency</label>
                                    <Select defaultValue="hourly">
                                      <SelectTrigger className="mt-2">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="continuous">Continuous</SelectItem>
                                        <SelectItem value="hourly">Hourly</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Image Quality</label>
                                    <Select defaultValue="high">
                                      <SelectTrigger className="mt-2">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm">
                                    <Camera className="w-4 h-4 mr-2" />
                                    Capture Now
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Live View
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Download className="w-4 h-4 mr-2" />
                              Export Data
                            </Button>
                            <Button className="flex-1">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" className="flex-1">
                      <Activity className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sensors Tab */}
        <TabsContent value="sensors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sensor History Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Environmental Data - Last 24 Hours</CardTitle>
                <p className="text-sm text-muted-foreground">Soil moisture and temperature trends</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sensorHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="moisture" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="temperature" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Water Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Water Usage This Week</CardTitle>
                <p className="text-sm text-muted-foreground">Daily water consumption vs target</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={waterUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usage" fill="#8884d8" />
                    <Bar dataKey="target" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {iotDevices.map((device) => (
                    <div key={device.id} className="flex justify-between items-center">
                      <span className="text-sm">{device.name.split(' - ')[0]}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={device.status === 'active' ? 100 : device.status === 'warning' ? 60 : 0} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">
                          {device.status === 'active' ? '100%' : device.status === 'warning' ? '60%' : '0%'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Today's Data Points</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-bold">8,529</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-bold">34,116</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="font-bold">2.4 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Critical Alerts</span>
                    <span className="font-bold text-red-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Warnings</span>
                    <span className="font-bold text-yellow-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Info Alerts</span>
                    <span className="font-bold text-blue-600">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Resolved Today</span>
                    <span className="font-bold text-green-600">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            {iotDevices.filter(d => d.alerts.length > 0).map((device) => (
              <Card key={device.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.type)}
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{device.location}</p>
                    </div>
                    <Badge className={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {device.alerts.map((alert, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{alert}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Acknowledge
                    </Button>
                    <Button size="sm">
                      Take Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerIoTDevices;
