import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
    Globe,
    TrendingUp,
    DollarSign,
    Package,
    MapPin,
    Star,
    Send,
    Eye,
    Filter,
    Search,
    Target,
    Award,
    Download,
    RefreshCw,
    Calendar,
    Users,
    CheckCircle,
    X,
    FileText,
    Paperclip,
} from 'lucide-react';

interface Opportunity {
    id: number;
    country: string;
    buyer: string;
    product: string;
    quantity: number;
    unit: string;
    priceRange: string;
    demand: 'high' | 'medium' | 'low';
    certification: string;
    deadline: string;
    rating: number;
    matchScore: number;
    status: string;
    description?: string;
    paymentTerms?: string;
    shippingTerms?: string;
}

const FarmerExportOpportunities = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('all');
    const [filterDemand, setFilterDemand] = useState('all');
    const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proposalData, setProposalData] = useState({
        quantity: '',
        price: '',
        deliveryDate: '',
        message: '',
        attachments: [] as File[]
    });

    const [opportunities] = useState<Opportunity[]>([
        {
            id: 1,
            country: 'UAE',
            buyer: 'Dubai Agro Trading LLC',
            product: 'Soybean Meal',
            quantity: 10000,
            unit: 'kg',
            priceRange: '₹48-52',
            demand: 'high',
            certification: 'ISO 9001, FSSAI',
            deadline: '2025-01-25',
            rating: 4.8,
            matchScore: 95,
            status: 'active',
            description: 'Looking for premium quality soybean meal for animal feed production. Must meet international quality standards.',
            paymentTerms: '30% advance, 70% against documents',
            shippingTerms: 'FOB Mumbai Port'
        },
        {
            id: 2,
            country: 'Singapore',
            buyer: 'Asia Pacific Foods',
            product: 'Mustard Cake',
            quantity: 5000,
            unit: 'kg',
            priceRange: '₹30-35',
            demand: 'medium',
            certification: 'Organic, Export Quality',
            deadline: '2025-01-20',
            rating: 4.6,
            matchScore: 88,
            status: 'active',
            description: 'Organic mustard cake required for organic farming applications.',
            paymentTerms: 'Letter of Credit',
            shippingTerms: 'CIF Singapore'
        },
        {
            id: 3,
            country: 'Bangladesh',
            buyer: 'Bengal Traders',
            product: 'Groundnut Husk',
            quantity: 15000,
            unit: 'kg',
            priceRange: '₹16-18',
            demand: 'high',
            certification: 'Standard Quality',
            deadline: '2025-01-18',
            rating: 4.5,
            matchScore: 82,
            status: 'active',
            description: 'Bulk requirement for groundnut husk for industrial use.',
            paymentTerms: 'T/T 50% advance',
            shippingTerms: 'FOB Kolkata'
        },
        {
            id: 4,
            country: 'Saudi Arabia',
            buyer: 'Al-Riyadh Commodities',
            product: 'Soybean Meal',
            quantity: 8000,
            unit: 'kg',
            priceRange: '₹50-55',
            demand: 'high',
            certification: 'Halal, ISO 9001',
            deadline: '2025-01-30',
            rating: 4.9,
            matchScore: 92,
            status: 'active',
            description: 'Halal certified soybean meal for food processing industry.',
            paymentTerms: '100% advance payment',
            shippingTerms: 'CIF Jeddah'
        },
        {
            id: 5,
            country: 'Germany',
            buyer: 'Euro Organic GmbH',
            product: 'Sunflower Oil Cake',
            quantity: 12000,
            unit: 'kg',
            priceRange: '₹25-28',
            demand: 'medium',
            certification: 'EU Organic, Non-GMO',
            deadline: '2025-02-05',
            rating: 4.7,
            matchScore: 85,
            status: 'active',
            description: 'Organic sunflower oil cake for livestock feed.',
            paymentTerms: 'Letter of Credit at sight',
            shippingTerms: 'FOB Hamburg'
        },
    ]);

    const stats = [
        {
            title: 'Active Opportunities',
            value: opportunities.filter(o => o.status === 'active').length,
            icon: Globe,
            color: 'bg-blue-100 text-blue-600',
            change: '+3 this week',
        },
        {
            title: 'Potential Revenue',
            value: '₹12.5L',
            icon: DollarSign,
            color: 'bg-green-100 text-green-600',
            change: 'Estimated',
        },
        {
            title: 'Countries',
            value: new Set(opportunities.map(o => o.country)).size,
            icon: MapPin,
            color: 'bg-purple-100 text-purple-600',
            change: 'Global reach',
        },
        {
            title: 'Avg Match Score',
            value: `${Math.round(opportunities.reduce((sum, o) => sum + o.matchScore, 0) / opportunities.length)}%`,
            icon: Target,
            color: 'bg-orange-100 text-orange-600',
            change: 'High compatibility',
        },
    ];

    const getDemandColor = (demand: string) => {
        switch (demand) {
            case 'high':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        return 'text-orange-600';
    };

    const filteredOpportunities = opportunities.filter(opp => {
        const matchesSearch =
            opp.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.country.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCountry = filterCountry === 'all' || opp.country === filterCountry;
        const matchesDemand = filterDemand === 'all' || opp.demand === filterDemand;
        return matchesSearch && matchesCountry && matchesDemand;
    });

    const handleSubmitProposal = async () => {
        if (!selectedOpportunity) return;

        if (!proposalData.quantity || !proposalData.price || !proposalData.deliveryDate) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all required fields',
                variant: 'destructive'
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast({
                title: 'Proposal Submitted Successfully!',
                description: `Your proposal for ${selectedOpportunity.product} has been sent to ${selectedOpportunity.buyer}`,
            });
            setIsSubmitting(false);
            setSelectedOpportunity(null);
            setProposalData({
                quantity: '',
                price: '',
                deliveryDate: '',
                message: '',
                attachments: []
            });
        }, 2000);
    };

    const handleExportData = () => {
        const csvContent = [
            ['Buyer', 'Country', 'Product', 'Quantity', 'Price Range', 'Demand', 'Match Score', 'Deadline'].join(','),
            ...filteredOpportunities.map(opp =>
                [opp.buyer, opp.country, opp.product, `${opp.quantity} ${opp.unit}`, opp.priceRange, opp.demand, `${opp.matchScore}%`, opp.deadline].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-opportunities-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        toast({
            title: 'Export Successful',
            description: 'Opportunities data has been downloaded',
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Globe className="w-8 h-8 text-primary" />
                            Export Opportunities
                        </h1>
                        <p className="text-muted-foreground">Discover global buyers for your products</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleExportData}>
                            <Download className="w-4 h-4" />
                            Export Data
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
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

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by country, product, or buyer..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterCountry} onValueChange={setFilterCountry}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="All Countries" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    <SelectItem value="UAE">UAE</SelectItem>
                                    <SelectItem value="Singapore">Singapore</SelectItem>
                                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                                    <SelectItem value="Germany">Germany</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterDemand} onValueChange={setFilterDemand}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="All Demand Levels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Demand Levels</SelectItem>
                                    <SelectItem value="high">High Demand</SelectItem>
                                    <SelectItem value="medium">Medium Demand</SelectItem>
                                    <SelectItem value="low">Low Demand</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Opportunities List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Available Opportunities ({filteredOpportunities.length})</CardTitle>
                        <CardDescription>Matched export opportunities based on your products</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredOpportunities.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No opportunities match your filters</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOpportunities.map((opp, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                                                    <Globe className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-lg">{opp.buyer}</h4>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <MapPin className="w-3 h-3" />
                                                        {opp.country}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    <span className="text-sm font-semibold">{opp.rating}</span>
                                                </div>
                                                <Badge className={`${getDemandColor(opp.demand)} border capitalize`}>
                                                    {opp.demand} demand
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3 text-sm">
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-1">Product</p>
                                                <p className="font-semibold">{opp.product}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-1">Quantity</p>
                                                <p className="font-semibold">{opp.quantity.toLocaleString()} {opp.unit}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-1">Price Range</p>
                                                <p className="font-semibold text-green-600">{opp.priceRange}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-1">Deadline</p>
                                                <p className="font-semibold">{opp.deadline}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs mb-1">Match Score</p>
                                                <p className={`font-bold ${getMatchScoreColor(opp.matchScore)}`}>
                                                    {opp.matchScore}%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <p className="text-xs text-muted-foreground mb-1">Required Certifications</p>
                                            <div className="flex gap-2 flex-wrap">
                                                {opp.certification.split(', ').map((cert, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">
                                                        <Award className="w-3 h-3 mr-1" />
                                                        {cert}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline" onClick={() => setSelectedOpportunity(opp)}>
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        View Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>{opp.buyer} - {opp.product}</DialogTitle>
                                                        <DialogDescription>
                                                            Detailed information about this export opportunity
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>Country</Label>
                                                                <p className="font-medium">{opp.country}</p>
                                                            </div>
                                                            <div>
                                                                <Label>Rating</Label>
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                                    <span className="font-medium">{opp.rating}/5.0</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label>Quantity Required</Label>
                                                                <p className="font-medium">{opp.quantity.toLocaleString()} {opp.unit}</p>
                                                            </div>
                                                            <div>
                                                                <Label>Price Range</Label>
                                                                <p className="font-medium text-green-600">{opp.priceRange}</p>
                                                            </div>
                                                            <div>
                                                                <Label>Deadline</Label>
                                                                <p className="font-medium">{opp.deadline}</p>
                                                            </div>
                                                            <div>
                                                                <Label>Match Score</Label>
                                                                <p className={`font-bold ${getMatchScoreColor(opp.matchScore)}`}>
                                                                    {opp.matchScore}%
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label>Description</Label>
                                                            <p className="text-sm text-muted-foreground mt-1">{opp.description}</p>
                                                        </div>
                                                        <div>
                                                            <Label>Payment Terms</Label>
                                                            <p className="text-sm font-medium mt-1">{opp.paymentTerms}</p>
                                                        </div>
                                                        <div>
                                                            <Label>Shipping Terms</Label>
                                                            <p className="text-sm font-medium mt-1">{opp.shippingTerms}</p>
                                                        </div>
                                                        <div>
                                                            <Label>Required Certifications</Label>
                                                            <div className="flex gap-2 flex-wrap mt-1">
                                                                {opp.certification.split(', ').map((cert, i) => (
                                                                    <Badge key={i} variant="outline">
                                                                        <Award className="w-3 h-3 mr-1" />
                                                                        {cert}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" className="gap-1" onClick={() => setSelectedOpportunity(opp)}>
                                                        <Send className="w-3 h-3" />
                                                        Submit Proposal
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Submit Proposal to {opp.buyer}</DialogTitle>
                                                        <DialogDescription>
                                                            Fill in the details for your proposal
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>Quantity You Can Supply *</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder={`Max: ${opp.quantity} ${opp.unit}`}
                                                                    value={proposalData.quantity}
                                                                    onChange={(e) => setProposalData({ ...proposalData, quantity: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Your Price (₹ per {opp.unit}) *</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Enter your price"
                                                                    value={proposalData.price}
                                                                    onChange={(e) => setProposalData({ ...proposalData, price: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label>Expected Delivery Date *</Label>
                                                            <Input
                                                                type="date"
                                                                value={proposalData.deliveryDate}
                                                                onChange={(e) => setProposalData({ ...proposalData, deliveryDate: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Additional Message</Label>
                                                            <Textarea
                                                                placeholder="Add any additional information about your proposal..."
                                                                value={proposalData.message}
                                                                onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
                                                                rows={4}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Attach Documents (Optional)</Label>
                                                            <Input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) => {
                                                                    const files = Array.from(e.target.files || []);
                                                                    setProposalData({ ...proposalData, attachments: files });
                                                                }}
                                                            />
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Attach certifications, product samples, or other relevant documents
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setSelectedOpportunity(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button onClick={handleSubmitProposal} disabled={isSubmitting}>
                                                            {isSubmitting ? (
                                                                <>
                                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                                    Submitting...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Send className="w-4 h-4 mr-2" />
                                                                    Submit Proposal
                                                                </>
                                                            )}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tips Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-lg">💡 Export Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <Award className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Ensure you have required certifications before submitting proposals</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Package className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Higher match scores indicate better compatibility with buyer requirements</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Respond quickly to high-demand opportunities for better success rates</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Provide competitive pricing within the specified range</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default FarmerExportOpportunities;
