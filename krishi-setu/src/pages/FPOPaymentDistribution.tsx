import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { fpoAPI } from '@/lib/api';
import {
    DollarSign, Plus, Eye, CheckCircle2, Clock, XCircle, Users, Receipt,
    TrendingUp, AlertCircle, Info, Calculator, FileText, Download, Send,
    Percent, Minus, ArrowRight, Building, Wallet, CreditCard, Loader2, RefreshCw
} from 'lucide-react';

interface FPOMember {
    _id: string;
    farmer_id: {
        _id: string;
        full_name: string;
        email: string;
    };
    contribution_percentage?: number;
}

interface FPOTransaction {
    _id: string;
    order_id: string;
    product_name: string;
    buyer_name: string;
    total_price: number;
    quantity: number;
    status: string;
    created_at: string;
}

interface FarmerContribution {
    member_id: string;
    farmer_id: string;
    farmer_name: string;
    quantity: number;
    quality_grade: 'A' | 'B' | 'C';
    moisture_level: number;
    base_amount: number;
    quality_adjustment: number;
    final_amount: number;
    status: 'pending' | 'paid' | 'failed';
    payment_method?: string;
    transaction_ref?: string;
    paid_at?: string;
}

interface PaymentDistribution {
    _id: string;
    order_id: string;
    product_name: string;
    buyer_name: string;
    total_received: number;
    fpo_commission: number;
    fpo_commission_percent: number;
    handling_charges: number;
    total_deductions: number;
    distributable_amount: number;
    farmers: FarmerContribution[];
    distribution_status: 'pending' | 'processing' | 'completed';
    created_at: string;
    completed_at?: string;
    notes?: string;
}

const FPOPaymentDistribution = () => {
    const { toast } = useToast();
    const [distributions, setDistributions] = useState<PaymentDistribution[]>([]);
    const [members, setMembers] = useState<FPOMember[]>([]);
    const [transactions, setTransactions] = useState<FPOTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedDistribution, setSelectedDistribution] = useState<PaymentDistribution | null>(null);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState<{ distId: string, farmerIndex: number, farmerName: string } | null>(null);

    // Create Distribution Form State
    const [selectedTransactionId, setSelectedTransactionId] = useState('');
    const [commissionPercent, setCommissionPercent] = useState('2');
    const [handlingCharges, setHandlingCharges] = useState('');
    const [notes, setNotes] = useState('');

    const [farmerAllocations, setFarmerAllocations] = useState<Array<{
        member_id: string;
        farmer_id: string;
        farmer_name: string;
        quantity: string;
        quality_grade: 'A' | 'B' | 'C';
        moisture_level: string;
    }>>([]);

    const [paymentData, setPaymentData] = useState({
        payment_method: '',
        transaction_ref: ''
    });

    // Quality adjustment rates
    const qualityRates = {
        'A': 100,  // 100% of price
        'B': 90,   // -10%
        'C': 75    // -25%
    };

    const moistureLimit = 12;
    const moisturePenalty = 15; // -15% if moisture > limit

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [membersRes, transactionsRes] = await Promise.all([
                fpoAPI.getMembers(),
                fpoAPI.getTransactions()
            ]);

            setMembers(membersRes.members || []);

            // Filter delivered transactions
            const deliveredTransactions = (transactionsRes.orders || []).filter(
                (t: any) => t.status === 'delivered'
            );
            setTransactions(deliveredTransactions);

            // Load saved distributions from localStorage (for demo)
            const savedDistributions = localStorage.getItem('fpo_distributions');
            if (savedDistributions) {
                setDistributions(JSON.parse(savedDistributions));
            }
        } catch (error: any) {
            console.error('Error loading data:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to load data',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle transaction selection
    const handleTransactionSelect = (transactionId: string) => {
        const transaction = transactions.find(t => t._id === transactionId);
        if (!transaction) return;

        setSelectedTransactionId(transactionId);

        // Auto-populate farmer allocations based on members
        if (members.length > 0) {
            const totalQuantity = transaction.quantity;
            const allocations = members.map(member => {
                const percentage = member.contribution_percentage || (100 / members.length);
                const quantity = (totalQuantity * percentage / 100).toFixed(2);

                return {
                    member_id: member._id,
                    farmer_id: member.farmer_id._id,
                    farmer_name: member.farmer_id.full_name,
                    quantity: quantity,
                    quality_grade: 'A' as 'A' | 'B' | 'C',
                    moisture_level: '10'
                };
            });
            setFarmerAllocations(allocations);
        }
    };

    // Calculate farmer amounts
    const calculateFarmerAmounts = () => {
        const transaction = transactions.find(t => t._id === selectedTransactionId);
        if (!transaction) return [];

        const totalReceived = transaction.total_price;
        const commission = parseFloat(commissionPercent) || 0;
        const handling = parseFloat(handlingCharges) || 0;

        const fpoCommission = (totalReceived * commission) / 100;
        const totalDeductions = fpoCommission + handling;
        const distributableAmount = totalReceived - totalDeductions;

        const totalQuantity = farmerAllocations.reduce((sum, f) => sum + (parseFloat(f.quantity) || 0), 0);

        if (totalQuantity === 0) return [];

        const pricePerUnit = distributableAmount / totalQuantity;

        return farmerAllocations.map(farmer => {
            const quantity = parseFloat(farmer.quantity) || 0;
            const baseAmount = quantity * pricePerUnit;

            // Quality adjustment
            const qualityPercent = qualityRates[farmer.quality_grade] || 100;
            let qualityAdjustment = baseAmount * (qualityPercent / 100) - baseAmount;

            // Moisture penalty
            const moisture = parseFloat(farmer.moisture_level) || 0;
            if (moisture > moistureLimit) {
                const moistureAdjustment = baseAmount * (moisturePenalty / 100);
                qualityAdjustment -= moistureAdjustment;
            }

            const finalAmount = baseAmount + qualityAdjustment;

            return {
                ...farmer,
                baseAmount: Math.round(baseAmount * 100) / 100,
                qualityAdjustment: Math.round(qualityAdjustment * 100) / 100,
                finalAmount: Math.round(finalAmount * 100) / 100
            };
        });
    };

    // Create distribution
    const handleCreateDistribution = () => {
        const transaction = transactions.find(t => t._id === selectedTransactionId);
        if (!transaction) {
            toast({
                title: 'Missing Information',
                description: 'Please select a transaction',
                variant: 'destructive'
            });
            return;
        }

        if (farmerAllocations.length === 0) {
            toast({
                title: 'No Farmers',
                description: 'Please add farmer allocations',
                variant: 'destructive'
            });
            return;
        }

        if (farmerAllocations.some(f => !f.quantity)) {
            toast({
                title: 'Incomplete Data',
                description: 'Please fill in all farmer quantities',
                variant: 'destructive'
            });
            return;
        }

        const calculatedFarmers = calculateFarmerAmounts();
        const totalReceived = transaction.total_price;
        const commission = parseFloat(commissionPercent) || 0;
        const handling = parseFloat(handlingCharges) || 0;
        const fpoCommission = (totalReceived * commission) / 100;

        const newDistribution: PaymentDistribution = {
            _id: `DIST-${Date.now()}`,
            order_id: transaction.order_id,
            product_name: transaction.product_name,
            buyer_name: transaction.buyer_name || 'Unknown Buyer',
            total_received: totalReceived,
            fpo_commission: Math.round(fpoCommission * 100) / 100,
            fpo_commission_percent: commission,
            handling_charges: handling,
            total_deductions: Math.round((fpoCommission + handling) * 100) / 100,
            distributable_amount: Math.round((totalReceived - fpoCommission - handling) * 100) / 100,
            farmers: calculatedFarmers.map(f => ({
                member_id: f.member_id,
                farmer_id: f.farmer_id,
                farmer_name: f.farmer_name,
                quantity: parseFloat(f.quantity),
                quality_grade: f.quality_grade,
                moisture_level: parseFloat(f.moisture_level),
                base_amount: f.baseAmount,
                quality_adjustment: f.qualityAdjustment,
                final_amount: f.finalAmount,
                status: 'pending'
            })),
            distribution_status: 'pending',
            created_at: new Date().toISOString(),
            notes: notes
        };

        const updatedDistributions = [newDistribution, ...distributions];
        setDistributions(updatedDistributions);

        // Save to localStorage (for demo)
        localStorage.setItem('fpo_distributions', JSON.stringify(updatedDistributions));

        setIsCreateDialogOpen(false);
        resetForm();

        toast({
            title: 'Distribution Created',
            description: `Payment distribution for ${transaction.product_name} has been created successfully`,
        });
    };

    // Mark farmer payment as paid
    const handleMarkAsPaid = () => {
        if (!selectedFarmer || !paymentData.payment_method) {
            toast({
                title: 'Missing Information',
                description: 'Please select payment method',
                variant: 'destructive'
            });
            return;
        }

        const updatedDistributions = distributions.map(dist => {
            if (dist._id === selectedFarmer.distId) {
                const updatedFarmers = [...dist.farmers];
                updatedFarmers[selectedFarmer.farmerIndex] = {
                    ...updatedFarmers[selectedFarmer.farmerIndex],
                    status: 'paid',
                    payment_method: paymentData.payment_method,
                    transaction_ref: paymentData.transaction_ref,
                    paid_at: new Date().toISOString()
                };

                // Check if all farmers are paid
                const allPaid = updatedFarmers.every(f => f.status === 'paid');

                return {
                    ...dist,
                    farmers: updatedFarmers,
                    distribution_status: allPaid ? 'completed' : 'processing',
                    completed_at: allPaid ? new Date().toISOString() : undefined
                };
            }
            return dist;
        });

        setDistributions(updatedDistributions);
        localStorage.setItem('fpo_distributions', JSON.stringify(updatedDistributions));

        toast({
            title: 'Payment Recorded',
            description: `Payment to ${selectedFarmer.farmerName} has been marked as paid`,
        });

        setIsPaymentDialogOpen(false);
        setPaymentData({ payment_method: '', transaction_ref: '' });
        setSelectedFarmer(null);
    };

    // Reset form
    const resetForm = () => {
        setSelectedTransactionId('');
        setCommissionPercent('2');
        setHandlingCharges('');
        setNotes('');
        setFarmerAllocations([]);
    };

    // Calculate stats
    const stats = {
        totalDistributions: distributions.length,
        totalDistributed: distributions.reduce((sum, d) => sum + d.total_received, 0),
        pendingPayments: distributions.reduce((sum, d) =>
            sum + d.farmers.filter(f => f.status === 'pending').length, 0
        ),
        completedDistributions: distributions.filter(d => d.distribution_status === 'completed').length
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-300';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'paid': return 'bg-green-100 text-green-800 border-green-300';
            case 'failed': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading payment distribution data...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const selectedTransaction = transactions.find(t => t._id === selectedTransactionId);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <DollarSign className="w-8 h-8 text-primary" />
                            FPO Payment Distribution
                        </h1>
                        <p className="text-muted-foreground">Manage buyer payments and distribute to member farmers</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={loadData}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Distribution
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Create Payment Distribution</DialogTitle>
                                    <DialogDescription>
                                        Select a delivered transaction and distribute payment to farmers
                                    </DialogDescription>
                                </DialogHeader>

                                <Tabs defaultValue="transaction" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="transaction">1. Select Transaction</TabsTrigger>
                                        <TabsTrigger value="farmers">2. Farmer Allocations</TabsTrigger>
                                        <TabsTrigger value="summary">3. Summary</TabsTrigger>
                                    </TabsList>

                                    {/* Tab 1: Select Transaction */}
                                    <TabsContent value="transaction" className="space-y-4">
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>Payment Flow</AlertTitle>
                                            <AlertDescription>
                                                Buyer → FPO (Primary Payment) → FPO Deductions → Distribution to Farmers
                                            </AlertDescription>
                                        </Alert>

                                        <div>
                                            <Label>Select Delivered Transaction *</Label>
                                            {transactions.length === 0 ? (
                                                <Alert className="mt-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        No delivered transactions available. Only delivered orders can be distributed.
                                                    </AlertDescription>
                                                </Alert>
                                            ) : (
                                                <Select value={selectedTransactionId} onValueChange={handleTransactionSelect}>
                                                    <SelectTrigger className="mt-2">
                                                        <SelectValue placeholder="Select a transaction" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {transactions.map(transaction => (
                                                            <SelectItem key={transaction._id} value={transaction._id}>
                                                                {transaction.order_id} - {transaction.product_name} - ₹{transaction.total_price.toLocaleString()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>

                                        {selectedTransaction && (
                                            <Card className="bg-blue-50">
                                                <CardContent className="pt-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Order ID</Label>
                                                            <p className="font-semibold">{selectedTransaction.order_id}</p>
                                                        </div>
                                                        <div>
                                                            <Label>Product</Label>
                                                            <p className="font-semibold">{selectedTransaction.product_name}</p>
                                                        </div>
                                                        <div>
                                                            <Label>Total Quantity</Label>
                                                            <p className="font-semibold">{selectedTransaction.quantity} kg</p>
                                                        </div>
                                                        <div>
                                                            <Label>Total Amount</Label>
                                                            <p className="font-bold text-green-600 text-lg">₹{selectedTransaction.total_price.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>FPO Commission (%) *</Label>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="2"
                                                    value={commissionPercent}
                                                    onChange={(e) => setCommissionPercent(e.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">Typically 1-2%</p>
                                            </div>
                                            <div>
                                                <Label>Handling Charges (₹)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="5000"
                                                    value={handlingCharges}
                                                    onChange={(e) => setHandlingCharges(e.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">Transport, packaging, etc.</p>
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Notes</Label>
                                            <Textarea
                                                placeholder="Additional information..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={2}
                                            />
                                        </div>
                                    </TabsContent>

                                    {/* Tab 2: Farmer Allocations */}
                                    <TabsContent value="farmers" className="space-y-4">
                                        <Alert>
                                            <Calculator className="h-4 w-4" />
                                            <AlertTitle>Quality-Based Pricing</AlertTitle>
                                            <AlertDescription>
                                                A-grade: 100% | B-grade: 90% (-10%) | C-grade: 75% (-25%) | Moisture &gt; 12%: -15%
                                            </AlertDescription>
                                        </Alert>

                                        {members.length === 0 ? (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    No FPO members found. Please add members first.
                                                </AlertDescription>
                                            </Alert>
                                        ) : farmerAllocations.length === 0 ? (
                                            <Alert>
                                                <Info className="h-4 w-4" />
                                                <AlertDescription>
                                                    Please select a transaction first to see farmer allocations.
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div className="space-y-3">
                                                {farmerAllocations.map((farmer, index) => (
                                                    <Card key={index}>
                                                        <CardContent className="pt-4">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <h4 className="font-semibold">{farmer.farmer_name}</h4>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <div>
                                                                    <Label>Quantity (kg) *</Label>
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="1000"
                                                                        value={farmer.quantity}
                                                                        onChange={(e) => {
                                                                            const newAllocations = [...farmerAllocations];
                                                                            newAllocations[index].quantity = e.target.value;
                                                                            setFarmerAllocations(newAllocations);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Quality Grade</Label>
                                                                    <Select
                                                                        value={farmer.quality_grade}
                                                                        onValueChange={(value: 'A' | 'B' | 'C') => {
                                                                            const newAllocations = [...farmerAllocations];
                                                                            newAllocations[index].quality_grade = value;
                                                                            setFarmerAllocations(newAllocations);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="A">A-Grade (100%)</SelectItem>
                                                                            <SelectItem value="B">B-Grade (90%)</SelectItem>
                                                                            <SelectItem value="C">C-Grade (75%)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div>
                                                                    <Label>Moisture Level (%)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.1"
                                                                        placeholder="10"
                                                                        value={farmer.moisture_level}
                                                                        onChange={(e) => {
                                                                            const newAllocations = [...farmerAllocations];
                                                                            newAllocations[index].moisture_level = e.target.value;
                                                                            setFarmerAllocations(newAllocations);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Tab 3: Summary */}
                                    <TabsContent value="summary" className="space-y-4">
                                        {selectedTransaction && farmerAllocations.length > 0 && farmerAllocations.some(f => f.quantity) ? (
                                            <>
                                                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">Payment Breakdown</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="flex items-center gap-2">
                                                                <Building className="w-4 h-4 text-blue-600" />
                                                                Total from Buyer
                                                            </span>
                                                            <span className="font-bold text-lg">₹{selectedTransaction.total_price.toLocaleString()}</span>
                                                        </div>

                                                        <div className="border-t pt-2 space-y-2">
                                                            <div className="flex justify-between text-sm text-red-600">
                                                                <span className="flex items-center gap-2">
                                                                    <Minus className="w-3 h-3" />
                                                                    FPO Commission ({commissionPercent}%)
                                                                </span>
                                                                <span>-₹{((selectedTransaction.total_price * parseFloat(commissionPercent)) / 100).toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm text-red-600">
                                                                <span className="flex items-center gap-2">
                                                                    <Minus className="w-3 h-3" />
                                                                    Handling Charges
                                                                </span>
                                                                <span>-₹{parseFloat(handlingCharges || '0').toLocaleString()}</span>
                                                            </div>
                                                        </div>

                                                        <div className="border-t pt-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="flex items-center gap-2 font-semibold text-green-700">
                                                                    <ArrowRight className="w-4 h-4" />
                                                                    Distributable to Farmers
                                                                </span>
                                                                <span className="font-bold text-xl text-green-700">
                                                                    ₹{(selectedTransaction.total_price -
                                                                        (selectedTransaction.total_price * parseFloat(commissionPercent)) / 100 -
                                                                        parseFloat(handlingCharges || '0')).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">Farmer Payments</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Farmer</TableHead>
                                                                    <TableHead>Quantity</TableHead>
                                                                    <TableHead>Grade</TableHead>
                                                                    <TableHead>Base</TableHead>
                                                                    <TableHead>Adjustment</TableHead>
                                                                    <TableHead className="text-right">Final Amount</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {calculateFarmerAmounts().map((farmer, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell className="font-medium">{farmer.farmer_name}</TableCell>
                                                                        <TableCell>{farmer.quantity} kg</TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="outline">{farmer.quality_grade}</Badge>
                                                                        </TableCell>
                                                                        <TableCell>₹{farmer.baseAmount.toLocaleString()}</TableCell>
                                                                        <TableCell className={farmer.qualityAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                                            {farmer.qualityAdjustment >= 0 ? '+' : ''}₹{farmer.qualityAdjustment.toLocaleString()}
                                                                        </TableCell>
                                                                        <TableCell className="text-right font-bold">₹{farmer.finalAmount.toLocaleString()}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </CardContent>
                                                </Card>
                                            </>
                                        ) : (
                                            <Alert>
                                                <AlertCircle className="h-4 h-4" />
                                                <AlertDescription>
                                                    Please select a transaction and fill in farmer allocations to see the summary
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </TabsContent>
                                </Tabs>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleCreateDistribution} disabled={!selectedTransactionId || farmerAllocations.length === 0}>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Create Distribution
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-blue-700 mb-1">Total Distributions</p>
                                    <p className="text-3xl font-bold text-blue-900">{stats.totalDistributions}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-200">
                                    <Receipt className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-green-700 mb-1">Total Distributed</p>
                                    <p className="text-3xl font-bold text-green-900">₹{(stats.totalDistributed / 100000).toFixed(1)}L</p>
                                </div>
                                <div className="p-3 rounded-lg bg-green-200">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-yellow-700 mb-1">Pending Payments</p>
                                    <p className="text-3xl font-bold text-yellow-900">{stats.pendingPayments}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-yellow-200">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-purple-700 mb-1">Completed</p>
                                    <p className="text-3xl font-bold text-purple-900">{stats.completedDistributions}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-200">
                                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                FPO Members
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{members.length}</p>
                            <p className="text-sm text-muted-foreground">Registered farmers</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Receipt className="w-4 h-4" />
                                Available Transactions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{transactions.length}</p>
                            <p className="text-sm text-muted-foreground">Delivered orders ready for distribution</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Distributions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Distributions</CardTitle>
                        <CardDescription>Track and manage payments to member farmers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {distributions.length === 0 ? (
                            <div className="text-center py-12">
                                <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                                <p className="text-muted-foreground text-lg mb-2">No distributions yet</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Create your first payment distribution from delivered transactions
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {distributions.map((dist) => (
                                    <Card key={dist._id} className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{dist.product_name}</CardTitle>
                                                    <CardDescription>
                                                        Order: {dist.order_id} • Buyer: {dist.buyer_name}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getStatusColor(dist.distribution_status)}>
                                                        {dist.distribution_status}
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedDistribution(dist);
                                                            setIsViewDialogOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-4 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Total Received</p>
                                                    <p className="font-bold text-lg">₹{dist.total_received.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">FPO Deductions</p>
                                                    <p className="font-semibold text-red-600">-₹{dist.total_deductions.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">To Farmers</p>
                                                    <p className="font-bold text-lg text-green-600">₹{dist.distributable_amount.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Farmers</p>
                                                    <p className="font-semibold">{dist.farmers.length} members</p>
                                                </div>
                                            </div>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Farmer</TableHead>
                                                        <TableHead>Quantity</TableHead>
                                                        <TableHead>Grade</TableHead>
                                                        <TableHead>Amount</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {dist.farmers.map((farmer, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">{farmer.farmer_name}</TableCell>
                                                            <TableCell>{farmer.quantity} kg</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">{farmer.quality_grade}</Badge>
                                                            </TableCell>
                                                            <TableCell className="font-semibold">₹{farmer.final_amount.toLocaleString()}</TableCell>
                                                            <TableCell>
                                                                <Badge className={getStatusColor(farmer.status)}>
                                                                    {farmer.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {farmer.status === 'pending' ? (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setSelectedFarmer({
                                                                                distId: dist._id,
                                                                                farmerIndex: index,
                                                                                farmerName: farmer.farmer_name
                                                                            });
                                                                            setIsPaymentDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <Send className="w-3 h-3 mr-1" />
                                                                        Pay
                                                                    </Button>
                                                                ) : (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {farmer.payment_method}
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* View Details Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Distribution Details</DialogTitle>
                        </DialogHeader>
                        {selectedDistribution && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Order ID</Label>
                                        <p className="font-semibold">{selectedDistribution.order_id}</p>
                                    </div>
                                    <div>
                                        <Label>Product</Label>
                                        <p className="font-semibold">{selectedDistribution.product_name}</p>
                                    </div>
                                    <div>
                                        <Label>Buyer</Label>
                                        <p className="font-semibold">{selectedDistribution.buyer_name}</p>
                                    </div>
                                    <div>
                                        <Label>Created</Label>
                                        <p className="font-semibold">{new Date(selectedDistribution.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <Card className="bg-blue-50">
                                    <CardContent className="pt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Total from Buyer:</span>
                                            <span className="font-bold">₹{selectedDistribution.total_received.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-red-600">
                                            <span>FPO Commission ({selectedDistribution.fpo_commission_percent}%):</span>
                                            <span>-₹{selectedDistribution.fpo_commission.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-red-600">
                                            <span>Handling Charges:</span>
                                            <span>-₹{selectedDistribution.handling_charges.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between">
                                            <span className="font-semibold">Distributed to Farmers:</span>
                                            <span className="font-bold text-green-600">₹{selectedDistribution.distributable_amount.toLocaleString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {selectedDistribution.notes && (
                                    <div>
                                        <Label>Notes</Label>
                                        <p className="text-sm text-muted-foreground">{selectedDistribution.notes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Payment Dialog */}
                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Payment</DialogTitle>
                            <DialogDescription>
                                Mark payment as completed for {selectedFarmer?.farmerName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Payment Method *</Label>
                                <Select value={paymentData.payment_method} onValueChange={(value) => setPaymentData({ ...paymentData, payment_method: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NEFT">NEFT</SelectItem>
                                        <SelectItem value="RTGS">RTGS</SelectItem>
                                        <SelectItem value="IMPS">IMPS</SelectItem>
                                        <SelectItem value="UPI">UPI</SelectItem>
                                        <SelectItem value="Cheque">Cheque</SelectItem>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Transaction Reference</Label>
                                <Input
                                    placeholder="Transaction ID / UTR / Cheque No."
                                    value={paymentData.transaction_ref}
                                    onChange={(e) => setPaymentData({ ...paymentData, transaction_ref: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleMarkAsPaid} disabled={!paymentData.payment_method}>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark as Paid
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default FPOPaymentDistribution;
