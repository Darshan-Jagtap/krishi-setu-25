import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    ShoppingCart,
    MapPin,
    CreditCard,
    FileText,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Truck,
    Shield,
    Zap,
    Package,
    Calendar,
    Clock,
    DollarSign,
    User,
    Phone,
    Mail,
    Building,
    Wallet,
    Sparkles,
    Lock,
    AlertCircle,
    Eye,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ordersAPI } from '@/lib/api';
import { web3Service } from '@/lib/web3/web3Service';
import type { QualityGrade } from '@/lib/web3/contractConfig';

interface OrderFlowProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: any;
    user: any;
}

const OrderFlow = ({ open, onOpenChange, product, user }: OrderFlowProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [contractId, setContractId] = useState('');

    // Step 1: Order Details
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [orderNotes, setOrderNotes] = useState('');
    const [agreedQualityGrade, setAgreedQualityGrade] = useState<QualityGrade>('A');

    // Step 2: Delivery Information
    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
    });

    // Step 3: Payment Method
    const [paymentMethod, setPaymentMethod] = useState('blockchain');
    const [walletAddress, setWalletAddress] = useState('');

    // Step 4: Order Confirmation & Tracking
    const [orderStatus, setOrderStatus] = useState<'pending' | 'confirmed' | 'processing' | 'completed'>('pending');

    const steps = [
        { id: 1, name: 'Order Details', icon: ShoppingCart },
        { id: 2, name: 'Delivery Info', icon: Truck },
        { id: 3, name: 'Payment', icon: CreditCard },
        { id: 4, name: 'Review & Confirm', icon: FileText },
        { id: 5, name: 'Order Placed', icon: CheckCircle2 },
    ];

    const calculateTotal = () => {
        if (!product) return 0;
        const subtotal = product.price * orderQuantity;
        const discount = subtotal * (product.discount / 100);
        const deliveryFee = 500;
        const gst = (subtotal - discount) * 0.18;
        return Math.round(subtotal - discount + deliveryFee + gst);
    };

    const handleNext = () => {
        // Validation for each step
        if (currentStep === 1) {
            if (orderQuantity < 1 || orderQuantity > product.quantity) {
                toast({
                    title: 'Invalid Quantity',
                    description: `Please enter quantity between 1 and ${product.quantity} ${product.unit}`,
                    variant: 'destructive',
                });
                return;
            }
        }

        if (currentStep === 2) {
            const { fullName, email, phone, address, city, state, pincode } = deliveryInfo;
            if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
                toast({
                    title: 'Incomplete Information',
                    description: 'Please fill all required delivery details',
                    variant: 'destructive',
                });
                return;
            }
        }

        if (currentStep === 3) {
            if (paymentMethod === 'blockchain' && !walletAddress) {
                toast({
                    title: 'Wallet Required',
                    description: 'Please enter your blockchain wallet address',
                    variant: 'destructive',
                });
                return;
            }
        }

        if (currentStep === 4) {
            handlePlaceOrder();
            return;
        }

        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setOrderStatus('pending');

        try {
            // Simulate order processing
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOrderStatus('confirmed');

            // Generate IDs
            const newOrderId = `ORD${Date.now().toString().slice(-8)}`;
            const newContractId = `SC${Date.now().toString().slice(-8)}`;
            const blockchainHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            const trackingId = `TRK${Date.now().toString().slice(-8)}`;

            setOrderId(newOrderId);
            setContractId(newContractId);

            // Simulate blockchain contract creation
            await new Promise(resolve => setTimeout(resolve, 1500));
            setOrderStatus('processing');

            // Create smart contract record
            const smartContract = {
                id: newContractId,
                orderId: newOrderId,
                buyer: user?.email || 'buyer@example.com',
                seller: product.supplier,
                product: product.name,
                quantity: orderQuantity,
                totalPrice: calculateTotal(),
                blockchainHash: blockchainHash,
                status: 'active',
                createdAt: new Date().toISOString(),
                deliveryInfo: deliveryInfo,
                paymentMethod: paymentMethod,
                terms: {
                    escrow: true,
                    iotVerification: product.iotVerified,
                    autoSettle: true,
                    deliveryTime: product.deliveryTime,
                },
            };

            console.log('Smart Contract Created:', smartContract);

            // Save order to database
            const orderData = await ordersAPI.createOrder({
                order_id: newOrderId,
                product_id: product.id || null,
                seller_id: product.supplierId || user?.id,
                quantity: orderQuantity,
                total_price: calculateTotal(),
                status: 'processing',
                delivery_info: deliveryInfo,
                payment_method: paymentMethod,
                order_notes: orderNotes,
                smart_contract_id: newContractId,
                blockchain_hash: blockchainHash,
                tracking_id: trackingId,
                product_name: product.name,
                supplier_name: product.supplier,
                delivery_time: product.deliveryTime,
            });

            console.log('Order saved to database:', orderData);

            // Simulate final confirmation
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOrderStatus('completed');

            toast({
                title: '🎉 Order Successful!',
                description: `Your order has been placed successfully. Order ID: ${newOrderId}`,
            });

            setCurrentStep(5);
        } catch (error: any) {
            toast({
                title: 'Order Failed',
                description: error.message || 'Failed to place order',
                variant: 'destructive',
            });
            setOrderStatus('pending');
        } finally {
            setIsProcessing(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-fade-in">
                        {/* Product Summary */}
                        <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border border-primary/20">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                                    <Package className="w-10 h-10 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary">{product.type}</Badge>
                                        {product.iotVerified && (
                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                <Zap className="w-3 h-3 mr-1" />
                                                IoT Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Price:</span>
                                            <span className="ml-2 font-semibold text-primary">₹{product.price}/{product.unit}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Available:</span>
                                            <span className="ml-2 font-semibold">{product.quantity} {product.unit}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Supplier:</span>
                                            <span className="ml-2 font-semibold">{product.supplier}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Delivery:</span>
                                            <span className="ml-2 font-semibold">{product.deliveryTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selection */}
                        <div className="space-y-3">
                            <Label htmlFor="quantity" className="text-base font-semibold">
                                Order Quantity ({product.unit})
                            </Label>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 50))}
                                    className="h-12 w-12"
                                >
                                    -
                                </Button>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min={1}
                                    max={Math.min(product.quantity, 999999)}
                                    value={orderQuantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 0;
                                        const maxAllowed = Math.min(product.quantity, 999999);
                                        if (value <= maxAllowed) {
                                            setOrderQuantity(value);
                                        }
                                    }}
                                    onInput={(e) => {
                                        const input = e.target as HTMLInputElement;
                                        const value = parseInt(input.value) || 0;
                                        const maxAllowed = Math.min(product.quantity, 999999);
                                        if (value > maxAllowed) {
                                            input.value = maxAllowed.toString();
                                            setOrderQuantity(maxAllowed);
                                        }
                                    }}
                                    className="text-center text-xl font-bold h-12"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setOrderQuantity(Math.min(product.quantity, orderQuantity + 50))}
                                    className="h-12 w-12"
                                >
                                    +
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Max: {product.quantity} {product.unit}
                            </p>
                        </div>

                        {/* Quality Grade Selection */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">
                                Expected Quality Grade <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup value={agreedQualityGrade} onValueChange={(value) => setAgreedQualityGrade(value as QualityGrade)}>
                                <div className="grid grid-cols-3 gap-3">
                                    <div
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${agreedQualityGrade === 'A'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                            : 'border-border hover:border-green-300'
                                            }`}
                                        onClick={() => setAgreedQualityGrade('A')}
                                    >
                                        <RadioGroupItem value="A" id="grade-a" className="sr-only" />
                                        <Label htmlFor="grade-a" className="cursor-pointer">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600 mb-1">A</div>
                                                <div className="text-xs font-semibold">Premium</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Highest quality
                                                </div>
                                            </div>
                                        </Label>
                                    </div>

                                    <div
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${agreedQualityGrade === 'B'
                                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                                            : 'border-border hover:border-yellow-300'
                                            }`}
                                        onClick={() => setAgreedQualityGrade('B')}
                                    >
                                        <RadioGroupItem value="B" id="grade-b" className="sr-only" />
                                        <Label htmlFor="grade-b" className="cursor-pointer">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-yellow-600 mb-1">B</div>
                                                <div className="text-xs font-semibold">Standard</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Good quality
                                                </div>
                                            </div>
                                        </Label>
                                    </div>

                                    <div
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${agreedQualityGrade === 'C'
                                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                                            : 'border-border hover:border-orange-300'
                                            }`}
                                        onClick={() => setAgreedQualityGrade('C')}
                                    >
                                        <RadioGroupItem value="C" id="grade-c" className="sr-only" />
                                        <Label htmlFor="grade-c" className="cursor-pointer">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-orange-600 mb-1">C</div>
                                                <div className="text-xs font-semibold">Basic</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Acceptable quality
                                                </div>
                                            </div>
                                        </Label>
                                    </div>
                                </div>
                            </RadioGroup>
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    <Shield className="w-3 h-3 inline mr-1" />
                                    Quality will be verified by IoT sensors at delivery. Payment will be adjusted automatically if quality differs.
                                </p>
                            </div>
                        </div>

                        {/* Order Notes */}
                        <div className="space-y-3">
                            <Label htmlFor="notes" className="text-base font-semibold">
                                Special Instructions (Optional)
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Any special requirements or instructions for this order..."
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        {/* Price Breakdown */}
                        <div className="p-4 bg-accent/50 rounded-lg space-y-2">
                            <h4 className="font-semibold mb-3">Price Summary</h4>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="font-semibold">₹{(product.price * orderQuantity).toLocaleString()}</span>
                            </div>
                            {product.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount ({product.discount}%):</span>
                                    <span className="font-semibold">-₹{Math.round(product.price * orderQuantity * product.discount / 100).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery Fee:</span>
                                <span className="font-semibold">₹500</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">GST (18%):</span>
                                <span className="font-semibold">₹{Math.round((product.price * orderQuantity * (1 - product.discount / 100)) * 0.18).toLocaleString()}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Total Amount:</span>
                                <span className="text-2xl font-bold text-primary">₹{calculateTotal().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-2 text-primary mb-4">
                            <MapPin className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">Delivery Information</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">
                                    Full Name <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="fullName"
                                        value={deliveryInfo.fullName}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                                        className="pl-10"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Phone Number <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={deliveryInfo.phone}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                                        className="pl-10"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="email">
                                    Email Address <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={deliveryInfo.email}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, email: e.target.value })}
                                        className="pl-10"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="address">
                                    Complete Address <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="address"
                                    value={deliveryInfo.address}
                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                                    placeholder="House/Flat No., Street, Area"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">
                                    City <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="city"
                                    value={deliveryInfo.city}
                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                                    placeholder="City"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">
                                    State <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="state"
                                    value={deliveryInfo.state}
                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
                                    placeholder="State"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pincode">
                                    Pincode <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="pincode"
                                    value={deliveryInfo.pincode}
                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, pincode: e.target.value })}
                                    placeholder="XXXXXX"
                                    maxLength={6}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="landmark">Landmark (Optional)</Label>
                                <Input
                                    id="landmark"
                                    value={deliveryInfo.landmark}
                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, landmark: e.target.value })}
                                    placeholder="Nearby landmark"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Estimated Delivery</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Your order will be delivered within <strong>{product.deliveryTime}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-2 text-primary mb-4">
                            <CreditCard className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">Payment Method</h3>
                        </div>

                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            <div className="space-y-3">
                                {/* Blockchain Payment */}
                                <div
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'blockchain'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                    onClick={() => setPaymentMethod('blockchain')}
                                >
                                    <div className="flex items-start gap-3">
                                        <RadioGroupItem value="blockchain" id="blockchain" className="mt-1" />
                                        <div className="flex-1">
                                            <Label htmlFor="blockchain" className="cursor-pointer flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-primary" />
                                                <span className="font-semibold">Blockchain Payment (Recommended)</span>
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    Secure
                                                </Badge>
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1 ml-7">
                                                Pay securely using blockchain with automatic smart contract creation and escrow protection
                                            </p>
                                            {paymentMethod === 'blockchain' && (
                                                <div className="mt-3 ml-7 space-y-2">
                                                    <Label htmlFor="wallet">Wallet Address</Label>
                                                    <div className="relative">
                                                        <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            id="wallet"
                                                            value={walletAddress}
                                                            onChange={(e) => setWalletAddress(e.target.value)}
                                                            placeholder="0x..."
                                                            className="pl-10 font-mono text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-green-600">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>Escrow protection enabled</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-green-600">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>Smart contract auto-settlement</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* UPI Payment */}
                                <div
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'upi'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                    onClick={() => setPaymentMethod('upi')}
                                >
                                    <div className="flex items-start gap-3">
                                        <RadioGroupItem value="upi" id="upi" className="mt-1" />
                                        <div className="flex-1">
                                            <Label htmlFor="upi" className="cursor-pointer flex items-center gap-2">
                                                <DollarSign className="w-5 h-5 text-primary" />
                                                <span className="font-semibold">UPI Payment</span>
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Pay using UPI apps like Google Pay, PhonePe, Paytm
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Transfer */}
                                <div
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'bank'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                    onClick={() => setPaymentMethod('bank')}
                                >
                                    <div className="flex items-start gap-3">
                                        <RadioGroupItem value="bank" id="bank" className="mt-1" />
                                        <div className="flex-1">
                                            <Label htmlFor="bank" className="cursor-pointer flex items-center gap-2">
                                                <Building className="w-5 h-5 text-primary" />
                                                <span className="font-semibold">Bank Transfer</span>
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Direct bank transfer or NEFT/RTGS
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cash on Delivery */}
                                <div
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'cod'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <div className="flex items-start gap-3">
                                        <RadioGroupItem value="cod" id="cod" className="mt-1" />
                                        <div className="flex-1">
                                            <Label htmlFor="cod" className="cursor-pointer flex items-center gap-2">
                                                <Truck className="w-5 h-5 text-primary" />
                                                <span className="font-semibold">Cash on Delivery</span>
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Pay when you receive the order
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>

                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-start gap-3">
                                <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">Secure Payment</h4>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        All transactions are encrypted and secured. Your payment information is never stored.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-2 text-primary mb-4">
                            <FileText className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">Review Your Order</h3>
                        </div>

                        {/* Product Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Product:</span>
                                    <span className="font-semibold">{product.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quantity:</span>
                                    <span className="font-semibold">{orderQuantity} {product.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Supplier:</span>
                                    <span className="font-semibold">{product.supplier}</span>
                                </div>
                                {orderNotes && (
                                    <div className="pt-2 border-t">
                                        <span className="text-muted-foreground text-sm">Special Instructions:</span>
                                        <p className="text-sm mt-1">{orderNotes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Delivery Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Delivery Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="font-semibold">{deliveryInfo.fullName}</p>
                                <p className="text-sm text-muted-foreground">{deliveryInfo.address}</p>
                                <p className="text-sm text-muted-foreground">
                                    {deliveryInfo.city}, {deliveryInfo.state} - {deliveryInfo.pincode}
                                </p>
                                {deliveryInfo.landmark && (
                                    <p className="text-sm text-muted-foreground">Landmark: {deliveryInfo.landmark}</p>
                                )}
                                <div className="pt-2 border-t space-y-1">
                                    <p className="text-sm">
                                        <Phone className="w-3 h-3 inline mr-1" />
                                        {deliveryInfo.phone}
                                    </p>
                                    <p className="text-sm">
                                        <Mail className="w-3 h-3 inline mr-1" />
                                        {deliveryInfo.email}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    {paymentMethod === 'blockchain' && (
                                        <>
                                            <Shield className="w-5 h-5 text-primary" />
                                            <span className="font-semibold">Blockchain Payment</span>
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                Secure
                                            </Badge>
                                        </>
                                    )}
                                    {paymentMethod === 'upi' && (
                                        <>
                                            <DollarSign className="w-5 h-5 text-primary" />
                                            <span className="font-semibold">UPI Payment</span>
                                        </>
                                    )}
                                    {paymentMethod === 'bank' && (
                                        <>
                                            <Building className="w-5 h-5 text-primary" />
                                            <span className="font-semibold">Bank Transfer</span>
                                        </>
                                    )}
                                    {paymentMethod === 'cod' && (
                                        <>
                                            <Truck className="w-5 h-5 text-primary" />
                                            <span className="font-semibold">Cash on Delivery</span>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Price Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span>₹{(product.price * orderQuantity).toLocaleString()}</span>
                                </div>
                                {product.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount ({product.discount}%):</span>
                                        <span>-₹{Math.round(product.price * orderQuantity * product.discount / 100).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee:</span>
                                    <span>₹500</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">GST (18%):</span>
                                    <span>₹{Math.round((product.price * orderQuantity * (1 - product.discount / 100)) * 0.18).toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-semibold text-lg">Total Amount:</span>
                                    <span className="text-2xl font-bold text-primary">₹{calculateTotal().toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Order Confirmation</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        By placing this order, you agree to our terms and conditions. A smart contract will be created on the blockchain for secure transaction processing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6 animate-fade-in text-center">
                        {/* Success Animation */}
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
                                <CheckCircle2 className="w-16 h-16 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h2>
                            <p className="text-muted-foreground">Your order has been confirmed and is being processed</p>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-5 h-5 text-primary" />
                                        <span className="text-sm text-muted-foreground">Order ID</span>
                                    </div>
                                    <p className="text-xl font-bold font-mono">{orderId}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <span className="text-sm text-muted-foreground">Smart Contract</span>
                                    </div>
                                    <p className="text-xl font-bold font-mono">{contractId}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Status Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Order Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">Order Confirmed</p>
                                            <p className="text-sm text-muted-foreground">Your order has been received</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Completed
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">Smart Contract Created</p>
                                            <p className="text-sm text-muted-foreground">Blockchain verification complete</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Completed
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center animate-pulse">
                                            <Package className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">Processing Order</p>
                                            <p className="text-sm text-muted-foreground">Preparing your shipment</p>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            In Progress
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-3 opacity-50">
                                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">Out for Delivery</p>
                                            <p className="text-sm text-muted-foreground">Expected in {product.deliveryTime}</p>
                                        </div>
                                        <Badge variant="outline">Pending</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Smart Contract Features */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-green-900 dark:text-green-100">Escrow Protected</p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <Zap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">IoT Verified</p>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                <Lock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-purple-900 dark:text-purple-100">Auto Settlement</p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    onOpenChange(false);
                                    setTimeout(() => {
                                        setCurrentStep(1);
                                        setOrderId('');
                                        setContractId('');
                                    }, 300);
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                className="gap-2"
                                onClick={() => {
                                    onOpenChange(false);
                                    navigate('/buyer-orders');
                                    setTimeout(() => {
                                        setCurrentStep(1);
                                        setOrderId('');
                                        setContractId('');
                                    }, 300);
                                }}
                            >
                                <Eye className="w-4 h-4" />
                                View My Orders
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <ShoppingCart className="w-6 h-6 text-primary" />
                        {currentStep === 5 ? 'Order Confirmation' : 'Place Order'}
                    </DialogTitle>
                    <DialogDescription>
                        {currentStep === 5
                            ? 'Your order has been successfully placed'
                            : 'Complete the steps below to place your order'}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Steps */}
                {currentStep < 5 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            {steps.slice(0, 4).map((step, index) => (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentStep >= step.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {currentStep > step.id ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <step.icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span className="text-xs mt-2 text-center font-medium">{step.name}</span>
                                    </div>
                                    {index < 3 && (
                                        <div
                                            className={`h-1 flex-1 mx-2 transition-all ${currentStep > step.id ? 'bg-primary' : 'bg-muted'
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <Progress value={(currentStep / 4) * 100} className="h-2" />
                    </div>
                )}

                {/* Step Content */}
                <div className="min-h-[400px]">{renderStepContent()}</div>

                {/* Navigation Buttons */}
                {currentStep < 5 && (
                    <div className="flex justify-between pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1 || isProcessing}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={isProcessing}
                            className="gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : currentStep === 4 ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Place Order
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default OrderFlow;
