import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MapPin,
  TrendingUp,
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  Package,
  Leaf,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Truck,
  Factory,
  DollarSign,
  TrendingDown,
  Activity,
  CheckCircle2,
  X,
  Eye,
  GitCompare,
  Bell,
  Download,
  Share2,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Clock,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import OrderFlow from '@/components/OrderFlow';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { productsAPI } from '@/lib/api';

const sampleProducts = [
  {
    id: 1,
    name: 'Soybean Meal',
    type: 'meal',
    quantity: 5000,
    unit: 'kg',
    price: 45,
    supplier: 'Green Valley Processors',
    supplierId: 'GVP001',
    location: 'Maharashtra, India',
    quality: 'Premium',
    protein: 48,
    moisture: 12,
    fiber: 6,
    fat: 1.5,
    trend: 8.5,
    demand: 'high',
    iotVerified: true,
    exportReady: true,
    certifications: ['ISO 9001', 'FSSAI', 'Organic'],
    rating: 4.8,
    orders: 156,
    views: 2340,
    reviews: 45,
    exportMarkets: ['UAE', 'Singapore', 'Bangladesh'],
    harvestDate: '2025-01-15',
    expiryDate: '2025-07-15',
    minOrder: 100,
    discount: 5,
    deliveryTime: '3-5 days'
  },
  {
    id: 2,
    name: 'Mustard Oil Cake',
    type: 'cake',
    quantity: 3000,
    unit: 'kg',
    price: 28,
    supplier: 'Harvest Oil Mills',
    supplierId: 'HOM002',
    location: 'Rajasthan, India',
    quality: 'Standard',
    protein: 38,
    moisture: 10,
    fiber: 8,
    fat: 2,
    trend: -2.3,
    demand: 'medium',
    iotVerified: true,
    exportReady: false,
    certifications: ['FSSAI'],
    rating: 4.5,
    orders: 89,
    views: 1560,
    reviews: 28,
    exportMarkets: ['Nepal', 'Bhutan'],
    harvestDate: '2025-01-10',
    expiryDate: '2025-06-10',
    minOrder: 50,
    discount: 0,
    deliveryTime: '2-4 days'
  },
  {
    id: 3,
    name: 'Groundnut Husk',
    type: 'husk',
    quantity: 8000,
    unit: 'kg',
    price: 15,
    supplier: 'Agro Waste Solutions',
    supplierId: 'AWS003',
    location: 'Gujarat, India',
    quality: 'Standard',
    protein: 0,
    moisture: 8,
    fiber: 45,
    fat: 0.5,
    trend: 12.4,
    demand: 'high',
    iotVerified: true,
    exportReady: true,
    certifications: ['ISO 14001'],
    rating: 4.6,
    orders: 234,
    views: 3120,
    reviews: 67,
    exportMarkets: ['Vietnam', 'Thailand', 'Indonesia'],
    harvestDate: '2025-01-20',
    expiryDate: '2025-12-20',
    minOrder: 200,
    discount: 10,
    deliveryTime: '4-6 days'
  },
  {
    id: 4,
    name: 'Sunflower Meal',
    type: 'meal',
    quantity: 4500,
    unit: 'kg',
    price: 38,
    supplier: 'Sunshine Agro',
    supplierId: 'SA004',
    location: 'Karnataka, India',
    quality: 'Premium',
    protein: 42,
    moisture: 11,
    fiber: 7,
    fat: 1.8,
    trend: 5.2,
    demand: 'medium',
    iotVerified: true,
    exportReady: true,
    certifications: ['ISO 9001', 'FSSAI', 'Export Quality'],
    rating: 4.9,
    orders: 178,
    views: 2890,
    reviews: 52,
    exportMarkets: ['UAE', 'Saudi Arabia', 'Egypt'],
    harvestDate: '2025-01-18',
    expiryDate: '2025-07-18',
    minOrder: 100,
    discount: 3,
    deliveryTime: '3-5 days'
  }
];

const Marketplace = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDemand, setSelectedDemand] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<{ productId: number, targetPrice: number }[]>([]);

  // Dialog states
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [priceAlertDialogOpen, setPriceAlertDialogOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [targetPrice, setTargetPrice] = useState(0);

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response: any = await productsAPI.getAll({ status: 'available' });
      const backendProducts = response.products || [];

      // Transform backend products to match the frontend format
      const transformedProducts = backendProducts.map((product: any, index: number) => ({
        id: product._id || index + 1000,
        name: product.name,
        type: product.category || 'meal',
        quantity: product.quantity || 0,
        unit: product.unit || 'kg',
        price: product.price || 0,
        supplier: product.seller_id?.full_name || 'Unknown Supplier',
        supplierId: product.seller_id?._id || 'N/A',
        location: product.location || 'India',
        quality: product.quality || 'Standard',
        protein: Math.floor(Math.random() * 50) + 20, // Mock data
        moisture: Math.floor(Math.random() * 15) + 5,
        fiber: Math.floor(Math.random() * 10) + 3,
        fat: Math.floor(Math.random() * 5) + 1,
        trend: parseFloat((Math.random() * 20 - 5).toFixed(2)), // Fixed to 2 decimal places
        demand: product.quantity > 5000 ? 'high' : product.quantity > 2000 ? 'medium' : 'low',
        iotVerified: true,
        exportReady: product.quality === 'Premium',
        certifications: product.quality === 'Premium' ? ['ISO 9001', 'FSSAI'] : ['FSSAI'],
        rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
        orders: Math.floor(Math.random() * 200) + 50,
        views: Math.floor(Math.random() * 3000) + 500,
        reviews: Math.floor(Math.random() * 70) + 10,
        exportMarkets: ['UAE', 'Singapore'],
        harvestDate: new Date(product.created_at || Date.now()).toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        minOrder: product.minOrder || 100,
        discount: 0,
        deliveryTime: '3-5 days',
        description: product.description || '',
        image_url: product.image_url || null
      }));

      // Only use MongoDB products (no sample products)
      setProducts(transformedProducts);
      setApiProducts(transformedProducts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      // Show empty array if API fails
      setProducts([]);
      setApiProducts([]);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to load products from database',
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || product.type === selectedType;
    const matchesDemand = selectedDemand === 'all' || product.demand === selectedDemand;
    return matchesSearch && matchesType && matchesDemand;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'trending') return b.trend - a.trend;
    if (sortBy === 'demand') return b.orders - a.orders;
    return b.rating - a.rating;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
    toast({
      title: favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites',
      description: favorites.includes(id) ? 'Product removed' : 'Product saved to favorites'
    });
  };

  const toggleCompare = (id: number) => {
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(p => p !== id));
      toast({ title: 'Removed from comparison' });
    } else if (compareList.length < 3) {
      setCompareList(prev => [...prev, id]);
      toast({ title: 'Added to comparison', description: `${compareList.length + 1}/3 products selected` });
    } else {
      toast({ title: 'Maximum reached', description: 'You can compare up to 3 products', variant: 'destructive' });
    }
  };

  const openQuickView = (product: any) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const openOrderDialog = (product: any) => {
    setSelectedProduct(product);
    setOrderDialogOpen(true);
  };

  const openPriceAlert = (product: any) => {
    setSelectedProduct(product);
    setTargetPrice(product.price * 0.9);
    setPriceAlertDialogOpen(true);
  };

  const handleSetPriceAlert = () => {
    if (selectedProduct) {
      setPriceAlerts(prev => [...prev, { productId: selectedProduct.id, targetPrice }]);
      toast({
        title: 'Price Alert Set!',
        description: `You'll be notified when ${selectedProduct.name} reaches ₹${targetPrice}`
      });
      setPriceAlertDialogOpen(false);
    }
  };


  const shareProduct = (product: any) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at ₹${product.price}/${product.unit}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const comparedProducts = products.filter(p => compareList.includes(p.id));
  const radarData = comparedProducts.length > 0 ? [
    { metric: 'Protein', ...Object.fromEntries(comparedProducts.map(p => [p.name, p.protein])) },
    { metric: 'Quality', ...Object.fromEntries(comparedProducts.map(p => [p.name, p.quality === 'Premium' ? 100 : 70])) },
    { metric: 'Rating', ...Object.fromEntries(comparedProducts.map(p => [p.name, p.rating * 20])) },
    { metric: 'Value', ...Object.fromEntries(comparedProducts.map(p => [p.name, 100 - (p.price / 50 * 100)])) },
  ] : [];

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className='space-y-8 animate-fade-in'>
          {/* Header with Actions */}
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold text-foreground mb-2 animate-slide-in-left'>
                Oilseed By-Products Marketplace
              </h1>
              <p className='text-muted-foreground text-lg animate-slide-in-left' style={{ animationDelay: '100ms' }}>
                Digital value chain platform with AI-powered insights
              </p>
            </div>
            <div className='flex gap-2 animate-slide-in-right'>
              {compareList.length > 0 && (
                <Button
                  variant='outline'
                  className='gap-2 animate-bounce-in'
                  onClick={() => setCompareDialogOpen(true)}
                >
                  <GitCompare className='w-4 h-4' />
                  Compare ({compareList.length})
                </Button>
              )}
              <Button
                variant='outline'
                className='gap-2'
                onClick={loadProducts}
                disabled={isLoading}
              >
                <Activity className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button variant='outline' className='gap-2'>
                <Download className='w-4 h-4' />
                Export Data
              </Button>
            </div>
          </div>

          {/* Enhanced Filters */}
          <Card className='border-border animate-slide-in-up' style={{ animationDelay: '400ms' }}>
            <CardContent className='pt-6'>
              <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                <div className='md:col-span-2'>
                  <div className='relative group'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
                    <Input
                      placeholder='Search by-products or suppliers...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='pl-10 focus:ring-2 focus:ring-primary/20 transition-all'
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className='hover:border-primary transition-colors'>
                    <Filter className='w-4 h-4 mr-2' />
                    <SelectValue placeholder='Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Types</SelectItem>
                    <SelectItem value='meal'>Meal</SelectItem>
                    <SelectItem value='cake'>Cake</SelectItem>
                    <SelectItem value='husk'>Husk/Bran</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDemand} onValueChange={setSelectedDemand}>
                  <SelectTrigger className='hover:border-primary transition-colors'>
                    <Activity className='w-4 h-4 mr-2' />
                    <SelectValue placeholder='Demand' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Demand</SelectItem>
                    <SelectItem value='high'>High Demand</SelectItem>
                    <SelectItem value='medium'>Medium Demand</SelectItem>
                    <SelectItem value='low'>Low Demand</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='hover:border-primary transition-colors'>
                    <TrendingUp className='w-4 h-4 mr-2' />
                    <SelectValue placeholder='Sort' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='trending'>Trending</SelectItem>
                    <SelectItem value='demand'>High Demand</SelectItem>
                    <SelectItem value='price-low'>Price: Low to High</SelectItem>
                    <SelectItem value='price-high'>Price: High to Low</SelectItem>
                    <SelectItem value='rating'>Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Product Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {isLoading ? (
              <div className='col-span-full text-center py-12'>
                <Activity className='w-12 h-12 mx-auto mb-4 animate-spin text-primary' />
                <p className='text-lg text-muted-foreground'>Loading products from database...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className='col-span-full text-center py-12'>
                <Package className='w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50' />
                <h3 className='text-xl font-semibold mb-2'>No Products Available</h3>
                <p className='text-muted-foreground mb-4'>
                  {products.length === 0
                    ? 'No products have been added to the marketplace yet.'
                    : 'No products match your search criteria.'}
                </p>
                {products.length === 0 && (
                  <p className='text-sm text-muted-foreground'>
                    Farmers can add products from their "My Listings" page.
                  </p>
                )}
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className='border-border hover:border-primary hover:shadow-lg transition-all duration-300 group overflow-hidden cursor-pointer'
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className='absolute top-2 right-2 z-10'>
                      <Badge className='bg-red-500 text-white text-xs'>
                        {product.discount}% OFF
                      </Badge>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className='relative w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden'>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <Package className='w-12 h-12 text-gray-400' />
                      </div>
                    )}

                    {/* Quick Action Buttons */}
                    <div className='absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 bg-white/90 hover:bg-white'
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                        />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 bg-white/90 hover:bg-white'
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(product.id);
                        }}
                      >
                        <GitCompare
                          className={`w-4 h-4 ${compareList.includes(product.id) ? 'text-primary' : 'text-gray-600'}`}
                        />
                      </Button>
                    </div>
                  </div>

                  <CardContent className='p-3'>
                    {/* Product Name */}
                    <h3 className='font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors'>
                      {product.name}
                    </h3>

                    {/* Badges */}
                    <div className='flex items-center gap-1 mb-2 flex-wrap'>
                      <Badge variant='secondary' className='text-xs px-1.5 py-0'>{product.type}</Badge>
                      {product.iotVerified && (
                        <Badge className='bg-blue-100 text-blue-800 text-xs px-1.5 py-0'>
                          <Zap className='w-2.5 h-2.5 mr-0.5' />
                          IoT
                        </Badge>
                      )}
                      {product.exportReady && (
                        <Badge className='bg-green-100 text-green-800 text-xs px-1.5 py-0'>
                          <Globe className='w-2.5 h-2.5 mr-0.5' />
                          Export
                        </Badge>
                      )}
                    </div>

                    {/* Price */}
                    <div className='mb-2'>
                      <div className='flex items-baseline gap-1'>
                        <span className='text-xl font-bold text-primary'>₹{product.price}</span>
                        <span className='text-xs text-muted-foreground'>/{product.unit}</span>
                      </div>
                      {product.discount > 0 && (
                        <span className='text-xs text-muted-foreground line-through'>
                          ₹{Math.round(product.price / (1 - product.discount / 100))}
                        </span>
                      )}
                    </div>

                    {/* Supplier & Rating */}
                    <div className='flex items-center justify-between text-xs text-muted-foreground mb-2'>
                      <div className='flex items-center gap-1 truncate'>
                        <Factory className='w-3 h-3 flex-shrink-0' />
                        <span className='truncate'>{product.supplier}</span>
                      </div>
                      <div className='flex items-center gap-0.5'>
                        <Star className='w-3 h-3 fill-yellow-500 text-yellow-500' />
                        <span className='font-medium'>{product.rating}</span>
                      </div>
                    </div>

                    {/* Stock & Location */}
                    <div className='flex items-center justify-between text-xs text-muted-foreground mb-3'>
                      <span className='flex items-center gap-1'>
                        <Package className='w-3 h-3' />
                        {product.quantity} {product.unit}
                      </span>
                      <span className='flex items-center gap-1 truncate'>
                        <MapPin className='w-3 h-3 flex-shrink-0' />
                        <span className='truncate'>{product.location.split(',')[0]}</span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className='grid grid-cols-2 gap-2'>
                      <Button
                        size='sm'
                        className='text-xs h-8'
                        onClick={() => openOrderDialog(product)}
                      >
                        <ShoppingCart className='w-3 h-3 mr-1' />
                        Order
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        className='text-xs h-8'
                        onClick={() => openQuickView(product)}
                      >
                        <Eye className='w-3 h-3 mr-1' />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Order Flow - Multi-step Order Process */}
          {selectedProduct && (
            <OrderFlow
              open={orderDialogOpen}
              onOpenChange={setOrderDialogOpen}
              product={selectedProduct}
              user={user}
            />
          )}

          {/* Quick View Dialog */}
          <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
            <DialogContent className='max-w-4xl animate-scale-in'>
              <DialogHeader>
                <DialogTitle>Product Details</DialogTitle>
              </DialogHeader>
              {selectedProduct && (
                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-2xl font-bold mb-2'>{selectedProduct.name}</h3>
                      <div className='flex items-center gap-2 mb-4'>
                        <Badge>{selectedProduct.type}</Badge>
                        <Badge className={getDemandColor(selectedProduct.demand)}>{selectedProduct.demand}</Badge>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Protein:</span>
                        <span className='font-semibold'>{selectedProduct.protein}%</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Moisture:</span>
                        <span className='font-semibold'>{selectedProduct.moisture}%</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Fiber:</span>
                        <span className='font-semibold'>{selectedProduct.fiber}%</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Fat:</span>
                        <span className='font-semibold'>{selectedProduct.fat}%</span>
                      </div>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div className='p-4 bg-accent/50 rounded-lg'>
                      <h4 className='font-semibold mb-2'>Supplier Information</h4>
                      <div className='space-y-1 text-sm'>
                        <p><span className='text-muted-foreground'>Name:</span> {selectedProduct.supplier}</p>
                        <p><span className='text-muted-foreground'>ID:</span> {selectedProduct.supplierId}</p>
                        <p><span className='text-muted-foreground'>Location:</span> {selectedProduct.location}</p>
                        <p><span className='text-muted-foreground'>Rating:</span> {selectedProduct.rating} ⭐</p>
                      </div>
                    </div>
                    <div className='p-4 bg-accent/50 rounded-lg'>
                      <h4 className='font-semibold mb-2'>Delivery & Dates</h4>
                      <div className='space-y-1 text-sm'>
                        <p><span className='text-muted-foreground'>Delivery:</span> {selectedProduct.deliveryTime}</p>
                        <p><span className='text-muted-foreground'>Harvest:</span> {selectedProduct.harvestDate}</p>
                        <p><span className='text-muted-foreground'>Expiry:</span> {selectedProduct.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Price Alert Dialog */}
          <Dialog open={priceAlertDialogOpen} onOpenChange={setPriceAlertDialogOpen}>
            <DialogContent className='animate-scale-in'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                  <Bell className='w-5 h-5' />
                  Set Price Alert
                </DialogTitle>
                <DialogDescription>
                  Get notified when the price drops below your target
                </DialogDescription>
              </DialogHeader>
              {selectedProduct && (
                <div className='space-y-4'>
                  <div className='p-4 bg-accent/50 rounded-lg'>
                    <p className='font-semibold'>{selectedProduct.name}</p>
                    <p className='text-sm text-muted-foreground'>Current price: ₹{selectedProduct.price}</p>
                  </div>
                  <div>
                    <Label htmlFor='targetPrice'>Target Price (₹)</Label>
                    <Input
                      id='targetPrice'
                      type='number'
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                      className='mt-1'
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant='outline' onClick={() => setPriceAlertDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSetPriceAlert} className='gap-2'>
                  <Bell className='w-4 h-4' />
                  Set Alert
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Compare Dialog */}
          <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
            <DialogContent className='max-w-6xl animate-scale-in'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                  <GitCompare className='w-5 h-5' />
                  Product Comparison
                </DialogTitle>
              </DialogHeader>
              {comparedProducts.length > 0 && (
                <div className='space-y-6'>
                  <div className='grid grid-cols-3 gap-4'>
                    {comparedProducts.map(product => (
                      <Card key={product.id} className='border-border'>
                        <CardHeader>
                          <CardTitle className='text-lg'>{product.name}</CardTitle>
                          <p className='text-2xl font-bold text-primary'>₹{product.price}</p>
                        </CardHeader>
                        <CardContent className='space-y-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>Protein:</span>
                            <span className='font-semibold'>{product.protein}%</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>Quality:</span>
                            <span className='font-semibold'>{product.quality}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>Rating:</span>
                            <span className='font-semibold'>{product.rating} ⭐</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>Delivery:</span>
                            <span className='font-semibold'>{product.deliveryTime}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {radarData.length > 0 && (
                    <Card className='border-border'>
                      <CardHeader>
                        <CardTitle>Performance Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width='100%' height={300}>
                          <RadarChart data={radarData}>
                            <PolarGrid stroke='hsl(var(--border))' />
                            <PolarAngleAxis dataKey='metric' stroke='hsl(var(--foreground))' />
                            <PolarRadiusAxis stroke='hsl(var(--muted-foreground))' />
                            {comparedProducts.map((product, i) => (
                              <Radar
                                key={product.id}
                                name={product.name}
                                dataKey={product.name}
                                stroke={['#10b981', '#3b82f6', '#f59e0b'][i]}
                                fill={['#10b981', '#3b82f6', '#f59e0b'][i]}
                                fillOpacity={0.3}
                              />
                            ))}
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
};

export default Marketplace;
