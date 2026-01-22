import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Globe,
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
  Ship,
  Plane,
  Train,
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
  Building,
  User,
  ShoppingCart,
  Warehouse,
  Factory,
  Route,
  Navigation,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Briefcase,
  FileSearch,
  Calculator,
  Scale,
  Flag,
  Languages,
  CreditCard,
  Receipt,
  Clipboard,
  Database,
  TrendingUp as TrendingUpIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Heart,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Info,
  CheckSquare,
  Square,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Share2,
  Bookmark,
  BookmarkOff
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ProcessorExportOpportunities = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState('30days');

  // Enhanced export opportunities data
  const [exportOpportunities, setExportOpportunities] = useState([
    {
      id: 'EXP001',
      companyName: 'Global Food Imports Ltd',
      contactPerson: 'John Smith',
      email: 'john@globalfood.com',
      phone: '+1-555-0123',
      country: 'United States',
      region: 'North America',
      products: [
        { name: 'Premium Mustard Oil', quantity: 5000, unit: 'L', price: 180, total: 900000 },
        { name: 'Organic Soybean Oil', quantity: 3000, unit: 'L', price: 220, total: 660000 }
      ],
      totalValue: 1560000,
      currency: 'USD',
      status: 'pending',
      priority: 'high',
      datePosted: '2025-01-08',
      deadline: '2025-01-25',
      estimatedDelivery: '2025-02-15',
      shippingMethod: 'sea',
      incoterms: 'FOB',
      paymentTerms: 'T/T 30% advance, 70% against documents',
      certifications: ['USDA Organic', 'Non-GMO', 'ISO 9001'],
      qualityRequirements: 'Premium grade, <0.5% moisture',
      packagingRequirements: 'Food-grade HDPE drums, 200L capacity',
      estimatedProfit: 234000,
      profitMargin: 15,
      competitorCount: 3,
      matchScore: 92,
      source: 'trade_portal',
      lastActivity: '2025-01-10',
      notes: 'High-value client, long-term partnership potential',
      documents: ['product_catalog.pdf', 'certification_docs.pdf'],
      communicationHistory: [
        { date: '2025-01-08', type: 'inquiry', message: 'Initial inquiry for premium oils' },
        { date: '2025-01-09', type: 'response', message: 'Sent product catalog and pricing' },
        { date: '2025-01-10', type: 'follow_up', message: 'Client requested samples' }
      ],
      riskFactors: ['High competition', 'Strict quality requirements'],
      opportunities: ['Premium pricing', 'Long-term contract'],
      nextAction: 'Send samples within 48 hours',
      assignedTo: 'Sales Team A',
      tags: ['premium', 'organic', 'high-value']
    },
    {
      id: 'EXP002',
      companyName: 'Euro Foods GmbH',
      contactPerson: 'Hans Mueller',
      email: 'hans@eurofoods.de',
      phone: '+49-30-12345678',
      country: 'Germany',
      region: 'Europe',
      products: [
        { name: 'Refined Sunflower Oil', quantity: 8000, unit: 'L', price: 160, total: 1280000 }
      ],
      totalValue: 1280000,
      currency: 'EUR',
      status: 'in_progress',
      priority: 'medium',
      datePosted: '2025-01-05',
      deadline: '2025-01-20',
      estimatedDelivery: '2025-02-10',
      shippingMethod: 'sea',
      incoterms: 'CIF',
      paymentTerms: 'L/C at sight',
      certifications: ['EU Organic', 'HACCP', 'ISO 22000'],
      qualityRequirements: 'Standard grade, <1% acidity',
      packagingRequirements: 'Food-grade IBC tanks, 1000L capacity',
      estimatedProfit: 192000,
      profitMargin: 15,
      competitorCount: 5,
      matchScore: 85,
      source: 'direct_inquiry',
      lastActivity: '2025-01-11',
      notes: 'Regular bulk buyer, seasonal demand',
      documents: ['price_list_eur.pdf', 'quality_specs.pdf'],
      communicationHistory: [
        { date: '2025-01-05', type: 'inquiry', message: 'Bulk sunflower oil requirement' },
        { date: '2025-01-06', type: 'quotation', message: 'Sent quotation for 8000L' },
        { date: '2025-01-11', type: 'negotiation', message: 'Price negotiation ongoing' }
      ],
      riskFactors: ['Price sensitive', 'Seasonal demand'],
      opportunities: ['Repeat orders', 'Volume discounts'],
      nextAction: 'Finalize price negotiation',
      assignedTo: 'Sales Team B',
      tags: ['bulk', 'regular', 'seasonal']
    },
    {
      id: 'EXP003',
      companyName: 'Asia Pacific Trading Co.',
      contactPerson: 'Li Wei',
      email: 'liwei@asiapacific.com',
      phone: '+86-21-12345678',
      country: 'China',
      region: 'Asia Pacific',
      products: [
        { name: 'Groundnut Oil', quantity: 10000, unit: 'L', price: 140, total: 1400000 },
        { name: 'Mustard Oil Cake', quantity: 20000, unit: 'kg', price: 18, total: 360000 }
      ],
      totalValue: 1760000,
      currency: 'USD',
      status: 'negotiation',
      priority: 'high',
      datePosted: '2025-01-03',
      deadline: '2025-01-30',
      estimatedDelivery: '2025-02-20',
      shippingMethod: 'sea',
      incoterms: 'FOB',
      paymentTerms: 'T/T 50% advance, 50% against B/L',
      certifications: ['China Organic', 'HACCP'],
      qualityRequirements: 'Industrial grade, acceptable for food processing',
      packagingRequirements: 'Flexible containers, 1000L capacity',
      estimatedProfit: 264000,
      profitMargin: 15,
      competitorCount: 8,
      matchScore: 78,
      source: 'trade_show',
      lastActivity: '2025-01-09',
      notes: 'Large volume opportunity, competitive market',
      documents: ['industrial_specs.pdf', 'bulk_pricing.pdf'],
      communicationHistory: [
        { date: '2025-01-03', type: 'meeting', message: 'Trade show meeting in Shanghai' },
        { date: '2025-01-07', type: 'follow_up', message: 'Sent detailed specifications' },
        { date: '2025-01-09', type: 'negotiation', message: 'Price and terms discussion' }
      ],
      riskFactors: ['High competition', 'Payment risk'],
      opportunities: ['Large volume', 'Market entry'],
      nextAction: 'Submit final proposal',
      assignedTo: 'Sales Team C',
      tags: ['bulk', 'industrial', 'large_volume']
    },
    {
      id: 'EXP004',
      companyName: 'Middle East Food Corp',
      contactPerson: 'Ahmed Hassan',
      email: 'ahmed@mefood.ae',
      phone: '+971-4-12345678',
      country: 'UAE',
      region: 'Middle East',
      products: [
        { name: 'Premium Soybean Oil', quantity: 6000, unit: 'L', price: 200, total: 1200000 }
      ],
      totalValue: 1200000,
      currency: 'USD',
      status: 'closed',
      priority: 'medium',
      datePosted: '2025-01-01',
      deadline: '2025-01-15',
      estimatedDelivery: '2025-02-05',
      shippingMethod: 'air',
      incoterms: 'EXW',
      paymentTerms: '100% advance',
      certifications: ['Halal', 'ISO 9001'],
      qualityRequirements: 'Premium grade, cold-pressed',
      packagingRequirements: 'Food-grade containers, 200L capacity',
      estimatedProfit: 180000,
      profitMargin: 15,
      competitorCount: 4,
      matchScore: 88,
      source: 'referral',
      lastActivity: '2025-01-12',
      notes: 'Deal closed successfully, payment received',
      documents: ['contract_signed.pdf', 'payment_receipt.pdf'],
      communicationHistory: [
        { date: '2025-01-01', type: 'referral', message: 'Referred by existing client' },
        { date: '2025-01-05', type: 'proposal', message: 'Sent proposal with Halal certification' },
        { date: '2025-01-10', type: 'confirmation', message: 'Order confirmed and payment received' },
        { date: '2025-01-12', type: 'closed', message: 'Deal successfully closed' }
      ],
      riskFactors: ['None - deal closed'],
      opportunities: ['Repeat business expected'],
      nextAction: 'Arrange production schedule',
      assignedTo: 'Sales Team A',
      tags: ['premium', 'halal', 'closed']
    },
    {
      id: 'EXP005',
      companyName: 'African Commodities Ltd',
      contactPerson: 'Samuel Okafor',
      email: 'samuel@africom.ng',
      phone: '+234-1-12345678',
      country: 'Nigeria',
      region: 'Africa',
      products: [
        { name: 'Palm Oil Blend', quantity: 15000, unit: 'L', price: 120, total: 1800000 },
        { name: 'Sunflower Oil', quantity: 5000, unit: 'L', price: 150, total: 750000 }
      ],
      totalValue: 2550000,
      currency: 'USD',
      status: 'lost',
      priority: 'low',
      datePosted: '2024-12-20',
      deadline: '2025-01-10',
      estimatedDelivery: '2025-01-25',
      shippingMethod: 'sea',
      incoterms: 'FOB',
      paymentTerms: 'L/C 30 days',
      certifications: ['NAFDAC', 'ISO 9001'],
      qualityRequirements: 'Standard grade, blended product',
      packagingRequirements: 'Drums, 200L capacity',
      estimatedProfit: 382500,
      profitMargin: 15,
      competitorCount: 12,
      matchScore: 65,
      source: 'cold_call',
      lastActivity: '2025-01-08',
      notes: 'Lost to competitor due to pricing',
      documents: ['lost_deal_analysis.pdf'],
      communicationHistory: [
        { date: '2024-12-20', type: 'cold_call', message: 'Initial contact via phone' },
        { date: '2024-12-22', type: 'quotation', message: 'Sent quotation for blended oils' },
        { date: '2025-01-05', type: 'follow_up', message: 'Competitor offered lower price' },
        { date: '2025-01-08', type: 'lost', message: 'Deal lost to competitor' }
      ],
      riskFactors: ['High competition', 'Price sensitive'],
      opportunities: ['None - deal lost'],
      nextAction: 'Follow up for future opportunities',
      assignedTo: 'Sales Team D',
      tags: ['lost', 'high_competition', 'price_sensitive']
    }
  ]);

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalOpportunities: exportOpportunities.length,
    totalValue: exportOpportunities.reduce((sum, opp) => sum + opp.totalValue, 0),
    avgDealSize: exportOpportunities.reduce((sum, opp) => sum + opp.totalValue, 0) / exportOpportunities.length,
    winRate: 20,
    avgProfitMargin: 15,
    topRegions: [
      { region: 'Asia Pacific', value: 1760000, count: 1 },
      { region: 'Africa', value: 2550000, count: 1 },
      { region: 'North America', value: 1560000, count: 1 },
      { region: 'Europe', value: 1280000, count: 1 },
      { region: 'Middle East', value: 1200000, count: 1 }
    ],
    statusDistribution: [
      { status: 'Pending', count: 1, value: 1560000 },
      { status: 'In Progress', count: 1, value: 1280000 },
      { status: 'Negotiation', count: 1, value: 1760000 },
      { status: 'Closed', count: 1, value: 1200000 },
      { status: 'Lost', count: 1, value: 2550000 }
    ],
    productPerformance: [
      { product: 'Mustard Oil', revenue: 900000, orders: 1 },
      { product: 'Soybean Oil', revenue: 1860000, orders: 2 },
      { product: 'Sunflower Oil', revenue: 2030000, orders: 2 },
      { product: 'Groundnut Oil', revenue: 1400000, orders: 1 },
      { product: 'Oil Cakes', revenue: 360000, orders: 1 }
    ],
    monthlyTrends: [
      { month: 'Aug', opportunities: 8, value: 3200000, won: 2 },
      { month: 'Sep', opportunities: 10, value: 4200000, won: 3 },
      { month: 'Oct', opportunities: 12, value: 5100000, won: 2 },
      { month: 'Nov', opportunities: 9, value: 3800000, won: 3 },
      { month: 'Dec', opportunities: 11, value: 4600000, won: 2 },
      { month: 'Jan', opportunities: 5, value: 2550000, won: 1 }
    ]
  });

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update analytics with simulated data
      setAnalyticsData(prev => ({
        ...prev,
        monthlyTrends: prev.monthlyTrends.map(trend => ({
          ...trend,
          value: trend.value + (Math.random() - 0.5) * 100000
        }))
      }));
    }, 10000);

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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getShippingIcon = (method: string) => {
    switch (method) {
      case 'sea': return <Ship className="w-4 h-4" />;
      case 'air': return <Plane className="w-4 h-4" />;
      case 'land': return <Truck className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredOpportunities = exportOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion = filterRegion === 'all' || opportunity.region === filterRegion;
    const matchesStatus = filterStatus === 'all' || opportunity.status === filterStatus;
    const matchesProduct = filterProduct === 'all' || opportunity.products.some(p => p.name.toLowerCase().includes(filterProduct.toLowerCase()));
    return matchesSearch && matchesRegion && matchesStatus && matchesProduct;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            Export Opportunities
          </h1>
          <p className="text-muted-foreground">International trade opportunities and export management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* Export Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <Badge variant="outline" className="text-xs">Total</Badge>
            </div>
            <div className="text-2xl font-bold">{analyticsData.totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">Opportunities</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+2 new this week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <Badge variant="outline" className="text-xs">Pipeline</Badge>
            </div>
            <div className="text-2xl font-bold">${(analyticsData.totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Total Value</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+15% vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <Badge variant="outline" className="text-xs">Average</Badge>
            </div>
            <div className="text-2xl font-bold">${(analyticsData.avgDealSize / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Deal Size</p>
            <div className="flex items-center gap-1 mt-2">
              <Minus className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">Stable</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUpIcon className="w-5 h-5 text-orange-500" />
              <Badge variant="outline" className="text-xs">Success</Badge>
            </div>
            <div className="text-2xl font-bold">{analyticsData.winRate}%</div>
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+5% improvement</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calculator className="w-5 h-5 text-cyan-500" />
              <Badge variant="outline" className="text-xs">Margin</Badge>
            </div>
            <div className="text-2xl font-bold">{analyticsData.avgProfitMargin}%</div>
            <p className="text-xs text-muted-foreground">Avg Profit Margin</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+2% vs target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Regions
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
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
                      placeholder="Search by company, contact, country, or product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="all">All Regions</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Africa">Africa</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed">Closed</option>
                  <option value="lost">Lost</option>
                </select>
                <select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="all">All Products</option>
                  <option value="mustard">Mustard Oil</option>
                  <option value="soybean">Soybean Oil</option>
                  <option value="sunflower">Sunflower Oil</option>
                  <option value="groundnut">Groundnut Oil</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Opportunity List */}
          <div className="space-y-4">
            {filteredOpportunities.map((opportunity, index) => (
              <Card
                key={opportunity.id}
                className="hover:shadow-lg transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{opportunity.companyName}</h3>
                        <Badge className={getPriorityColor(opportunity.priority)}>
                          {opportunity.priority.toUpperCase()} PRIORITY
                        </Badge>
                        <Badge className={getStatusColor(opportunity.status)}>
                          {opportunity.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Flag className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{opportunity.country}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Contact: {opportunity.contactPerson} • {opportunity.email} • {opportunity.phone}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Total Value:</span>
                          <p className="font-medium">{opportunity.currency} {(opportunity.totalValue / 1000000).toFixed(2)}M</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deadline:</span>
                          <p className="font-medium">{opportunity.deadline}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Match Score:</span>
                          <p className={`font-medium ${getMatchScoreColor(opportunity.matchScore)}`}>
                            {opportunity.matchScore}%
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Shipping:</span>
                          <div className="flex items-center gap-1">
                            {getShippingIcon(opportunity.shippingMethod)}
                            <span className="font-medium capitalize">{opportunity.shippingMethod}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-sm text-muted-foreground">Products:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {opportunity.products.map((product, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {product.name} ({product.quantity} {product.unit})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted: {opportunity.datePosted}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {opportunity.competitorCount} competitors
                        </div>
                        <div className="flex items-center gap-1">
                          <Calculator className="w-4 h-4" />
                          {opportunity.profitMargin}% margin
                        </div>
                      </div>

                      {opportunity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {opportunity.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold mb-1">
                        {opportunity.currency} {(opportunity.totalValue / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        Est. Profit: {opportunity.currency} {(opportunity.estimatedProfit / 1000).toFixed(0)}K
                      </div>
                      <div className="flex flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOpportunity(opportunity)}>
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl">
                            <DialogHeader>
                              <DialogTitle>{opportunity.companyName} - Export Opportunity Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <Label>Opportunity ID</Label>
                                  <p className="font-medium">{opportunity.id}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Badge className={getStatusColor(opportunity.status)}>
                                    {opportunity.status.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                </div>
                                <div>
                                  <Label>Priority</Label>
                                  <Badge className={getPriorityColor(opportunity.priority)}>
                                    {opportunity.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                <div>
                                  <Label>Match Score</Label>
                                  <p className={`font-medium ${getMatchScoreColor(opportunity.matchScore)}`}>
                                    {opportunity.matchScore}%
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Contact Person</Label>
                                  <p className="font-medium">{opportunity.contactPerson}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="font-medium">{opportunity.email}</p>
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <p className="font-medium">{opportunity.phone}</p>
                                </div>
                                <div>
                                  <Label>Country</Label>
                                  <p className="font-medium">{opportunity.country}</p>
                                </div>
                              </div>

                              <div>
                                <Label>Products Required</Label>
                                <div className="space-y-2 mt-2">
                                  {opportunity.products.map((product, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 border rounded">
                                      <span>{product.name}</span>
                                      <span>{product.quantity} {product.unit} × {opportunity.currency} {product.price} = {opportunity.currency} {product.total.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Total Value</Label>
                                  <p className="font-medium">{opportunity.currency} {opportunity.totalValue.toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label>Estimated Profit</Label>
                                  <p className="font-medium">{opportunity.currency} {opportunity.estimatedProfit.toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label>Profit Margin</Label>
                                  <p className="font-medium">{opportunity.profitMargin}%</p>
                                </div>
                                <div>
                                  <Label>Competitors</Label>
                                  <p className="font-medium">{opportunity.competitorCount} companies</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Shipping Method</Label>
                                  <div className="flex items-center gap-2">
                                    {getShippingIcon(opportunity.shippingMethod)}
                                    <span className="font-medium capitalize">{opportunity.shippingMethod}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label>Incoterms</Label>
                                  <p className="font-medium">{opportunity.incoterms}</p>
                                </div>
                                <div>
                                  <Label>Payment Terms</Label>
                                  <p className="font-medium">{opportunity.paymentTerms}</p>
                                </div>
                                <div>
                                  <Label>Deadline</Label>
                                  <p className="font-medium">{opportunity.deadline}</p>
                                </div>
                              </div>

                              <div>
                                <Label>Certifications Required</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {opportunity.certifications.map((cert, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Quality Requirements</Label>
                                  <p className="text-sm">{opportunity.qualityRequirements}</p>
                                </div>
                                <div>
                                  <Label>Packaging Requirements</Label>
                                  <p className="text-sm">{opportunity.packagingRequirements}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Risk Factors</Label>
                                  <ul className="list-disc list-inside text-sm">
                                    {opportunity.riskFactors.map((risk, idx) => (
                                      <li key={idx}>{risk}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <Label>Opportunities</Label>
                                  <ul className="list-disc list-inside text-sm">
                                    {opportunity.opportunities.map((opp, idx) => (
                                      <li key={idx}>{opp}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div>
                                <Label>Communication History</Label>
                                <div className="space-y-2 mt-2">
                                  {opportunity.communicationHistory.map((comm, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 border rounded">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs capitalize">{comm.type.replace('_', ' ')}</Badge>
                                        <span className="text-sm">{comm.date}</span>
                                      </div>
                                      <span className="text-sm">{comm.message}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Next Action</Label>
                                  <p className="font-medium">{opportunity.nextAction}</p>
                                </div>
                                <div>
                                  <Label>Assigned To</Label>
                                  <p className="font-medium">{opportunity.assignedTo}</p>
                                </div>
                              </div>

                              <div>
                                <Label>Notes</Label>
                                <p className="text-sm">{opportunity.notes}</p>
                              </div>

                              <div className="flex gap-2">
                                <Button size="sm">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share2 className="w-4 h-4 mr-1" />
                                  Share
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Bookmark className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Send className="w-4 h-4 mr-1" />
                          Follow Up
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Deadline: {opportunity.deadline}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {opportunity.competitorCount} competitors
                      </div>
                      <div className="flex items-center gap-1">
                        <Calculator className="w-4 h-4" />
                        {opportunity.profitMargin}% margin
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {opportunity.status === 'pending' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      )}
                      {opportunity.status === 'in_progress' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Negotiate
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
                  <TrendingUpIcon className="h-5 w-5" />
                  Monthly Export Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="value" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="won" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={analyticsData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status }) => status}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {analyticsData.statusDistribution.map((status, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'][index] }}></div>
                          <span className="font-medium">{status.status}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{status.count} deals</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.productPerformance.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{product.product}</h4>
                        <p className="text-sm text-muted-foreground">{product.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${(product.revenue / 1000000).toFixed(2)}M</div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['pending', 'in_progress', 'negotiation', 'closed', 'lost'].map((status, index) => (
              <Card key={status} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium capitalize">
                    {status.replace('_', ' ')}
                  </CardTitle>
                  <div className="text-2xl font-bold">
                    {exportOpportunities.filter(opp => opp.status === status).length}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exportOpportunities
                      .filter(opp => opp.status === status)
                      .slice(0, 3)
                      .map(opp => (
                        <div key={opp.id} className="p-2 border rounded text-sm">
                          <div className="font-medium truncate">{opp.companyName}</div>
                          <div className="text-muted-foreground">${(opp.totalValue / 1000000).toFixed(1)}M</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData.topRegions.map((region, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{region.region}</h3>
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Value:</span>
                      <span className="font-medium">${(region.value / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Opportunities:</span>
                      <span className="font-medium">{region.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Deal Size:</span>
                      <span className="font-medium">${(region.value / region.count / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Key Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-medium">{analyticsData.winRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg Deal Size</span>
                    <span className="font-medium">${(analyticsData.avgDealSize / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg Profit Margin</span>
                    <span className="font-medium">{analyticsData.avgProfitMargin}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Pipeline Value</span>
                    <span className="font-medium">${(analyticsData.totalValue / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: 'Leads', count: 50, conversion: 100 },
                    { stage: 'Qualified', count: 35, conversion: 70 },
                    { stage: 'Proposal', count: 20, conversion: 40 },
                    { stage: 'Negotiation', count: 12, conversion: 24 },
                    { stage: 'Closed Won', count: 10, conversion: 20 }
                  ].map((stage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stage.conversion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stage.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {filteredOpportunities.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No export opportunities found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterRegion !== 'all' || filterStatus !== 'all' || filterProduct !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Start by adding your first export opportunity'
              }
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Opportunity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcessorExportOpportunities;
