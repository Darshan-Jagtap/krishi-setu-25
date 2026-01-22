import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    Users,
    Star,
    Clock,
    Search,
    Filter,
    Download,
    Eye,
    MapPin,
    Sparkles,
    RefreshCw,
    Zap,
    Globe,
    DollarSign,
    Package,
    Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import OrderFlow from '@/components/OrderFlow';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const sampleProducts = [
    {
        id: 1,
        name: 'Soybean Meal',
        type: 'meal',
        quantity: 5000,
        unit: 'kg',
        price: 45,
        supplier: 'Green Valley Processors',
        location: 'Maharashtra, India',
        trend: 8.5,
        demand: 'high',
        iotVerified: true,
        exportReady: true,
        rating: 4.8,
        reviews: 45,
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
        location: 'Rajasthan, India',
        trend: -2.3,
        demand: 'medium',
        iotVerified: true,
        exportReady: false,
        rating: 4.5,
        reviews: 28,
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
        location: 'Gujarat, India',
        trend: 12.4,
        demand: 'high',
        iotVerified: true,
        exportReady: true,
        rating: 4.6,
        reviews: 67,
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
        location: 'Karnataka, India',
        trend: 5.2,
        demand: 'medium',
        iotVerified: true,
        exportReady: true,
        rating: 4.9,
        reviews: 52,
        minOrder: 100,
        discount: 3,
        deliveryTime: '3-5 days'
    }
];

const BuyerPage = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [products, setProducts] = useState(sampleProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [sortBy, setSortBy] = useState('trending');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);

    const marketMetrics = [
        { label: 'Market Value', value: '₹226K', change: '+12.5%', icon: DollarSign, color: 'text-blue-600' },
        { label: 'IoT Verified', value: '100%', change: 'Real-time', icon: Zap, color: 'text-purple-600' },
        { label: 'Export Ready', value: '3/4', change: 'Global', icon: Globe, color: 'text-green-600' },
        { label: 'Avg Price', value: '₹32', change: 'Per kg', icon: TrendingUp, color: 'text-orange-600' }
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || product.type === selectedType;
        return matchesSearch && matchesType;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'trending') return b.trend - a.trend;
        return b.rating - a.rating;
    });

    const toggleFavorite = (id: number) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
        toast({ title: favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites' });
    };

    const openOrderDialog = (product: any) => {
        setSelectedProduct(product);
        setOrderDialogOpen(true);
    };

    const getDemandColor = (demand: string) => {
        switch (demand) {
            case 'high': return 'bg-green-100 text-green-700 dark:bg-green-950/30';
            case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30';
            case 'low': return 'bg-red-100 text-red-700 dark:bg-red-950/30';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <DashboardLayout>
            <TooltipProvider>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between animate-fade-in">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                Marketplace
                            </h1>
                            <p className="text-muted-foreground">Browse and order premium oilseed by-products</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all shadow-lg">
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* Market Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {marketMetrics.map((metric, i) => (
                            <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                                            <p className="text-3xl font-bold">{metric.value}</p>
                                            <p className={`text-xs ${metric.color} mt-1 font-medium`}>{metric.change}</p>
                                        </div>
                                        <metric.icon className={`w-10 h-10 ${metric.color} opacity-50 group-hover:scale-110 transition-transform`} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Filters */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            placeholder="Search products or suppliers..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger>
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="meal">Meal</SelectItem>
                                        <SelectItem value="cake">Cake</SelectItem>
                                        <SelectItem value="husk">Husk/Bran</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="trending">Trending</SelectItem>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        <SelectItem value="rating">Highest Rated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredProducts.map((product, index) => (
                            <Card key={product.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                                {product.discount > 0 && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-lg">
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            {product.discount}% OFF
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-foreground group-hover:text-primary transition-colors">{product.name}</CardTitle>
                                                {product.iotVerified && (
                                                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/30 animate-pulse">
                                                        <Zap className="w-3 h-3 mr-1" />
                                                        IoT
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="secondary">{product.type}</Badge>
                                                <Badge className={getDemandColor(product.demand)}>{product.demand} demand</Badge>
                                                {product.exportReady && (
                                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30">
                                                        <Globe className="w-3 h-3 mr-1" />
                                                        Export
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <UITooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={() => toggleFavorite(product.id)} className="hover:scale-110 transition-transform">
                                                    <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500 animate-bounce' : 'text-muted-foreground'}`} />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Add to favorites</TooltipContent>
                                        </UITooltip>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Price Section */}
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹{product.price}</span>
                                                    {product.discount > 0 && (
                                                        <span className="text-lg text-muted-foreground line-through">₹{Math.round(product.price / (1 - product.discount / 100))}</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground">per {product.unit}</div>
                                            </div>
                                            <div className={`text-right ${product.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                <div className="flex items-center justify-end gap-1 text-lg font-semibold">
                                                    {product.trend > 0 ? <TrendingUp className="w-5 h-5 animate-bounce" /> : <TrendingDown className="w-5 h-5" />}
                                                    {Math.abs(product.trend)}%
                                                </div>
                                                <div className="text-xs text-muted-foreground">7-day trend</div>
                                            </div>
                                        </div>

                                        {/* Supplier Info */}
                                        <div className="space-y-2 p-3 bg-accent/30 rounded-lg">
                                            <div className="flex items-center text-sm">
                                                <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                                                <span className="font-medium">{product.supplier}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center text-muted-foreground">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {product.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" />
                                                    <span className="font-semibold">{product.rating}</span>
                                                    <span className="text-muted-foreground ml-1">({product.reviews})</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {product.deliveryTime}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Package className="w-3 h-3" />
                                                    Available: {product.quantity} {product.unit}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all shadow-lg group/btn" onClick={() => openOrderDialog(product)}>
                                                <ShoppingCart className="w-4 h-4 group-hover/btn:animate-bounce" />
                                                Order Now
                                            </Button>
                                            <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
                                                <Eye className="w-4 h-4" />
                                                Quick View
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Order Flow Dialog */}
                    {selectedProduct && (
                        <OrderFlow
                            open={orderDialogOpen}
                            onOpenChange={setOrderDialogOpen}
                            product={selectedProduct}
                            user={user}
                        />
                    )}
                </div>
            </TooltipProvider>
        </DashboardLayout>
    );
};

export default BuyerPage;
