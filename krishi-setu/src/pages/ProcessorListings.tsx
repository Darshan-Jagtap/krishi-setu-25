import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { productsAPI, uploadAPI } from '@/lib/api';
import {
    Package,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    RefreshCw,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    DollarSign,
    Layers,
    Image as ImageIcon
} from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    unit: string;
    description: string;
    image_url?: string;
    status: 'available' | 'sold' | 'reserved';
    created_at: string;
}

const ProcessorListings = () => {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        unit: 'kg',
        description: '',
        status: 'available' as 'available' | 'sold' | 'reserved'
    });

    // Load products
    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const response = await productsAPI.getMyProducts();

            if (response.success) {
                setProducts(response.products || []);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            toast({
                title: 'Error',
                description: 'Failed to load products',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add product
    const handleAddProduct = async () => {
        if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all required fields',
                variant: 'destructive'
            });
            return;
        }

        try {
            setIsSubmitting(true);

            let imageUrl = '';
            if (imageFile) {
                const uploadResponse = await uploadAPI.uploadImage(imageFile);
                imageUrl = uploadResponse.url;
            }

            const productData = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                description: formData.description,
                image_url: imageUrl,
                status: formData.status
            };

            const response = await productsAPI.create(productData);

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Product added successfully',
                });
                setIsAddDialogOpen(false);
                resetForm();
                loadProducts();
            }
        } catch (error: any) {
            console.error('Error adding product:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to add product',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit product
    const handleEditProduct = async () => {
        if (!selectedProduct) return;

        try {
            setIsSubmitting(true);

            let imageUrl = selectedProduct.image_url;
            if (imageFile) {
                const uploadResponse = await uploadAPI.uploadImage(imageFile);
                imageUrl = uploadResponse.url;
            }

            const productData = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                description: formData.description,
                image_url: imageUrl,
                status: formData.status
            };

            const response = await productsAPI.update(selectedProduct._id, productData);

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Product updated successfully',
                });
                setIsEditDialogOpen(false);
                resetForm();
                loadProducts();
            }
        } catch (error: any) {
            console.error('Error updating product:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update product',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete product
    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await productsAPI.delete(productId);

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Product deleted successfully',
                });
                loadProducts();
            }
        } catch (error: any) {
            console.error('Error deleting product:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete product',
                variant: 'destructive'
            });
        }
    };

    // Open edit dialog
    const openEditDialog = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            quantity: product.quantity.toString(),
            unit: product.unit,
            description: product.description,
            status: product.status
        });
        setImagePreview(product.image_url || '');
        setIsEditDialogOpen(true);
    };

    // Open view dialog
    const openViewDialog = (product: Product) => {
        setSelectedProduct(product);
        setIsViewDialogOpen(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            price: '',
            quantity: '',
            unit: 'kg',
            description: '',
            status: 'available'
        });
        setImageFile(null);
        setImagePreview('');
        setSelectedProduct(null);
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Get unique categories
    const categories = Array.from(new Set(products.map(p => p.category)));

    // Calculate stats
    const stats = {
        total: products.length,
        available: products.filter(p => p.status === 'available').length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
        avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800 border-green-300';
            case 'sold': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Package className="w-8 h-8 text-primary" />
                            My Product Listings
                        </h1>
                        <p className="text-muted-foreground">Manage your product inventory and listings</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={loadProducts}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2" onClick={resetForm}>
                                    <Plus className="w-4 h-4" />
                                    Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add New Product</DialogTitle>
                                    <DialogDescription>Fill in the details to add a new product to your listings</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Product Name *</Label>
                                            <Input
                                                placeholder="e.g., Premium Mustard Oil"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Category *</Label>
                                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Cooking Oils">Cooking Oils</SelectItem>
                                                    <SelectItem value="Specialty Oils">Specialty Oils</SelectItem>
                                                    <SelectItem value="Organic Products">Organic Products</SelectItem>
                                                    <SelectItem value="Oil Cakes">Oil Cakes</SelectItem>
                                                    <SelectItem value="By-products">By-products</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label>Price (₹) *</Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={(e) => {
                                                    const value = parseFloat(e.target.value) || 0;
                                                    if (value <= 1000000) {
                                                        setFormData({ ...formData, price: e.target.value });
                                                    }
                                                }}
                                                onInput={(e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    const value = parseFloat(input.value) || 0;
                                                    if (value > 1000000) {
                                                        input.value = '1000000';
                                                        setFormData({ ...formData, price: '1000000' });
                                                    }
                                                }}
                                                min="0"
                                                max="1000000"
                                            />
                                        </div>
                                        <div>
                                            <Label>Quantity *</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={formData.quantity}
                                                onChange={(e) => {
                                                    const value = parseFloat(e.target.value) || 0;
                                                    if (value <= 1000000) {
                                                        setFormData({ ...formData, quantity: e.target.value });
                                                    }
                                                }}
                                                onInput={(e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    const value = parseFloat(input.value) || 0;
                                                    if (value > 1000000) {
                                                        input.value = '1000000';
                                                        setFormData({ ...formData, quantity: '1000000' });
                                                    }
                                                }}
                                                min="0"
                                                max="1000000"
                                            />
                                        </div>
                                        <div>
                                            <Label>Unit</Label>
                                            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                                    <SelectItem value="L">Liters (L)</SelectItem>
                                                    <SelectItem value="ton">Tons</SelectItem>
                                                    <SelectItem value="quintal">Quintals</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Describe your product..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <Label>Product Image</Label>
                                        <div className="mt-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            {imagePreview && (
                                                <div className="mt-2 relative w-32 h-32">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="absolute top-1 right-1"
                                                        onClick={() => {
                                                            setImageFile(null);
                                                            setImagePreview('');
                                                        }}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Status</Label>
                                        <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="reserved">Reserved</SelectItem>
                                                <SelectItem value="sold">Sold</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddProduct} disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Product
                                            </>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-100">
                                    <Layers className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Available</p>
                                    <p className="text-2xl font-bold">{stats.available}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-green-100">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                                    <p className="text-2xl font-bold">₹{(stats.totalValue / 100000).toFixed(2)}L</p>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-100">
                                    <DollarSign className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Avg Price</p>
                                    <p className="text-2xl font-bold">₹{stats.avgPrice.toFixed(0)}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-orange-100">
                                    <TrendingUp className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products ({filteredProducts.length})</CardTitle>
                        <CardDescription>Manage your product listings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-12">
                                <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground animate-spin mb-4" />
                                <p className="text-muted-foreground">Loading products...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No products found</p>
                                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Your First Product
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredProducts.map(product => (
                                    <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-16 h-16 text-gray-400" />
                                                </div>
                                            )}
                                            <Badge className={`absolute top-2 right-2 ${getStatusColor(product.status)}`}>
                                                {product.status}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
                                                    <p className="text-xs text-muted-foreground">per {product.unit}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{product.quantity} {product.unit}</p>
                                                    <p className="text-xs text-muted-foreground">in stock</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="flex-1" onClick={() => openViewDialog(product)}>
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    View
                                                </Button>
                                                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditDialog(product)}>
                                                    <Edit className="w-3 h-3 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product._id)}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>Update product details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Product Name *</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cooking Oils">Cooking Oils</SelectItem>
                                            <SelectItem value="Specialty Oils">Specialty Oils</SelectItem>
                                            <SelectItem value="Organic Products">Organic Products</SelectItem>
                                            <SelectItem value="Oil Cakes">Oil Cakes</SelectItem>
                                            <SelectItem value="By-products">By-products</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Price (₹) *</Label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            if (value <= 1000000) {
                                                setFormData({ ...formData, price: e.target.value });
                                            }
                                        }}
                                        onInput={(e) => {
                                            const input = e.target as HTMLInputElement;
                                            const value = parseFloat(input.value) || 0;
                                            if (value > 1000000) {
                                                input.value = '1000000';
                                                setFormData({ ...formData, price: '1000000' });
                                            }
                                        }}
                                        min="0"
                                        max="1000000"
                                    />
                                </div>
                                <div>
                                    <Label>Quantity *</Label>
                                    <Input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            if (value <= 1000000) {
                                                setFormData({ ...formData, quantity: e.target.value });
                                            }
                                        }}
                                        onInput={(e) => {
                                            const input = e.target as HTMLInputElement;
                                            const value = parseFloat(input.value) || 0;
                                            if (value > 1000000) {
                                                input.value = '1000000';
                                                setFormData({ ...formData, quantity: '1000000' });
                                            }
                                        }}
                                        min="0"
                                        max="1000000"
                                    />
                                </div>
                                <div>
                                    <Label>Unit</Label>
                                    <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                            <SelectItem value="L">Liters (L)</SelectItem>
                                            <SelectItem value="ton">Tons</SelectItem>
                                            <SelectItem value="quintal">Quintals</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>Product Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <div className="mt-2 relative w-32 h-32">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="reserved">Reserved</SelectItem>
                                        <SelectItem value="sold">Sold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleEditProduct} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Update Product
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Product Details</DialogTitle>
                        </DialogHeader>
                        {selectedProduct && (
                            <div className="space-y-4">
                                {selectedProduct.image_url && (
                                    <div className="w-full h-64 rounded-lg overflow-hidden">
                                        <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Product Name</Label>
                                        <p className="font-semibold">{selectedProduct.name}</p>
                                    </div>
                                    <div>
                                        <Label>Category</Label>
                                        <p className="font-semibold">{selectedProduct.category}</p>
                                    </div>
                                    <div>
                                        <Label>Price</Label>
                                        <p className="font-semibold text-green-600">₹{selectedProduct.price}</p>
                                    </div>
                                    <div>
                                        <Label>Quantity</Label>
                                        <p className="font-semibold">{selectedProduct.quantity} {selectedProduct.unit}</p>
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        <Badge className={getStatusColor(selectedProduct.status)}>
                                            {selectedProduct.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <Label>Created</Label>
                                        <p className="text-sm">{new Date(selectedProduct.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <p className="text-sm text-muted-foreground">{selectedProduct.description || 'No description provided'}</p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default ProcessorListings;
