import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cpu, 
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
  MapPin
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProcessorIoTDevices = () => {
  const [selectedUnit, setSelectedUnit] = useState('all');

  // IoT Device data for processing units
  const [iotDevices, setIoTDevices] = useState([
    {
      id: 'OU001',
      name: 'Mustard Seed Oil Extraction Unit',
      status: 'active',
      online: true,
      efficiency: 92,
      temperature: 85,
      pressure: 2.5,
      vibration: 0.8,
      powerConsumption: 450,
      oilFlowRate: 120,
      moistureLevel: 8.5,
      lastMaintenance: '2025-02-15',
      operatingHours: 12450,
      devices: {
        temperatureSensor: { status: 'online', battery: 85, lastUpdate: '2 mins ago' },
        pressureSensor: { status: 'online', battery: 92, lastUpdate: '1 min ago' },
        flowMeter: { status: 'online', battery: 78, lastUpdate: '3 mins ago' },
        vibrationSensor: { status: 'online', battery: 88, lastUpdate: '2 mins ago' },
        powerMonitor: { status: 'online', battery: 95, lastUpdate: '1 min ago' },
        moistureSensor: { status: 'online', battery: 82, lastUpdate: '4 mins ago' }
      },
      alerts: [
        { type: 'info', message: 'Temperature within optimal range', timestamp: '10:30 AM' },
        { type: 'warning', message: 'Vibration slightly elevated', timestamp: '10:25 AM' }
      ]
    },
    {
      id: 'OU002',
      name: 'Soybean Oil Processing Unit',
      status: 'active',
      online: true,
      efficiency: 88,
      temperature: 78,
      pressure: 2.2,
      vibration: 1.2,
      powerConsumption: 380,
      oilFlowRate: 95,
      moistureLevel: 9.2,
      lastMaintenance: '2025-01-30',
      operatingHours: 10200,
      devices: {
        temperatureSensor: { status: 'online', battery: 76, lastUpdate: '1 min ago' },
        pressureSensor: { status: 'online', battery: 84, lastUpdate: '2 mins ago' },
        flowMeter: { status: 'offline', battery: 45, lastUpdate: '15 mins ago' },
        vibrationSensor: { status: 'online', battery: 90, lastUpdate: '1 min ago' },
        powerMonitor: { status: 'online', battery: 88, lastUpdate: '3 mins ago' },
        moistureSensor: { status: 'online', battery: 79, lastUpdate: '2 mins ago' }
      },
      alerts: [
        { type: 'error', message: 'Flow meter offline', timestamp: '10:15 AM' },
        { type: 'warning', message: 'Power consumption above normal', timestamp: '10:10 AM' }
      ]
    },
    {
      id: 'OU003',
      name: 'Groundnut Oil Refinery Unit',
      status: 'maintenance',
      online: false,
      efficiency: 0,
      temperature: 25,
      pressure: 0,
      vibration: 0,
      powerConsumption: 0,
      oilFlowRate: 0,
    },
    {
      id: 'FLOW001',
      name: 'Flow Meter Delta',
      type: 'flow',
      location: 'OU003 - Groundnut Processing',
      status: 'online',
      value: 125.6,
      unit: 'L/min',
      range: { min: 0, max: 200 },
      battery: 78,
      signal: 94,
      lastUpdate: new Date(),
      alerts: 0,
      maintenance: 'Scheduled in 20 days',
      firmware: 'v2.5.0',
      uptime: '31 days 8 hrs',
      dataPoints: 45678,
      accuracy: 99.5,
      calibration: '2024-11-20',
      manufacturer: 'FlowMaster',
      model: 'FM-3000',
      ipAddress: '192.168.1.104',
      macAddress: '00:1B:44:11:3A:BA'
    },
    {
      id: 'HUMID001',
      name: 'Humidity Sensor Epsilon',
      type: 'humidity',
      location: 'OU004 - Sunflower Processing',
      status: 'online',
      value: 42.3,
      unit: '%RH',
      range: { min: 0, max: 100 },
      battery: 88,
      signal: 90,
      lastUpdate: new Date(),
      alerts: 0,
      maintenance: 'Scheduled in 25 days',
      firmware: 'v2.2.1',
      uptime: '18 days 12 hrs',
      dataPoints: 19876,
      accuracy: 98.9,
      calibration: '2024-12-05',
      manufacturer: 'HumidiTech',
      model: 'HT-200',
      ipAddress: '192.168.1.105',
      macAddress: '00:1B:44:11:3A:BB'
    },
    {
      id: 'POWER001',
      name: 'Power Monitor Zeta',
      type: 'power',
      location: 'Main Control Room',
      status: 'online',
      value: 450,
      unit: 'kW',
      range: { min: 0, max: 1000 },
      battery: 95,
      signal: 98,
      lastUpdate: new Date(),
      alerts: 0,
      maintenance: 'Scheduled in 60 days',
      firmware: 'v4.1.0',
      uptime: '45 days 6 hrs',
      dataPoints: 67890,
      accuracy: 99.8,
      calibration: '2024-10-15',
      manufacturer: 'PowerWatch',
      model: 'PW-5000',
      ipAddress: '192.168.1.106',
      macAddress: '00:1B:44:11:3A:BC'
    }
  ]);

  // Historical data for charts
  const [historicalData, setHistoricalData] = useState([
    { time: '00:00', temperature: 82, pressure: 2.6, vibration: 3.8, flow: 118, humidity: 40, power: 420 },
    { time: '04:00', temperature: 84, pressure: 2.7, vibration: 4.0, flow: 122, humidity: 41, power: 435 },
    { time: '08:00', temperature: 86, pressure: 2.8, vibration: 4.2, flow: 125, humidity: 42, power: 450 },
    { time: '12:00', temperature: 88, pressure: 2.9, vibration: 4.5, flow: 128, humidity: 43, power: 465 },
    { time: '16:00', temperature: 85, pressure: 2.8, vibration: 4.3, flow: 126, humidity: 42, power: 455 },
    { time: '20:00', temperature: 83, pressure: 2.7, vibration: 4.1, flow: 123, humidity: 41, power: 440 }
  ]);

  // Network statistics
  const [networkStats, setNetworkStats] = useState({
    totalDevices: iotDevices.length,
    onlineDevices: iotDevices.filter(d => d.status === 'online').length,
    warningDevices: iotDevices.filter(d => d.status === 'warning').length,
    offlineDevices: iotDevices.filter(d => d.status === 'offline').length,
    totalDataPoints: iotDevices.reduce((sum, d) => sum + d.dataPoints, 0),
    avgUptime: '24 days',
    networkLatency: '12ms',
    dataRate: '2.4 MB/s'
  });

  // System alerts
  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: 'ALT001',
      device: 'VIB001',
      type: 'warning',
      message: 'Vibration levels exceeding threshold',
      timestamp: new Date(),
      severity: 'medium'
    },
    {
      id: 'ALT002',
      device: 'TEMP001',
      type: 'info',
      message: 'Temperature sensor calibration due',
      timestamp: new Date(Date.now() - 3600000),
      severity: 'low'
    }
  ]);

  // Real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      // Update device values
      setIotDevices(prev => prev.map(device => ({
        ...device,
        value: device.value + (Math.random() - 0.5) * (device.unit === '°C' ? 2 : device.unit === 'bar' ? 0.2 : device.unit === 'mm/s' ? 0.5 : device.unit === 'L/min' ? 5 : device.unit === '%RH' ? 2 : 20),
        battery: Math.max(0, device.battery - Math.random() * 0.1),
        signal: Math.min(100, Math.max(60, device.signal + (Math.random() - 0.5) * 5)),
        lastUpdate: new Date(),
        dataPoints: device.dataPoints + Math.floor(Math.random() * 10) + 1,
        alerts: device.type === 'vibration' && Math.random() > 0.95 ? device.alerts + 1 : device.alerts
      })));

      // Update historical data
      setHistoricalData(prev => {
        const newData = [...prev.slice(1)];
        const lastEntry = prev[prev.length - 1];
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temperature: lastEntry.temperature + (Math.random() - 0.5) * 2,
          pressure: lastEntry.pressure + (Math.random() - 0.5) * 0.2,
          vibration: lastEntry.vibration + (Math.random() - 0.5) * 0.5,
          flow: lastEntry.flow + (Math.random() - 0.5) * 5,
          humidity: lastEntry.humidity + (Math.random() - 0.5) * 2,
          power: lastEntry.power + (Math.random() - 0.5) * 20
        });
        return newData;
      });

      // Update network stats
      setNetworkStats(prev => ({
        ...prev,
        totalDataPoints: prev.totalDataPoints + Math.floor(Math.random() * 100) + 50,
        networkLatency: `${Math.floor(Math.random() * 10) + 8}ms`,
        dataRate: `${(Math.random() * 2 + 1.5).toFixed(1)} MB/s`
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleDeviceAction = (deviceId: string, action: string) => {
    setIotDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        switch (action) {
          case 'calibrate':
            return { ...device, calibration: new Date().toISOString().split('T')[0] };
          case 'restart':
            return { ...device, uptime: '0 mins' };
          case 'update':
            return { ...device, firmware: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}` };
          default:
            return device;
        }
      }
      return device;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-500';
    if (level > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSignalColor = (level: number) => {
    if (level > 80) return 'text-green-500';
    if (level > 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      case 'pressure': return <Gauge className="w-5 h-5" />;
      case 'vibration': return <Vibrate className="w-5 h-5" />;
      case 'flow': return <Wind className="w-5 h-5" />;
      case 'humidity': return <Droplets className="w-5 h-5" />;
      case 'power': return <Zap className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const filteredDevices = iotDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
    const matchesLocation = filterLocation === 'all' || device.location.includes(filterLocation);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Cpu className="w-8 h-8 text-primary" />
            IoT Device Management
          </h1>
          <p className="text-muted-foreground">Real-time monitoring and control of processing unit sensors</p>
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
                <Pause className="w-4 h-4 mr-2" />
                Paused
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Device Settings
          </Button>
        </div>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Server className="w-5 h-5 text-blue-500" />
              <Badge variant="outline" className="text-xs">Network</Badge>
            </div>
            <div className="text-2xl font-bold">{networkStats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">Total Devices</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Wifi className="w-5 h-5 text-green-500" />
              <Badge variant="outline" className="text-xs">Online</Badge>
            </div>
            <div className="text-2xl font-bold">{networkStats.onlineDevices}</div>
            <p className="text-xs text-muted-foreground">Connected</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <Badge variant="outline" className="text-xs">Warning</Badge>
            </div>
            <div className="text-2xl font-bold">{networkStats.warningDevices}</div>
            <p className="text-xs text-muted-foreground">Need Attention</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-purple-500" />
              <Badge variant="outline" className="text-xs">Data</Badge>
            </div>
            <div className="text-2xl font-bold">{(networkStats.totalDataPoints / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Data Points</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <Badge variant="outline" className="text-xs">Latency</Badge>
            </div>
            <div className="text-2xl font-bold">{networkStats.networkLatency}</div>
            <p className="text-xs text-muted-foreground">Network Latency</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Cloud className="w-5 h-5 text-cyan-500" />
              <Badge variant="outline" className="text-xs">Transfer</Badge>
            </div>
            <div className="text-2xl font-bold">{networkStats.dataRate}</div>
            <p className="text-xs text-muted-foreground">Data Rate</p>
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
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Sensor Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="pressure" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="vibration" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {filteredDevices.map((unit) => (
              <Card key={unit.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${unit.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {unit.name}
                    </CardTitle>
                    <p className="text-muted-foreground">Unit ID: {unit.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={unit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {unit.status.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {unit.online ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
                      <span className="text-sm">{unit.online ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            <CardContent>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="font-semibold">{unit.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pressure</p>
                    <p className="font-semibold">{unit.pressure} bar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vibration</p>
                    <p className="font-semibold">{unit.vibration} mm/s</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Power</p>
                    <p className="font-semibold">{unit.powerConsumption} kW</p>
                  </div>
                </div>
              </div>

              {/* Device Status */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Connected Devices</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(unit.devices).map(([deviceName, device]) => (
                    <div key={deviceName} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium capitalize">
                          {deviceName.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Badge className={getDeviceStatusColor(device.status)}>
                          {device.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {device.battery > 60 ? <Battery className="w-3 h-3" /> : <BatteryLow className="w-3 h-3" />}
                          <span className={getBatteryColor(device.battery)}>{device.battery}%</span>
                        </div>
                        <span>{device.lastUpdate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              <div>
                <h4 className="font-medium mb-3">Recent Alerts</h4>
                <div className="space-y-2">
                  {unit.alerts.map((alert, index) => (
                    <Alert key={index} className={getAlertColor(alert.type)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <span>{alert.message}</span>
                          <span className="text-xs opacity-75">{alert.timestamp}</span>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {iotDevices.map((unit) => (
              <div key={unit.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{unit.name}</p>
                    <p className="text-sm text-muted-foreground">Next: {unit.lastMaintenance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Operating Hours</p>
                    <p className="font-medium">{unit.operatingHours.toLocaleString()}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Schedule Maintenance
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>
);
};

export default ProcessorIoTDevices;
