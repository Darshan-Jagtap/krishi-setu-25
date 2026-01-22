import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    Users,
    Info,
    Percent,
    UserCheck,
    AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { productsAPI, uploadAPI, fpoAPI, API_URL } from '@/lib/api';

interface FPOMember {
    _id: string;
    farmer_id: {
        _id: string;
        full_name: string;
        email: string;
    };
    contribution_percentage?: number;
}

interface FarmerContribution {
    farmer_id: string;
    farmer_name: string;
    quantity: number;
    percentage: number;
}

const FPOListings = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [members, setMembers] = useState<FPOMember[]>([]);
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
    const [farmerContributions, setFarmerContributions] = useState<FarmerContribution[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [listingsRes, membersRes] = await Promise.all([
                productsAPI.getMyProducts(),
                fpoAPI.getMembers()
            ]);

            setListings(listingsRes.products || []);
            setMembers(membersRes.members || []);
        } catch (error) {
            console.error('Error loading FPO data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load FPO data',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize farmer contributions when quantity changes
    useEffect(() => {
        if (newListing.quantity > 0 && members.length > 0) {
            // Auto-distribute based on contribution percentage or equally
            const totalContribution = members.reduce((sum, m) => sum + (m.contribution_percentage || 0), 0);

            if (totalContribution > 0) {
                // Use existing contribution percentages
                const contributions = members.map(member => {
                    const percentage = member.contribution_percentage || 0;
                    const quantity = (newListing.quantity * percentage) / 100;
                    return {
                        farmer_id: member.farmer_id._id,
                        farmer_name: member.farmer_id.full_name,
                        quantity: Math.round(quantity * 100) / 100,
                        percentage: percentage
                    };
                });
                setFarmerContributions(contributions);
            } else {
                // Equal distribution
                const equalPercentage = 100 / members.length;
                const equalQuantity = newListing.quantity / members.length;
                const contributions = members.map(member => ({
                    farmer_id: member.farmer_id._id,
                    farmer_name: member.farmer_id.full_name,
                    quantity: Math.round(equalQuantity * 100) / 100,
                    percentage: Math.round(equalPercentage * 100) / 100
                }));
                setFarmerContributions(contributions);
            }
        }
    }, [newListing.quantity, members]);

    // Update percentages when quantities change
    const handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedContributions = [...farmerContributions];
        updatedContributions[index].quantity = newQuantity;

        // Recalculate percentage
        if (newListing.quantity > 0) {
            updatedContributions[index].percentage = Math.round((newQuantity / newListing.quantity * 100) * 100) / 100;
        }

        setFarmerContributions(updatedContributions);
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
            change: 'Collective inventory value',
        },
        {
            title: 'Active Products',
            value: listings.filter(l => l.status === 'available').length,
            icon: TrendingUp,
            color: 'bg-purple-100 text-purple-600',
            change: 'In stock',
        },
        {
            title: 'FPO Members',
            value: members.length,
            icon: Users,
            color: 'bg-orange-100 text-orange-600',
            change: 'Contributing farmers',
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

            // Validate farmer contributions
            const totalContributed = farmerContributions.reduce((sum, fc) => sum + fc.quantity, 0);
            if (Math.abs(totalContributed - newListing.quantity) > 0.01) {
                toast({
                    title: 'Contribution Mismatch',
                    description: `Total farmer contributions (${totalContributed} ${newListing.unit}) must equal total quantity (${newListing.quantity} ${newListing.unit})`,
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
                farmer_contributions: farmerContributions, // Include farmer contributions
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
            setFarmerContributions([]);

            toast({
                title: 'Success!',
                description: 'Collective product added to marketplace with farmer contributions',
            });

            loadData();
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
            loadData();
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
                            <Users className="w-8 h-8 text-teal-600" />
                            FPO Listings
                        </h1>
                        <p className="text-muted-foreground">Manage collective product listings with farmer contributions</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleViewMarketplace}>
                            <Eye className="w-4 h-4 mr-2" />
                            View in Marketplace
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
                                    <Plus className="w-4 h-4" />
                                    Add New Listing
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Add New FPO Product Listing</DialogTitle>
                                    <DialogDescription>Fill in the details and allocate contributions from member farmers</DialogDescription>
                                </DialogHeader>

                                <Tabs defaultValue="product" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="product">Product Details</TabsTrigger>
                                        <TabsTrigger value="contributions">Farmer Contributions</TabsTrigger>
                                    </TabsList>

                                    {/* Product Details Tab */}
                                    <TabsContent value="product" className="space-y-4">
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
                                                <Label>Total Quantity * (Aggregated from all farmers)</Label>
                                                <Input
                                                    type="number"
                                                    value={newListing.quantity || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? 0 : Number(e.target.value);
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
                                                    placeholder="Enter total quantity"
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
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
                                                            {isUploading ? (
                                                                <>
                                                                    <Loader2 className="w-12 h-12 mx-auto text-teal-600 mb-4 animate-spin" />
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
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <Textarea
                                                value={newListing.description}
                                                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                                                placeholder="Describe your collective product..."
                                            />
                                        </div>
                                    </TabsContent>

                                    {/* Farmer Contributions Tab */}
                                    <TabsContent value="contributions" className="space-y-4">
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>Farmer Contribution Tracking</AlertTitle>
                                            <AlertDescription>
                                                Allocate the total quantity ({newListing.quantity} {newListing.unit}) among member farmers.
                                                Contributions are automatically calculated as percentages.
                                            </AlertDescription>
                                        </Alert>

                                        {members.length === 0 ? (
                                            <Alert>
                                                <UserCheck className="h-4 w-4" />
                                                <AlertDescription>
                                                    No FPO members found. Please add members to your FPO first.
                                                </AlertDescription>
                                            </Alert>
                                        ) : newListing.quantity === 0 ? (
                                            <Alert>
                                                <Info className="h-4 w-4" />
                                                <AlertDescription>
                                                    Please enter the total quantity in the Product Details tab first.
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <>
                                                <Card className="bg-gradient-to-r from-teal-50 to-blue-50">
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Total Quantity to Distribute</p>
                                                                <p className="text-2xl font-bold text-teal-700">{newListing.quantity} {newListing.unit}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Contributing Farmers</p>
                                                                <p className="text-2xl font-bold text-blue-700">{members.length}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Allocated</p>
                                                                <p className="text-2xl font-bold text-green-700">
                                                                    {farmerContributions.reduce((sum, fc) => sum + fc.quantity, 0).toFixed(2)} {newListing.unit}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">Farmer Contributions</CardTitle>
                                                        <CardDescription>Adjust individual farmer quantities below</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Farmer Name</TableHead>
                                                                    <TableHead>Quantity ({newListing.unit})</TableHead>
                                                                    <TableHead>Contribution %</TableHead>
                                                                    <TableHead>Visual</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {farmerContributions.map((contribution, index) => (
                                                                    <TableRow key={contribution.farmer_id}>
                                                                        <TableCell className="font-medium">
                                                                            <div className="flex items-center gap-2">
                                                                                <UserCheck className="w-4 h-4 text-teal-600" />
                                                                                {contribution.farmer_name}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Input
                                                                                type="number"
                                                                                step="0.01"
                                                                                value={contribution.quantity}
                                                                                onChange={(e) => {
                                                                                    const value = parseFloat(e.target.value) || 0;
                                                                                    if (value <= newListing.quantity && value <= 1000000) {
                                                                                        handleQuantityChange(index, value);
                                                                                    }
                                                                                }}
                                                                                onInput={(e) => {
                                                                                    const input = e.target as HTMLInputElement;
                                                                                    const value = parseFloat(input.value) || 0;
                                                                                    const maxAllowed = Math.min(newListing.quantity, 1000000);
                                                                                    if (value > maxAllowed) {
                                                                                        input.value = maxAllowed.toString();
                                                                                        handleQuantityChange(index, maxAllowed);
                                                                                    }
                                                                                }}
                                                                                className="w-32"
                                                                                min="0"
                                                                                max={Math.min(newListing.quantity, 1000000)}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                                                <Percent className="w-3 h-3" />
                                                                                {contribution.percentage.toFixed(2)}%
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                                <div
                                                                                    className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500"
                                                                                    style={{ width: `${contribution.percentage}%` }}
                                                                                />
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </CardContent>
                                                </Card>

                                                {/* Validation Alert */}
                                                {Math.abs(farmerContributions.reduce((sum, fc) => sum + fc.quantity, 0) - newListing.quantity) > 0.01 && (
                                                    <Alert variant="destructive">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <AlertTitle>Contribution Mismatch</AlertTitle>
                                                        <AlertDescription>
                                                            Total allocated ({farmerContributions.reduce((sum, fc) => sum + fc.quantity, 0).toFixed(2)} {newListing.unit})
                                                            must equal total quantity ({newListing.quantity} {newListing.unit})
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                            </>
                                        )}
                                    </TabsContent>
                                </Tabs>

                                <div className="flex gap-2 justify-end pt-4 border-t">
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddListing} className="bg-teal-600 hover:bg-teal-700">
                                        <Plus className="w-4 h-4 mr-2" />
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
                                            <p className="text-xs text-teal-600 mt-2">{stat.change}</p>
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
                        <CardTitle>All FPO Listings</CardTitle>
                        <CardDescription>Manage and track your collective product listings on the marketplace</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">
                                <Loader2 className="w-8 h-8 mx-auto animate-spin text-teal-600 mb-2" />
                                <p className="text-muted-foreground">Loading listings...</p>
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No listings yet. Add your first collective product to get started!
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

export default FPOListings;
