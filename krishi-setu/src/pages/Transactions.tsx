import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle2,
    Clock,
    XCircle,
    TrendingUp,
    DollarSign,
    Package,
    Shield,
    Calendar,
    FileText,
    Share2,
    AlertCircle,
    Zap,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const sampleTransactions = [
    {
        id: 'TXN001',
        type: 'sale',
        product: 'Soybean Meal',
        quantity: 500,
        unit: 'kg',
        amount: 22500,
        buyer: 'Agro Foods Ltd',
        seller: 'Green Valley Processors',
        status: 'completed',
        date: '2025-01-20',
        blockchainHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
        verified: true,
        paymentMethod: 'Bank Transfer',
        deliveryStatus: 'delivered'
    },
    {
        id: 'TXN002',
        type: 'purchase',
        product: 'Groundnut Husk',
        quantity: 1000,
        unit: 'kg',
        amount: 15000,
        buyer: 'Bio Energy Corp',
        seller: 'Agro Waste Solutions',
        status: 'pending',
        date: '2025-01-22',
        blockchainHash: '0x8a0fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91386',
        verified: true,
        paymentMethod: 'UPI',
        deliveryStatus: 'in-transit'
    },
    {
        id: 'TXN003',
        type: 'sale',
        product: 'Sunflower Meal',
        quantity: 750,
        unit: 'kg',
        amount: 28500,
        buyer: 'Dairy Farms Inc',
        seller: 'Sunshine Agro',
        status: 'completed',
        date: '2025-01-18',
        blockchainHash: '0x9b1fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91387',
        verified: true,
        paymentMethod: 'Crypto',
        deliveryStatus: 'delivered'
    },
    {
        id: 'TXN004',
        type: 'purchase',
        product: 'Mustard Oil Cake',
        quantity: 300,
        unit: 'kg',
        amount: 8400,
        buyer: 'Organic Fertilizers',
        seller: 'Harvest Oil Mills',
        status: 'failed',
        date: '2025-01-21',
        blockchainHash: null,
        verified: false,
        paymentMethod: 'Bank Transfer',
        deliveryStatus: 'cancelled'
    }
];

const monthlyData = [
    { month: 'Jan', sales: 45000, purchases: 32000 },
    { month: 'Feb', sales: 52000, purchases: 38000 },
    { month: 'Mar', sales: 48000, purchases: 35000 },
    { month: 'Apr', sales: 61000, purchases: 42000 },
    { month: 'May', sales: 55000, purchases: 40000 },
    { month: 'Jun', sales: 67000, purchases: 48000 }
];

const statusData = [
    { name: 'Completed', value: 65, color: '#10b981' },
    { name: 'Pending', value: 25, color: '#f59e0b' },
    { name: 'Failed', value: 10, color: '#ef4444' }
];

const Transactions = () => {
    const { toast } = useToast();
    const [transactions, setTransactions] = useState(sampleTransactions);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.buyer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
        const matchesType = typeFilter === 'all' || tx.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className='w-4 h-4' />;
            case 'pending': return <Clock className='w-4 h-4' />;
            case 'failed': return <XCircle className='w-4 h-4' />;
            default: return <AlertCircle className='w-4 h-4' />;
        }
    };

    const viewDetails = (tx: any) => {
        setSelectedTransaction(tx);
        setDetailsDialogOpen(true);
    };

    const exportTransactions = () => {
        toast({
            title: 'Export Started',
            description: 'Your transaction report is being generated...'
        });
    };

    const totalSales = transactions.filter(t => t.type === 'sale' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    const totalPurchases = transactions.filter(t => t.type === 'purchase' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    const verifiedCount = transactions.filter(t => t.verified).length;

    return (
        <DashboardLayout>
            <TooltipProvider>
                <div className='space-y-8 animate-fade-in'>
                    {/* Header */}
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-4xl font-bold text-foreground mb-2 animate-slide-in-left'>
                                Transactions
                            </h1>
                            <p className='text-muted-foreground text-lg animate-slide-in-left' style={{ animationDelay: '100ms' }}>
                                Track all your blockchain-verified transactions
                            </p>
                        </div>
                        <Button className='gap-2 animate-slide-in-right' onClick={exportTransactions}>
                            <Download className='w-4 h-4' />
                            Export Report
                        </Button>
                    </div>

                    {/* Metrics */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {[
                            { icon: TrendingUp, label: 'Total Sales', value: `₹${(totalSales / 1000).toFixed(1)}K`, change: '+12.5%', color: 'text-green-600', delay: 0 },
                            { icon: DollarSign, label: 'Total Purchases', value: `₹${(totalPurchases / 1000).toFixed(1)}K`, change: '+8.3%', color: 'text-blue-600', delay: 100 },
                            { icon: Clock, label: 'Pending', value: pendingCount, change: '2 new', color: 'text-yellow-600', delay: 200 },
                            { icon: Shield, label: 'Verified', value: `${verifiedCount}/${transactions.length}`, change: 'Blockchain', color: 'text-primary', delay: 300 }
                        ].map((metric, i) => (
                            <Card
                                key={i}
                                className='border-border hover-scale animate-slide-in-up overflow-hidden group cursor-pointer'
                                style={{ animationDelay: `${metric.delay}ms` }}
                            >
                                <CardContent className='pt-6 relative'>
                                    <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500' />
                                    <div className='flex items-center justify-between relative z-10'>
                                        <div>
                                            <p className='text-sm text-muted-foreground'>{metric.label}</p>
                                            <p className='text-3xl font-bold text-foreground mt-1'>{metric.value}</p>
                                            <p className={`text-xs ${metric.color} mt-1 font-medium`}>{metric.change}</p>
                                        </div>
                                        <metric.icon className={`w-10 h-10 ${metric.color} opacity-50 group-hover:scale-110 transition-transform`} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        <Card className='border-border lg:col-span-2 animate-slide-in-up' style={{ animationDelay: '400ms' }}>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <BarChart className='w-5 h-5' />
                                    Transaction Volume
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={300}>
                                    <BarChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
                                        <XAxis dataKey='month' stroke='hsl(var(--muted-foreground))' />
                                        <YAxis stroke='hsl(var(--muted-foreground))' />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey='sales' fill='#10b981' name='Sales' />
                                        <Bar dataKey='purchases' fill='#3b82f6' name='Purchases' />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className='border-border animate-slide-in-up' style={{ animationDelay: '500ms' }}>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Package className='w-5 h-5' />
                                    Status Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={300}>
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx='50%'
                                            cy='50%'
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill='#8884d8'
                                            dataKey='value'
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className='border-border animate-slide-in-up' style={{ animationDelay: '600ms' }}>
                        <CardContent className='pt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                                <div className='md:col-span-2'>
                                    <div className='relative group'>
                                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
                                        <Input
                                            placeholder='Search transactions...'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className='pl-10 focus:ring-2 focus:ring-primary/20 transition-all'
                                        />
                                    </div>
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className='hover:border-primary transition-colors'>
                                        <Filter className='w-4 h-4 mr-2' />
                                        <SelectValue placeholder='Status' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Status</SelectItem>
                                        <SelectItem value='completed'>Completed</SelectItem>
                                        <SelectItem value='pending'>Pending</SelectItem>
                                        <SelectItem value='failed'>Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className='hover:border-primary transition-colors'>
                                        <Filter className='w-4 h-4 mr-2' />
                                        <SelectValue placeholder='Type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Types</SelectItem>
                                        <SelectItem value='sale'>Sales</SelectItem>
                                        <SelectItem value='purchase'>Purchases</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction List */}
                    <div className='space-y-4'>
                        {filteredTransactions.map((tx, index) => (
                            <Card
                                key={tx.id}
                                className='border-border hover:border-primary hover:shadow-lg transition-all duration-300 hover-scale animate-scale-in group'
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <CardContent className='pt-6'>
                                    <div className='flex items-start justify-between'>
                                        <div className='flex-1 space-y-3'>
                                            <div className='flex items-center gap-3'>
                                                <div className={`p-2 rounded-lg ${tx.type === 'sale' ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
                                                    {tx.type === 'sale' ? (
                                                        <ArrowUpRight className='w-5 h-5 text-green-600' />
                                                    ) : (
                                                        <ArrowDownRight className='w-5 h-5 text-blue-600' />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className='font-semibold text-lg text-foreground group-hover:text-primary transition-colors'>
                                                        {tx.product}
                                                    </h3>
                                                    <p className='text-sm text-muted-foreground'>ID: {tx.id}</p>
                                                </div>
                                                <Badge className={getStatusColor(tx.status)}>
                                                    {getStatusIcon(tx.status)}
                                                    <span className='ml-1'>{tx.status}</span>
                                                </Badge>
                                                {tx.verified && (
                                                    <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse'>
                                                        <Shield className='w-3 h-3 mr-1' />
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                                                <div>
                                                    <p className='text-muted-foreground'>Amount</p>
                                                    <p className='font-semibold text-lg text-primary'>₹{tx.amount.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className='text-muted-foreground'>Quantity</p>
                                                    <p className='font-semibold'>{tx.quantity} {tx.unit}</p>
                                                </div>
                                                <div>
                                                    <p className='text-muted-foreground'>Date</p>
                                                    <p className='font-semibold flex items-center gap-1'>
                                                        <Calendar className='w-3 h-3' />
                                                        {tx.date}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className='text-muted-foreground'>Payment</p>
                                                    <p className='font-semibold'>{tx.paymentMethod}</p>
                                                </div>
                                            </div>

                                            {tx.blockchainHash && (
                                                <div className='p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800'>
                                                    <div className='flex items-start gap-2'>
                                                        <Zap className='w-4 h-4 text-green-600 mt-0.5' />
                                                        <div className='flex-1 min-w-0'>
                                                            <p className='text-xs font-semibold text-green-800 dark:text-green-200'>Blockchain Hash</p>
                                                            <p className='text-xs text-green-700 dark:text-green-300 truncate font-mono mt-1'>
                                                                {tx.blockchainHash}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant='outline'
                                                        size='icon'
                                                        onClick={() => viewDetails(tx)}
                                                        className='hover:scale-110 transition-transform'
                                                    >
                                                        <Eye className='w-4 h-4' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>View Details</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant='outline'
                                                        size='icon'
                                                        className='hover:scale-110 transition-transform'
                                                    >
                                                        <FileText className='w-4 h-4' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Download Invoice</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant='outline'
                                                        size='icon'
                                                        className='hover:scale-110 transition-transform'
                                                    >
                                                        <Share2 className='w-4 h-4' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Share</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Details Dialog */}
                    <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                        <DialogContent className='max-w-3xl animate-scale-in'>
                            <DialogHeader>
                                <DialogTitle className='flex items-center gap-2'>
                                    <FileText className='w-5 h-5' />
                                    Transaction Details
                                </DialogTitle>
                                <DialogDescription>
                                    Complete information about this transaction
                                </DialogDescription>
                            </DialogHeader>
                            {selectedTransaction && (
                                <div className='space-y-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='p-4 bg-accent/50 rounded-lg'>
                                            <h4 className='font-semibold mb-2'>Transaction Info</h4>
                                            <div className='space-y-2 text-sm'>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>ID:</span>
                                                    <span className='font-semibold'>{selectedTransaction.id}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Type:</span>
                                                    <Badge variant='secondary'>{selectedTransaction.type}</Badge>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Status:</span>
                                                    <Badge className={getStatusColor(selectedTransaction.status)}>
                                                        {selectedTransaction.status}
                                                    </Badge>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Date:</span>
                                                    <span className='font-semibold'>{selectedTransaction.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='p-4 bg-accent/50 rounded-lg'>
                                            <h4 className='font-semibold mb-2'>Product Details</h4>
                                            <div className='space-y-2 text-sm'>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Product:</span>
                                                    <span className='font-semibold'>{selectedTransaction.product}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Quantity:</span>
                                                    <span className='font-semibold'>{selectedTransaction.quantity} {selectedTransaction.unit}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Amount:</span>
                                                    <span className='font-semibold text-primary'>₹{selectedTransaction.amount.toLocaleString()}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Payment:</span>
                                                    <span className='font-semibold'>{selectedTransaction.paymentMethod}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-4 bg-accent/50 rounded-lg'>
                                        <h4 className='font-semibold mb-2'>Parties Involved</h4>
                                        <div className='grid grid-cols-2 gap-4 text-sm'>
                                            <div>
                                                <p className='text-muted-foreground mb-1'>Buyer:</p>
                                                <p className='font-semibold'>{selectedTransaction.buyer}</p>
                                            </div>
                                            <div>
                                                <p className='text-muted-foreground mb-1'>Seller:</p>
                                                <p className='font-semibold'>{selectedTransaction.seller}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedTransaction.blockchainHash && (
                                        <div className='p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800'>
                                            <h4 className='font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2'>
                                                <Shield className='w-4 h-4' />
                                                Blockchain Verification
                                            </h4>
                                            <p className='text-xs text-green-700 dark:text-green-300 font-mono break-all'>
                                                {selectedTransaction.blockchainHash}
                                            </p>
                                        </div>
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

export default Transactions;
