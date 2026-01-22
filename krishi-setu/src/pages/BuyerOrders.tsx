import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Package,
    Truck,
    Clock,
    CheckCircle2,
    FileText,
    MessageSquare,
    Eye,
    Download,
    Filter,
    Search,
    MapPin,
    Phone,
    Mail,
    User,
    Shield,
    Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { ordersAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OrderContractDetails } from '@/components/OrderContractDetails';
import { ContractSearch } from '@/components/ContractSearch';

const BuyerOrders = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Dialog states
    const [agreementDialogOpen, setAgreementDialogOpen] = useState(false);
    const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await ordersAPI.getUserOrders();
            setOrders(response.orders || []);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            toast({
                title: 'Error',
                description: 'Failed to load orders',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-950/30';
            case 'in-transit':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30';
            case 'processing':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30';
            case 'pending':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-950/30';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const openAgreementDialog = (order: any) => {
        setSelectedOrder(order);
        setAgreementDialogOpen(true);
    };

    const openTrackingDialog = (order: any) => {
        setSelectedOrder(order);
        setTrackingDialogOpen(true);
    };

    const openContactDialog = (order: any) => {
        setSelectedOrder(order);
        setMessage('');
        setContactDialogOpen(true);
    };

    const handleSendMessage = () => {
        if (!message.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a message',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: 'Message Sent!',
            description: `Your message has been sent to ${selectedOrder?.supplier_name}`,
        });
        setContactDialogOpen(false);
        setMessage('');
    };

    const filteredOrders = orders.filter(order =>
        order.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            My Orders
                        </h1>
                        <p className="text-muted-foreground">Track and manage your purchases</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Smart Contract Search */}
                <ContractSearch />

                {/* Search */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <Card className="border-0 shadow-xl">
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'Try adjusting your search' : 'You haven\'t placed any orders yet'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order, idx) => (
                            <Card key={idx} className="border-0 shadow-xl hover:shadow-2xl transition-all">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-lg">{order.product_name || 'Product'}</h4>
                                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">Order ID: {order.id}</p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {order.quantity} kg
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Truck className="w-4 h-4" />
                                                    {order.supplier_name || 'Supplier'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                ₹{order.total_price?.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Total Amount</p>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-semibold">{order.progress || 30}%</span>
                                        </div>
                                        <Progress value={order.progress || 30} className="h-2" />
                                    </div>

                                    {/* Blockchain Info */}
                                    {order.smart_contract_id && (
                                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="text-muted-foreground">Smart Contract: </span>
                                                    <span className="font-mono font-semibold">{order.smart_contract_id}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Tracking: </span>
                                                    <span className="font-mono font-semibold">{order.tracking_id || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() => openAgreementDialog(order)}
                                        >
                                            <FileText className="w-3 h-3" />
                                            View Agreement
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() => openTrackingDialog(order)}
                                        >
                                            <Truck className="w-3 h-3" />
                                            Track Shipment
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() => openContactDialog(order)}
                                        >
                                            <MessageSquare className="w-3 h-3" />
                                            Contact Seller
                                        </Button>
                                        {order.status === 'processing' && (
                                            <Button size="sm" className="ml-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Sign Agreement
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* View Agreement Dialog */}
            <Dialog open={agreementDialogOpen} onOpenChange={setAgreementDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Smart Contract Agreement
                        </DialogTitle>
                        <DialogDescription>
                            Blockchain-verified purchase agreement
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Agreement Header */}
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-lg">Agreement Details</h3>
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Blockchain Verified
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Contract ID:</span>
                                        <p className="font-mono font-semibold">{selectedOrder.smart_contract_id}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Order ID:</span>
                                        <p className="font-mono font-semibold">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Date:</span>
                                        <p className="font-semibold">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Status:</span>
                                        <p className="font-semibold capitalize">{selectedOrder.status}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Parties */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Buyer</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Name:</span>
                                            <p className="font-semibold">{selectedOrder.delivery_info?.fullName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Email:</span>
                                            <p className="font-semibold">{selectedOrder.delivery_info?.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Phone:</span>
                                            <p className="font-semibold">{selectedOrder.delivery_info?.phone || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Seller</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Company:</span>
                                            <p className="font-semibold">{selectedOrder.supplier_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Product:</span>
                                            <p className="font-semibold">{selectedOrder.product_name}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Order Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Product:</span>
                                        <span className="font-semibold">{selectedOrder.product_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Quantity:</span>
                                        <span className="font-semibold">{selectedOrder.quantity} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Amount:</span>
                                        <span className="font-semibold text-primary">₹{selectedOrder.total_price?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Payment Method:</span>
                                        <span className="font-semibold capitalize">{selectedOrder.payment_method || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Time:</span>
                                        <span className="font-semibold">{selectedOrder.delivery_time || 'N/A'}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Smart Contract Details */}
                            <OrderContractDetails
                                orderId={selectedOrder.order_id || selectedOrder.id}
                                onRefresh={fetchOrders}
                            />

                            {/* Blockchain Hash */}
                            {selectedOrder.blockchain_hash && (
                                <div className="p-3 bg-accent/50 rounded-lg">
                                    <span className="text-xs text-muted-foreground">Blockchain Hash:</span>
                                    <p className="font-mono text-xs break-all mt-1">{selectedOrder.blockchain_hash}</p>
                                </div>
                            )}

                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setAgreementDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Track Shipment Dialog */}
            <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            Track Shipment
                        </DialogTitle>
                        <DialogDescription>
                            Real-time tracking information
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Tracking Header */}
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tracking ID</p>
                                        <p className="font-mono font-semibold text-lg">{selectedOrder.tracking_id || 'N/A'}</p>
                                    </div>
                                    <Badge className={getStatusColor(selectedOrder.status)}>
                                        {selectedOrder.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            {selectedOrder.delivery_info && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Delivery Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm">
                                        <p className="font-semibold">{selectedOrder.delivery_info.fullName}</p>
                                        <p className="text-muted-foreground mt-1">{selectedOrder.delivery_info.address}</p>
                                        <p className="text-muted-foreground">
                                            {selectedOrder.delivery_info.city}, {selectedOrder.delivery_info.state} - {selectedOrder.delivery_info.pincode}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tracking Timeline */}
                            <div className="space-y-4">
                                <h4 className="font-semibold">Shipment Timeline</h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">Order Confirmed</p>
                                            <p className="text-sm text-muted-foreground">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {selectedOrder.status !== 'pending' && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                <Package className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">Processing</p>
                                                <p className="text-sm text-muted-foreground">Order is being prepared</p>
                                            </div>
                                        </div>
                                    )}

                                    {(selectedOrder.status === 'in-transit' || selectedOrder.status === 'delivered') && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                <Truck className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">In Transit</p>
                                                <p className="text-sm text-muted-foreground">Out for delivery</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedOrder.status === 'delivered' && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">Delivered</p>
                                                <p className="text-sm text-muted-foreground">Package delivered successfully</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={() => setTrackingDialogOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Contact Seller Dialog */}
            <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Contact Seller
                        </DialogTitle>
                        <DialogDescription>
                            Send a message to {selectedOrder?.supplier_name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="p-4 bg-accent/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Order ID</p>
                                <p className="font-mono font-semibold">{selectedOrder.id}</p>
                                <p className="text-sm text-muted-foreground mt-2">Product</p>
                                <p className="font-semibold">{selectedOrder.product_name}</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Your Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSendMessage} className="gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Send Message
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default BuyerOrders;
