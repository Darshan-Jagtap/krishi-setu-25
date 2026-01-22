import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
    Receipt,
    DollarSign,
    TrendingUp,
    Calendar,
    Download,
    Filter,
    Search,
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    Loader2,
    RefreshCw,
    ArrowUpDown,
    User,
    Package,
    CreditCard,
    MapPin,
    Phone,
    Mail,
    Edit,
    Ban,
    Truck,
    Link,
    Users,
    PackageCheck,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ordersAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { OrderContractDetails } from '@/components/OrderContractDetails';
import { ContractSearch } from '@/components/ContractSearch';

const FarmerTransactions = () => {
    const { toast } = useToast();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [newProgress, setNewProgress] = useState(0);
    const [cancelReason, setCancelReason] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setIsLoading(true);
            console.log('📊 Loading transactions...');

            const response = await ordersAPI.getSellerOrders();
            const fetchedOrders = response.orders || [];

            console.log(`✅ Loaded ${fetchedOrders.length} orders`);
            setOrders(fetchedOrders);
            setIsLoading(false);
        } catch (error) {
            console.error('❌ Error loading transactions:', error);
            toast({
                title: 'Error',
                description: 'Failed to load transactions',
                variant: 'destructive'
            });
            setIsLoading(false);
        }
    };

    // Calculate stats from real data
    const totalRevenue = orders
        .filter(o => o.status === 'completed' || o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

    const stats = [
        {
            title: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-100 text-green-600',
            change: orders.length > 0 ? `${completedOrders} completed` : 'No orders yet',
        },
        {
            title: 'Total Transactions',
            value: orders.length,
            icon: Receipt,
            color: 'bg-blue-100 text-blue-600',
            change: `${orders.length} total orders`,
        },
        {
            title: 'Completed',
            value: completedOrders,
            icon: CheckCircle2,
            color: 'bg-purple-100 text-purple-600',
            change: orders.length > 0 ? `${Math.round((completedOrders / orders.length) * 100)}% success rate` : 'N/A',
        },
        {
            title: 'Pending',
            value: pendingOrders,
            icon: Clock,
            color: 'bg-orange-100 text-orange-600',
            change: pendingOrders > 0 ? 'Awaiting confirmation' : 'All clear',
        },
    ];

    // Calculate monthly data from orders
    const calculateMonthlyData = () => {
        const monthlyMap: any = {};

        orders.forEach(order => {
            const date = new Date(order.created_at);
            const month = date.toLocaleDateString('en-US', { month: 'short' });

            if (!monthlyMap[month]) {
                monthlyMap[month] = { month, revenue: 0, transactions: 0 };
            }

            monthlyMap[month].revenue += order.total_amount || 0;
            monthlyMap[month].transactions += 1;
        });

        return Object.values(monthlyMap);
    };

    const monthlyData = calculateMonthlyData();

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'pending':
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'cancelled':
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Export to CSV
    const handleExportCSV = () => {
        if (filteredOrders.length === 0) {
            toast({
                title: 'No Data',
                description: 'No transactions to export',
                variant: 'destructive'
            });
            return;
        }

        const headers = ['Order ID', 'Date', 'Buyer', 'Product', 'Quantity', 'Amount', 'Status', 'Payment Method'];
        const csvData = filteredOrders.map(order => [
            order._id,
            new Date(order.created_at).toLocaleDateString(),
            order.buyer_id?.full_name || 'Unknown',
            order.product_id?.name || 'N/A',
            `${order.quantity} ${order.product_id?.unit || 'units'}`,
            order.total_amount || 0,
            order.status,
            order.payment_method || 'Blockchain'
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
            title: 'Success',
            description: 'Transactions exported successfully'
        });
    };

    // View order details
    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setShowDetailsDialog(true);
    };

    // Update order status
    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;

        try {
            setIsUpdating(true);
            await ordersAPI.updateOrderStatus(selectedOrder._id, newStatus, newProgress);

            toast({
                title: 'Success',
                description: 'Order status updated successfully'
            });

            setShowStatusDialog(false);
            loadTransactions();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update order status',
                variant: 'destructive'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    // Cancel order
    const handleCancelOrder = async () => {
        if (!selectedOrder) return;

        try {
            setIsUpdating(true);
            await ordersAPI.cancelOrder(selectedOrder._id, cancelReason);

            toast({
                title: 'Success',
                description: 'Order cancelled successfully'
            });

            setShowCancelDialog(false);
            setCancelReason('');
            loadTransactions();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to cancel order',
                variant: 'destructive'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    // Open status update dialog
    const openStatusDialog = (order: any) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setNewProgress(order.progress || 0);
        setShowStatusDialog(true);
    };

    // Open cancel dialog
    const openCancelDialog = (order: any) => {
        setSelectedOrder(order);
        setCancelReason('');
        setShowCancelDialog(true);
    };

    // Filter and sort orders
    const filteredOrders = orders
        .filter(order => {
            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                order._id?.toLowerCase().includes(searchLower) ||
                order.buyer_id?.full_name?.toLowerCase().includes(searchLower) ||
                order.status?.toLowerCase().includes(searchLower) ||
                order.product_id?.name?.toLowerCase().includes(searchLower);

            // Status filter
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'date-asc':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'amount-desc':
                    return (b.total_amount || 0) - (a.total_amount || 0);
                case 'amount-asc':
                    return (a.total_amount || 0) - (b.total_amount || 0);
                default:
                    return 0;
            }
        });

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Receipt className="w-8 h-8 text-primary" />
                            Transactions
                        </h1>
                        <p className="text-muted-foreground">Track your sales and payments</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={loadTransactions}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button className="gap-2" onClick={handleExportCSV}>
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
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

                {/* Revenue Chart */}
                {monthlyData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Revenue Trends
                            </CardTitle>
                            <CardDescription>Monthly revenue and transaction count from your orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
                                    <Bar dataKey="transactions" fill="#10b981" name="Transactions" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Smart Contract Search */}
                <ContractSearch />

                {/* Filters and Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by order ID, buyer, product, or status..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <ArrowUpDown className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                                    <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                                    <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>
                            {isLoading ? 'Loading...' : `${filteredOrders.length} order(s)`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="ml-3 text-muted-foreground">Loading transactions...</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <Receipt className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery || statusFilter !== 'all'
                                        ? 'No transactions match your filters.'
                                        : 'You haven\'t received any orders yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-lg">Order #{order._id?.slice(-8)}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.buyer_id?.full_name || 'Unknown Buyer'} • {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge className={`${getStatusColor(order.status)} border capitalize`}>
                                                {order.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-1">Product</p>
                                                <p className="font-semibold">{order.product_id?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-1">Quantity</p>
                                                <p className="font-semibold">{order.quantity} {order.product_id?.unit || 'units'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-1">Amount</p>
                                                <p className="font-semibold text-green-600">₹{(order.total_amount || 0).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-1">Payment</p>
                                                <p className="font-semibold">{order.payment_method || 'Blockchain'}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleViewDetails(order)}>
                                                <Eye className="w-3 h-3 mr-1" />
                                                View Details
                                            </Button>
                                            {order.status === 'processing' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={async () => {
                                                        try {
                                                            setIsUpdating(true);
                                                            await ordersAPI.updateOrderStatus(order._id, 'in-transit', 70);
                                                            toast({
                                                                title: 'Product Shipped!',
                                                                description: 'Order marked as in-transit. Buyer will be notified.',
                                                            });
                                                            loadTransactions();
                                                        } catch (error: any) {
                                                            toast({
                                                                title: 'Error',
                                                                description: error.message || 'Failed to ship product',
                                                                variant: 'destructive'
                                                            });
                                                        } finally {
                                                            setIsUpdating(false);
                                                        }
                                                    }}
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? (
                                                        <>
                                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                            Shipping...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Truck className="w-3 h-3 mr-1" />
                                                            Ship Product
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                            {order.status === 'in-transit' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={async () => {
                                                        try {
                                                            setIsUpdating(true);
                                                            await ordersAPI.updateOrderStatus(order._id, 'delivered', 100);
                                                            toast({
                                                                title: 'Order Delivered!',
                                                                description: 'Order marked as delivered. Transaction complete.',
                                                            });
                                                            loadTransactions();
                                                        } catch (error: any) {
                                                            toast({
                                                                title: 'Error',
                                                                description: error.message || 'Failed to mark as delivered',
                                                                variant: 'destructive'
                                                            });
                                                        } finally {
                                                            setIsUpdating(false);
                                                        }
                                                    }}
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? (
                                                        <>
                                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                            Marking...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PackageCheck className="w-3 h-3 mr-1" />
                                                            Mark as Delivered
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                            {(order.status === 'pending' || order.status === 'processing') && (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => openStatusDialog(order)}>
                                                        <Edit className="w-3 h-3 mr-1" />
                                                        Update Status
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => openCancelDialog(order)}>
                                                        <Ban className="w-3 h-3 mr-1" />
                                                        Cancel Order
                                                    </Button>
                                                </>
                                            )}
                                            <Button size="sm" variant="outline">
                                                <Download className="w-3 h-3 mr-1" />
                                                Download Receipt
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Receipt className="w-5 h-5" />
                            Order Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information about order #{selectedOrder?._id?.slice(-8)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Order Status */}
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Order Status
                                </h3>
                                <Badge className={`${getStatusColor(selectedOrder.status)} border capitalize text-sm px-3 py-1`}>
                                    {selectedOrder.status}
                                </Badge>
                            </div>

                            <Separator />

                            {/* Buyer Information */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Buyer Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Name</p>
                                        <p className="font-medium">{selectedOrder.buyer_id?.full_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Email</p>
                                        <p className="font-medium">{selectedOrder.buyer_id?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Phone</p>
                                        <p className="font-medium">{selectedOrder.buyer_id?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Location</p>
                                        <p className="font-medium">{selectedOrder.buyer_id?.location || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Product Information */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Product Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Product Name</p>
                                        <p className="font-medium">{selectedOrder.product_id?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Category</p>
                                        <p className="font-medium capitalize">{selectedOrder.product_id?.category || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Quantity</p>
                                        <p className="font-medium">{selectedOrder.quantity} {selectedOrder.product_id?.unit || 'units'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Unit Price</p>
                                        <p className="font-medium">₹{(selectedOrder.product_id?.price || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Payment Information */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Payment Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Total Amount</p>
                                        <p className="font-bold text-green-600 text-lg">₹{(selectedOrder.total_amount || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Payment Method</p>
                                        <p className="font-medium">{selectedOrder.payment_method || 'Blockchain'}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Delivery Information */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Delivery Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Delivery Address</p>
                                        <p className="font-medium">{selectedOrder.delivery_address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Delivery Date</p>
                                        <p className="font-medium">
                                            {selectedOrder.delivery_date
                                                ? new Date(selectedOrder.delivery_date).toLocaleDateString()
                                                : 'Not scheduled'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Blockchain & Tracking */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Link className="w-4 h-4" />
                                    Blockchain & Tracking
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Smart Contract ID</p>
                                        <p className="font-mono text-xs break-all">{selectedOrder.smart_contract_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Blockchain Hash</p>
                                        <p className="font-mono text-xs break-all">{selectedOrder.blockchain_hash || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Tracking ID</p>
                                        <p className="font-medium">{selectedOrder.tracking_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Order Progress</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${selectedOrder.progress || 0}%` }}
                                                />
                                            </div>
                                            <span className="font-medium text-xs">{selectedOrder.progress || 0}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Order Timeline */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Order Timeline
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order Placed</span>
                                        <span className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                                    </div>
                                    {selectedOrder.updated_at && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Last Updated</span>
                                            <span className="font-medium">{new Date(selectedOrder.updated_at).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {selectedOrder.delivery_time && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Estimated Delivery</span>
                                            <span className="font-medium">{selectedOrder.delivery_time}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Smart Contract Details */}
                            <OrderContractDetails
                                orderId={selectedOrder._id}
                                onRefresh={loadTransactions}
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4">
                                {selectedOrder.status === 'processing' && (
                                    <Button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={async () => {
                                            try {
                                                setIsUpdating(true);
                                                await ordersAPI.updateOrderStatus(selectedOrder._id, 'in-transit', 70);
                                                toast({
                                                    title: 'Product Shipped!',
                                                    description: 'Order marked as in-transit. Buyer will be notified.',
                                                });
                                                setShowDetailsDialog(false);
                                                loadTransactions();
                                            } catch (error: any) {
                                                toast({
                                                    title: 'Error',
                                                    description: error.message || 'Failed to ship product',
                                                    variant: 'destructive'
                                                });
                                            } finally {
                                                setIsUpdating(false);
                                            }
                                        }}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Shipping...
                                            </>
                                        ) : (
                                            <>
                                                <Truck className="w-4 h-4 mr-2" />
                                                Ship Product
                                            </>
                                        )}
                                    </Button>
                                )}
                                {selectedOrder.status === 'in-transit' && (
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        onClick={async () => {
                                            try {
                                                setIsUpdating(true);
                                                await ordersAPI.updateOrderStatus(selectedOrder._id, 'delivered', 100);
                                                toast({
                                                    title: 'Order Delivered!',
                                                    description: 'Order marked as delivered. Transaction complete.',
                                                });
                                                setShowDetailsDialog(false);
                                                loadTransactions();
                                            } catch (error: any) {
                                                toast({
                                                    title: 'Error',
                                                    description: error.message || 'Failed to mark as delivered',
                                                    variant: 'destructive'
                                                });
                                            } finally {
                                                setIsUpdating(false);
                                            }
                                        }}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Marking...
                                            </>
                                        ) : (
                                            <>
                                                <PackageCheck className="w-4 h-4 mr-2" />
                                                Mark as Delivered
                                            </>
                                        )}
                                    </Button>
                                )}
                                <Button className="flex-1" variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Receipt
                                </Button>
                                <Button className="flex-1" onClick={() => setShowDetailsDialog(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="w-5 h-5" />
                            Update Order Status
                        </DialogTitle>
                        <DialogDescription>
                            Update the status and progress of order #{selectedOrder?._id?.slice(-8)}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Order Status</label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="in-transit">In Transit</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Progress: {newProgress}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={newProgress}
                                onChange={(e) => setNewProgress(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                className="flex-1"
                                variant="outline"
                                onClick={() => setShowStatusDialog(false)}
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleUpdateStatus}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Status'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Cancel Order Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Ban className="w-5 h-5" />
                            Cancel Order
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel order #{selectedOrder?._id?.slice(-8)}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Cancellation Reason (Optional)</label>
                            <Input
                                placeholder="Enter reason for cancellation..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                className="flex-1"
                                variant="outline"
                                onClick={() => setShowCancelDialog(false)}
                                disabled={isUpdating}
                            >
                                Keep Order
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                onClick={handleCancelOrder}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    'Cancel Order'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default FarmerTransactions;
