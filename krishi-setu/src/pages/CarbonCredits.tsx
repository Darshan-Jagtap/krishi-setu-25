import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import {
    Leaf,
    TrendingUp,
    DollarSign,
    Award,
    ShoppingCart,
    Eye,
    Share2,
    Download,
    Zap,
    Globe,
    TreePine,
    Wind,
    Droplets,
    Sun,
    CheckCircle2,
    ArrowUpRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const carbonCredits = [
    {
        id: 'CC001',
        name: 'Organic Farming Credits',
        category: 'Agriculture',
        credits: 150,
        price: 25,
        totalValue: 3750,
        verified: true,
        certifier: 'Gold Standard',
        expiryDate: '2026-12-31',
        impact: {
            co2Reduced: 15000,
            treesEquivalent: 750,
            area: 50
        },
        available: true,
        rating: 4.9
    },
    {
        id: 'CC002',
        name: 'Renewable Energy Credits',
        category: 'Energy',
        credits: 200,
        price: 30,
        totalValue: 6000,
        verified: true,
        certifier: 'Verra',
        expiryDate: '2027-06-30',
        impact: {
            co2Reduced: 20000,
            treesEquivalent: 1000,
            area: 0
        },
        available: true,
        rating: 5.0
    },
    {
        id: 'CC003',
        name: 'Waste Reduction Credits',
        category: 'Waste Management',
        credits: 100,
        price: 20,
        totalValue: 2000,
        verified: true,
        certifier: 'Climate Action Reserve',
        expiryDate: '2026-09-30',
        impact: {
            co2Reduced: 10000,
            treesEquivalent: 500,
            area: 0
        },
        available: true,
        rating: 4.7
    }
];

const impactData = [
    { month: 'Jan', co2: 12000, credits: 120 },
    { month: 'Feb', co2: 15000, credits: 150 },
    { month: 'Mar', co2: 18000, credits: 180 },
    { month: 'Apr', co2: 22000, credits: 220 },
    { month: 'May', co2: 25000, credits: 250 },
    { month: 'Jun', co2: 30000, credits: 300 }
];

const sustainabilityMetrics = [
    { metric: 'Carbon Reduction', value: 85 },
    { metric: 'Renewable Energy', value: 70 },
    { metric: 'Waste Management', value: 90 },
    { metric: 'Water Conservation', value: 75 },
    { metric: 'Biodiversity', value: 80 }
];

const CarbonCredits = () => {
    const { toast } = useToast();
    const [credits, setCredits] = useState(carbonCredits);
    const [selectedCredit, setSelectedCredit] = useState<any>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

    const totalCredits = credits.reduce((sum, c) => sum + c.credits, 0);
    const totalValue = credits.reduce((sum, c) => sum + c.totalValue, 0);
    const totalCO2Reduced = credits.reduce((sum, c) => sum + c.impact.co2Reduced, 0);
    const totalTrees = credits.reduce((sum, c) => sum + c.impact.treesEquivalent, 0);

    const viewDetails = (credit: any) => {
        setSelectedCredit(credit);
        setDetailsDialogOpen(true);
    };

    const openPurchase = (credit: any) => {
        setSelectedCredit(credit);
        setPurchaseDialogOpen(true);
    };

    const handlePurchase = () => {
        toast({
            title: '🎉 Purchase Successful!',
            description: `You've purchased ${selectedCredit.credits} carbon credits`
        });
        setPurchaseDialogOpen(false);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Agriculture': return <TreePine className='w-5 h-5' />;
            case 'Energy': return <Zap className='w-5 h-5' />;
            case 'Waste Management': return <Leaf className='w-5 h-5' />;
            default: return <Globe className='w-5 h-5' />;
        }
    };

    return (
        <DashboardLayout>
            <TooltipProvider>
                <div className='space-y-8 animate-fade-in'>
                    {/* Header */}
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-4xl font-bold text-foreground mb-2 animate-slide-in-left'>
                                Carbon Credits Marketplace
                            </h1>
                            <p className='text-muted-foreground text-lg animate-slide-in-left' style={{ animationDelay: '100ms' }}>
                                Trade verified carbon credits and track your environmental impact
                            </p>
                        </div>
                        <Button className='gap-2 animate-slide-in-right'>
                            <Download className='w-4 h-4' />
                            Impact Report
                        </Button>
                    </div>

                    {/* Metrics */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {[
                            { icon: Leaf, label: 'Total Credits', value: totalCredits, suffix: ' Credits', change: '+15%', color: 'text-green-600', delay: 0 },
                            { icon: DollarSign, label: 'Portfolio Value', value: `₹${(totalValue / 1000).toFixed(1)}K`, change: '+22%', color: 'text-primary', delay: 100 },
                            { icon: Wind, label: 'CO₂ Reduced', value: `${(totalCO2Reduced / 1000).toFixed(1)}K`, suffix: ' kg', change: '+18%', color: 'text-blue-600', delay: 200 },
                            { icon: TreePine, label: 'Trees Equivalent', value: totalTrees, suffix: ' Trees', change: '+20%', color: 'text-emerald-600', delay: 300 }
                        ].map((metric, i) => (
                            <Card
                                key={i}
                                className='border-border hover-scale animate-slide-in-up overflow-hidden group cursor-pointer'
                                style={{ animationDelay: `${metric.delay}ms` }}
                            >
                                <CardContent className='pt-6 relative'>
                                    <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500' />
                                    <div className='flex items-center justify-between relative z-10'>
                                        <div>
                                            <p className='text-sm text-muted-foreground'>{metric.label}</p>
                                            <p className='text-3xl font-bold text-foreground mt-1'>
                                                {metric.value}{metric.suffix || ''}
                                            </p>
                                            <p className={`text-xs ${metric.color} mt-1 font-medium`}>{metric.change} this month</p>
                                        </div>
                                        <metric.icon className={`w-10 h-10 ${metric.color} opacity-50 group-hover:scale-110 transition-transform`} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <Card className='border-border animate-slide-in-up' style={{ animationDelay: '400ms' }}>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <TrendingUp className='w-5 h-5' />
                                    Environmental Impact Over Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={300}>
                                    <AreaChart data={impactData}>
                                        <defs>
                                            <linearGradient id='colorCo2' x1='0' y1='0' x2='0' y2='1'>
                                                <stop offset='5%' stopColor='#10b981' stopOpacity={0.8} />
                                                <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
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
                                        <Area type='monotone' dataKey='co2' stroke='#10b981' fillOpacity={1} fill='url(#colorCo2)' name='CO₂ Reduced (kg)' />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className='border-border animate-slide-in-up' style={{ animationDelay: '500ms' }}>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Award className='w-5 h-5' />
                                    Sustainability Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width='100%' height={300}>
                                    <RadarChart data={sustainabilityMetrics}>
                                        <PolarGrid stroke='hsl(var(--border))' />
                                        <PolarAngleAxis dataKey='metric' stroke='hsl(var(--foreground))' />
                                        <PolarRadiusAxis stroke='hsl(var(--muted-foreground))' />
                                        <Radar name='Score' dataKey='value' stroke='#10b981' fill='#10b981' fillOpacity={0.6} />
                                        <RechartsTooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Available Credits */}
                    <div>
                        <h2 className='text-2xl font-bold text-foreground mb-4 animate-slide-in-left'>
                            Available Carbon Credits
                        </h2>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            {credits.map((credit, index) => (
                                <Card
                                    key={credit.id}
                                    className='border-border hover:border-green-500 hover:shadow-2xl transition-all duration-300 hover-scale animate-scale-in group overflow-hidden'
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className='absolute top-4 right-4 z-10'>
                                        {credit.verified && (
                                            <Badge className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 animate-pulse'>
                                                <CheckCircle2 className='w-3 h-3 mr-1' />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>

                                    <CardHeader>
                                        <div className='flex items-start gap-3'>
                                            <div className='p-3 rounded-lg bg-green-100 dark:bg-green-900 group-hover:scale-110 transition-transform'>
                                                {getCategoryIcon(credit.category)}
                                            </div>
                                            <div className='flex-1'>
                                                <CardTitle className='text-foreground group-hover:text-green-600 transition-colors'>
                                                    {credit.name}
                                                </CardTitle>
                                                <div className='flex items-center gap-2 mt-2'>
                                                    <Badge variant='secondary'>{credit.category}</Badge>
                                                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                                        <Award className='w-3 h-3' />
                                                        {credit.rating} Rating
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className='space-y-4'>
                                            {/* Price Section */}
                                            <div className='p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg'>
                                                <div className='flex items-center justify-between mb-2'>
                                                    <div>
                                                        <p className='text-sm text-muted-foreground'>Price per Credit</p>
                                                        <p className='text-3xl font-bold text-green-600'>₹{credit.price}</p>
                                                    </div>
                                                    <div className='text-right'>
                                                        <p className='text-sm text-muted-foreground'>Total Value</p>
                                                        <p className='text-2xl font-bold text-foreground'>₹{credit.totalValue.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-2 text-sm'>
                                                    <Leaf className='w-4 h-4 text-green-600' />
                                                    <span className='font-semibold'>{credit.credits} Credits Available</span>
                                                </div>
                                            </div>

                                            {/* Impact Metrics */}
                                            <div className='grid grid-cols-3 gap-3'>
                                                <div className='p-3 bg-accent/50 rounded-lg text-center'>
                                                    <Wind className='w-5 h-5 text-blue-600 mx-auto mb-1' />
                                                    <p className='text-xs text-muted-foreground'>CO₂ Reduced</p>
                                                    <p className='font-semibold text-sm'>{(credit.impact.co2Reduced / 1000).toFixed(1)}K kg</p>
                                                </div>
                                                <div className='p-3 bg-accent/50 rounded-lg text-center'>
                                                    <TreePine className='w-5 h-5 text-green-600 mx-auto mb-1' />
                                                    <p className='text-xs text-muted-foreground'>Trees</p>
                                                    <p className='font-semibold text-sm'>{credit.impact.treesEquivalent}</p>
                                                </div>
                                                <div className='p-3 bg-accent/50 rounded-lg text-center'>
                                                    <Globe className='w-5 h-5 text-emerald-600 mx-auto mb-1' />
                                                    <p className='text-xs text-muted-foreground'>Certifier</p>
                                                    <p className='font-semibold text-xs'>{credit.certifier}</p>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div>
                                                <div className='flex justify-between text-sm mb-2'>
                                                    <span className='text-muted-foreground'>Impact Goal</span>
                                                    <span className='font-semibold'>85%</span>
                                                </div>
                                                <Progress value={85} className='h-2' />
                                            </div>

                                            {/* Actions */}
                                            <div className='grid grid-cols-2 gap-2'>
                                                <Button
                                                    className='gap-2 group/btn'
                                                    onClick={() => openPurchase(credit)}
                                                >
                                                    <ShoppingCart className='w-4 h-4 group-hover/btn:animate-bounce' />
                                                    Purchase
                                                </Button>
                                                <Button
                                                    variant='outline'
                                                    className='gap-2'
                                                    onClick={() => viewDetails(credit)}
                                                >
                                                    <Eye className='w-4 h-4' />
                                                    Details
                                                </Button>
                                            </div>
                                            <div className='grid grid-cols-2 gap-2'>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant='outline' size='sm' className='gap-2'>
                                                            <Share2 className='w-4 h-4' />
                                                            Share
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Share this credit</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant='outline' size='sm' className='gap-2'>
                                                            <Download className='w-4 h-4' />
                                                            Certificate
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Download certificate</TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Details Dialog */}
                    <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                        <DialogContent className='max-w-3xl animate-scale-in'>
                            <DialogHeader>
                                <DialogTitle className='flex items-center gap-2'>
                                    <Leaf className='w-5 h-5' />
                                    Carbon Credit Details
                                </DialogTitle>
                            </DialogHeader>
                            {selectedCredit && (
                                <div className='space-y-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='p-4 bg-accent/50 rounded-lg'>
                                            <h4 className='font-semibold mb-3'>Credit Information</h4>
                                            <div className='space-y-2 text-sm'>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>ID:</span>
                                                    <span className='font-semibold'>{selectedCredit.id}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Category:</span>
                                                    <Badge variant='secondary'>{selectedCredit.category}</Badge>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Credits:</span>
                                                    <span className='font-semibold'>{selectedCredit.credits}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Price:</span>
                                                    <span className='font-semibold text-green-600'>₹{selectedCredit.price}/credit</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-muted-foreground'>Expiry:</span>
                                                    <span className='font-semibold'>{selectedCredit.expiryDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='p-4 bg-accent/50 rounded-lg'>
                                            <h4 className='font-semibold mb-3'>Environmental Impact</h4>
                                            <div className='space-y-3'>
                                                <div className='flex items-center gap-2'>
                                                    <Wind className='w-5 h-5 text-blue-600' />
                                                    <div className='flex-1'>
                                                        <p className='text-xs text-muted-foreground'>CO₂ Reduction</p>
                                                        <p className='font-semibold'>{selectedCredit.impact.co2Reduced.toLocaleString()} kg</p>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <TreePine className='w-5 h-5 text-green-600' />
                                                    <div className='flex-1'>
                                                        <p className='text-xs text-muted-foreground'>Trees Equivalent</p>
                                                        <p className='font-semibold'>{selectedCredit.impact.treesEquivalent} trees</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <CheckCircle2 className='w-5 h-5 text-green-600' />
                                            <h4 className='font-semibold text-green-800 dark:text-green-200'>
                                                Verified by {selectedCredit.certifier}
                                            </h4>
                                        </div>
                                        <p className='text-sm text-green-700 dark:text-green-300'>
                                            This carbon credit has been independently verified and meets international standards for environmental impact.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Purchase Dialog */}
                    <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
                        <DialogContent className='animate-scale-in'>
                            <DialogHeader>
                                <DialogTitle className='flex items-center gap-2'>
                                    <ShoppingCart className='w-5 h-5' />
                                    Purchase Carbon Credits
                                </DialogTitle>
                                <DialogDescription>
                                    Invest in verified carbon credits and make a positive environmental impact
                                </DialogDescription>
                            </DialogHeader>
                            {selectedCredit && (
                                <div className='space-y-4'>
                                    <div className='p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-200 dark:border-green-800'>
                                        <h3 className='font-semibold text-lg mb-2'>{selectedCredit.name}</h3>
                                        <div className='grid grid-cols-2 gap-2 text-sm'>
                                            <div>
                                                <span className='text-muted-foreground'>Credits:</span>
                                                <span className='ml-2 font-semibold'>{selectedCredit.credits}</span>
                                            </div>
                                            <div>
                                                <span className='text-muted-foreground'>Price:</span>
                                                <span className='ml-2 font-semibold text-green-600'>₹{selectedCredit.price}/credit</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-4 bg-accent/50 rounded-lg'>
                                        <div className='flex justify-between items-center mb-2'>
                                            <span className='text-sm text-muted-foreground'>Total Amount:</span>
                                            <span className='text-2xl font-bold text-green-600'>₹{selectedCredit.totalValue.toLocaleString()}</span>
                                        </div>
                                        <div className='text-xs text-muted-foreground'>
                                            Environmental Impact: {selectedCredit.impact.co2Reduced.toLocaleString()} kg CO₂ reduced
                                        </div>
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <Button variant='outline' onClick={() => setPurchaseDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handlePurchase} className='gap-2 bg-green-600 hover:bg-green-700'>
                                    <CheckCircle2 className='w-4 h-4' />
                                    Confirm Purchase
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </TooltipProvider>
        </DashboardLayout>
    );
};

export default CarbonCredits;
