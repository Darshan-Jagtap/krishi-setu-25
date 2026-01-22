import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Package,
    Plus,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    DollarSign,
    BarChart3,
    Upload,
    Image as ImageIcon,
    X,
    Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { productsAPI, uploadAPI, API_URL } from '@/lib/api';

const FarmerListings = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [newListing, setNewListing] = useState({
        name: '',
        category: 'oilseed',
        quantity: 0,
        unit: 'kg',
        price: 0,
        quality: 'Standard',
        description: '',
        location: 'Maharashtra, India',
        minOrder: 100,
        image_url: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    useEffect(() => {
        loadListings();
    }, []);

    const loadListings = async () => {
        try {
            setIsLoading(true);
            const response = await productsAPI.getMyProducts();
            setListings(response.products || []);
        } catch (error) {
            console.error('Error loading listings:', error);
            toast({
                title: 'Error',
                description: 'Failed to load listings',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        {
            title: 'Total Listings',
            value: listings.length,
            icon: Package,
            color: 'bg-blue-100 text-blue-600',
            change: '+2 this month',
        },
        {
            title: 'Total Value',
            value: `₹${listings.reduce((sum, l) => sum + (l.price * l.quantity || 0), 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-100 text-green-600',
            change: 'Inventory value',
        },
        {
            title: 'Active Products',
            value: listings.filter(l => l.status === 'available').length,
            icon: TrendingUp,
            color: 'bg-purple-100 text-purple-600',
            change: 'In stock',
        },
        {
            title: 'Avg Price',
            value: listings.length > 0 ? `₹${Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length)}` : '₹0',
            icon: BarChart3,
            color: 'bg-orange-100 text-orange-600',
            change: 'per kg',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'low_stock':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'out_of_stock':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload a JPEG, PNG, GIF, or WebP image',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Image must be less than 5MB',
                variant: 'destructive',
            });
            return;
        }

        // Set preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        try {
            setIsUploading(true);
            const response = await uploadAPI.uploadImage(file);
            const imageUrl = `${API_URL}${response.url}`;
            setNewListing({ ...newListing, image_url: imageUrl });
            setSelectedFile(file);

            toast({
                title: 'Success',
                description: 'Image uploaded successfully',
            });
        } catch (error: any) {
            toast({
                title: 'Upload failed',
                description: error.message || 'Failed to upload image',
                variant: 'destructive',
            });
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAnalyzeImage = async () => {
        if (!selectedFile) {
            toast({
                title: 'No image',
                description: 'Please upload an image first',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsAnalyzing(true);
            const response = await uploadAPI.analyzeImage(selectedFile);
            setAnalysisResult(response.analysis);

            // Auto-populate form fields
            const analysis = response.analysis;
            setNewListing(prev => ({
                ...prev,
                name: analysis.product_name || prev.name,
                price: analysis.indicative_market_price?.recommended || prev.price,
                quality: analysis.quality_grade === 'A' ? 'Premium' : 'Standard',
                description: analysis.visual_observations || prev.description,
            }));

            toast({
                title: 'Analysis Complete!',
                description: `Identified as ${analysis.product_name} - Grade ${analysis.quality_grade}`,
            });
        } catch (error: any) {
            toast({
                title: 'Analysis Failed',
                description: error.message || 'Failed to analyze image',
                variant: 'destructive',
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddListing = async () => {
        try {
            if (!newListing.name || !newListing.quantity || !newListing.price) {
                toast({
                    title: 'Validation Error',
                    description: 'Please fill in all required fields',
                    variant: 'destructive',
                });
                return;
            }

            const productData = {
                name: newListing.name,
                category: newListing.category,
                quantity: Number(newListing.quantity),
                unit: newListing.unit,
                price: Number(newListing.price),
                description: newListing.description,
                location: newListing.location,
                status: 'available',
                minOrder: Number(newListing.minOrder),
                quality: newListing.quality,
                image_url: newListing.image_url || undefined,
            };

            await productsAPI.create(productData);

            setIsAddDialogOpen(false);
            setNewListing({
                name: '',
                category: 'oilseed',
                quantity: 0,
                unit: 'kg',
                price: 0,
                quality: 'Standard',
                description: '',
                location: 'Maharashtra, India',
                minOrder: 100,
                image_url: '',
            });
            setImagePreview(null);
            setSelectedFile(null);

            toast({
                title: 'Success!',
                description: 'Product added to marketplace successfully',
            });

            loadListings();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to add product',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteListing = async (id: string) => {
        try {
            await productsAPI.delete(id);
            toast({
                title: 'Success',
                description: 'Product deleted successfully',
            });
            loadListings();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete product',
                variant: 'destructive',
            });
        }
    };

    const handleViewMarketplace = () => {
        navigate('/marketplace');
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Package className="w-8 h-8 text-primary" />
                            My Listings
                        </h1>
                        <p className="text-muted-foreground">Manage your product listings and inventory</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleViewMarketplace}>
                            <Eye className="w-4 h-4 mr-2" />
                            View in Marketplace
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add New Listing
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Add New Product Listing</DialogTitle>
                                    <DialogDescription>Fill in the details to list your product on the marketplace</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
                                    <div>
                                        <Label>Product Name *</Label>
                                        <Input
                                            value={newListing.name}
                                            onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                                            placeholder="e.g., Mustard Seeds, Soybean Oil"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Category *</Label>
                                            <select
                                                className="w-full p-2 border rounded-md"
                                                value={newListing.category}
                                                onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                                            >
                                                <option value="oilseed">Oilseed</option>
                                                <option value="meal">Meal</option>
                                                <option value="cake">Cake</option>
                                                <option value="husk">Husk</option>
                                                <option value="oil">Oil</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Quality</Label>
                                            <select
                                                className="w-full p-2 border rounded-md"
                                                value={newListing.quality}
                                                onChange={(e) => setNewListing({ ...newListing, quality: e.target.value })}
                                            >
                                                <option value="Premium">Premium</option>
                                                <option value="Standard">Standard</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="col-span-2">
                                            <Label>Quantity *</Label>
                                            <Input
                                                type="number"
                                                value={newListing.quantity}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (value <= 1000000) {
                                                        setNewListing({ ...newListing, quantity: value });
                                                    }
                                                }}
                                                onInput={(e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    const value = Number(input.value);
                                                    if (value > 1000000) {
                                                        input.value = '1000000';
                                                        setNewListing({ ...newListing, quantity: 1000000 });
                                                    }
                                                }}
                                                min="0"
                                                max="1000000"
                                            />
                                        </div>
                                        <div>
                                            <Label>Unit</Label>
                                            <Input
                                                value={newListing.unit}
                                                onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Price (₹) *</Label>
                                            <Input
                                                type="number"
                                                value={newListing.price}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (value <= 1000000) {
                                                        setNewListing({ ...newListing, price: value });
                                                    }
                                                }}
                                                onInput={(e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    const value = Number(input.value);
                                                    if (value > 1000000) {
                                                        input.value = '1000000';
                                                        setNewListing({ ...newListing, price: 1000000 });
                                                    }
                                                }}
                                                min="0"
                                                max="1000000"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Product Image</Label>
                                        <div className="space-y-3">
                                            {imagePreview ? (
                                                <div className="relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                        </div>
                                                    )}
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            setNewListing({ ...newListing, image_url: '' });
                                                            setSelectedFile(null);
                                                        }}
                                                        disabled={isUploading}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <label className="block">
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                                                        {isUploading ? (
                                                            <>
                                                                <Loader2 className="w-12 h-12 mx-auto text-primary mb-4 animate-spin" />
                                                                <p className="text-sm text-muted-foreground">Uploading...</p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                                                <p className="text-sm text-muted-foreground mb-2">Click to upload product image</p>
                                                                <p className="text-xs text-muted-foreground mb-4">PNG, JPG, GIF, WebP up to 5MB</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                        className="hidden"
                                                        onChange={handleFileSelect}
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        {/* AI Analysis Section */}
                                        {imagePreview && (
                                            <div className="space-y-3">
                                                <Button
                                                    type="button"
                                                    onClick={handleAnalyzeImage}
                                                    disabled={isAnalyzing || isUploading}
                                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                                >
                                                    {isAnalyzing ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Analyzing Image...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BarChart3 className="w-4 h-4 mr-2" />
                                                            Analyze with AI
                                                        </>
                                                    )}
                                                </Button>

                                                {analysisResult && (
                                                    <Alert className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                                                        <BarChart3 className="h-4 w-4 text-green-600" />
                                                        <AlertTitle className="text-green-800">AI Analysis Results</AlertTitle>
                                                        <AlertDescription className="space-y-2 text-sm">
                                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                                <div>
                                                                    <span className="font-semibold">Product:</span> {analysisResult.product_name}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Variety:</span> {analysisResult.variety}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Quality Grade:</span>{' '}
                                                                    <Badge variant={analysisResult.quality_grade === 'A' ? 'default' : 'secondary'}>
                                                                        {analysisResult.quality_grade}
                                                                    </Badge>
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Price Range:</span> ₹
                                                                    {analysisResult.indicative_market_price?.min} - ₹
                                                                    {analysisResult.indicative_market_price?.max}
                                                                </div>
                                                            </div>
                                                            <div className="pt-2 border-t">
                                                                <span className="font-semibold">Key Observations:</span>
                                                                <div className="text-muted-foreground mt-1 space-y-1 text-sm whitespace-pre-line">
                                                                    • {analysisResult.visual_observations}
                                                                </div>
                                                            </div>
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            value={newListing.description}
                                            onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                                            placeholder="Describe your product..."
                                        />
                                    </div>
                                    <Button onClick={handleAddListing} className="w-full">
                                        Add to Marketplace
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={idx} className="hover:shadow-lg transition-shadow">
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

                {/* Listings Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Listings</CardTitle>
                        <CardDescription>Manage and track your product listings on the marketplace</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No listings yet. Add your first product to get started!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {listings.map((listing: any, idx: number) => (
                                    <div
                                        key={listing._id || idx}
                                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex gap-4">
                                            {/* Product Image Thumbnail */}
                                            <div className="flex-shrink-0">
                                                {listing.image_url ? (
                                                    <img
                                                        src={listing.image_url}
                                                        alt={listing.name}
                                                        className="w-24 h-24 object-cover rounded-lg border"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-semibold text-lg">{listing.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{listing.description}</p>
                                                    </div>
                                                    <Badge className={`${getStatusColor(listing.status)} border capitalize`}>
                                                        {listing.status?.replace('_', ' ')}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground text-xs mb-1">Quantity</p>
                                                        <p className="font-semibold">{listing.quantity} {listing.unit}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground text-xs mb-1">Price</p>
                                                        <p className="font-semibold">₹{listing.price}/{listing.unit}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground text-xs mb-1">Category</p>
                                                        <p className="font-semibold capitalize">{listing.category}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground text-xs mb-1">Quality</p>
                                                        <p className="font-semibold">{listing.quality}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        <Edit className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={handleViewMarketplace}>
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        View in Marketplace
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleDeleteListing(listing._id)}
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default FarmerListings;
