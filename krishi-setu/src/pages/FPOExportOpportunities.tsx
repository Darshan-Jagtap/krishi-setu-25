import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
    Users,
    Download,
    FileText,
    Calendar,
    CheckCircle,
    AlertCircle,
    X,
    Upload
} from 'lucide-react';

interface ExportOpportunity {
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
    qualityRequirements?: string;
}

const FPOExportOpportunities = () => {
    const { toast } = useToast();

    const [opportunities, setOpportunities] = useState<ExportOpportunity[]>([
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
            deadline: '2024-12-15',
            rating: 4.8,
            matchScore: 95,
            status: 'active',
            description: 'High-quality soybean meal required for livestock feed manufacturing. Looking for consistent supply from reliable FPO partners.',
            paymentTerms: 'LC at sight, 30 days credit available',
            shippingTerms: 'FOB Mumbai Port',
            qualityRequirements: 'Protein content: 44-48%, Moisture: Max 12%'
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
            deadline: '2024-12-20',
            rating: 4.6,
            matchScore: 88,
            status: 'active',
            description: 'Organic mustard cake for premium animal feed. Prefer certified organic suppliers with traceability.',
            paymentTerms: 'Advance payment 30%, Balance on shipment',
            shippingTerms: 'CIF Singapore',
            qualityRequirements: 'Organic certified, Oil content: 6-8%'
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
            deadline: '2024-12-18',
            rating: 4.5,
            matchScore: 82,
            status: 'active',
            description: 'Bulk requirement of groundnut husk for industrial use. Regular monthly orders expected.',
            paymentTerms: 'TT payment, 15 days credit',
            shippingTerms: 'FOB Kolkata Port',
            qualityRequirements: 'Moisture: Max 10%, Clean and dried'
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
            deadline: '2024-12-25',
            rating: 4.9,
            matchScore: 92,
            status: 'active',
            description: 'Halal certified soybean meal for Middle East market. Long-term partnership opportunity.',
            paymentTerms: 'LC at 60 days',
            shippingTerms: 'CFR Jeddah Port',
            qualityRequirements: 'Halal certified, Protein: 46%+, GMO-free'
        },
        {
            id: 5,
            country: 'Germany',
            buyer: 'Euro Organic Supplies',
            product: 'Sunflower Oil Cake',
            quantity: 12000,
            unit: 'kg',
            priceRange: '₹25-28',
            demand: 'medium',
            certification: 'EU Organic, Non-GMO',
            deadline: '2024-12-30',
            rating: 4.7,
            matchScore: 85,
            status: 'active',
            description: 'EU organic certified sunflower oil cake for European market. Strict quality standards apply.',
            paymentTerms: 'Advance 40%, Balance against documents',
            shippingTerms: 'CIF Hamburg',
            qualityRequirements: 'EU Organic certified, Protein: 28-32%'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('all');
    const [filterDemand, setFilterDemand] = useState('all');
    const [selectedOpportunity, setSelectedOpportunity] = useState<ExportOpportunity | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [proposalData, setProposalData] = useState({
        quantity: '',
        price: '',
        deliveryDate: '',
        message: '',
        documents: null as File | null
    });

    // Filter opportunities
    const filteredOpportunities = opportunities.filter(opp => {
        const matchesSearch = opp.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.country.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCountry = filterCountry === 'all' || opp.country === filterCountry;
        const matchesDemand = filterDemand === 'all' || opp.demand === filterDemand;
        return matchesSearch && matchesCountry && matchesDemand;
    });

    // Calculate stats
    const stats = {
        activeOpportunities: opportunities.length,
        potentialRevenue: opportunities.reduce((sum, opp) => {
            const avgPrice = parseInt(opp.priceRange.split('-')[0].replace('₹', ''));
            return sum + (avgPrice * opp.quantity);
        }, 0),
        countries: new Set(opportunities.map(o => o.country)).size,
        avgMatchScore: Math.round(opportunities.reduce((sum, o) => sum + o.matchScore, 0) / opportunities.length)
    };

    // Get unique countries
    const countries = Array.from(new Set(opportunities.map(o => o.country)));

    // Handle view details
    const handleViewDetails = (opportunity: ExportOpportunity) => {
        setSelectedOpportunity(opportunity);
        setIsViewDialogOpen(true);
    };

    // Handle submit proposal
    const handleOpenProposal = (opportunity: ExportOpportunity) => {
        setSelectedOpportunity(opportunity);
        setProposalData({
            quantity: opportunity.quantity.toString(),
            price: '',
            deliveryDate: '',
            message: '',
            documents: null
        });
        setIsProposalDialogOpen(true);
    };

    const handleSubmitProposal = async () => {
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
                title: 'Proposal Submitted!',
                description: `Your proposal for ${selectedOpportunity?.product} has been sent to ${selectedOpportunity?.buyer}`,
            });
            setIsProposalDialogOpen(false);
            setIsSubmitting(false);
            setProposalData({
                quantity: '',
                price: '',
                deliveryDate: '',
                message: '',
                documents: null
            });
        }, 1500);
    };

    // Export data to CSV
    const handleExportData = () => {
        const csvContent = [
            ['Country', 'Buyer', 'Product', 'Quantity', 'Price Range', 'Demand', 'Deadline', 'Match Score'].join(','),
            ...filteredOpportunities.map(opp =>
                [opp.country, opp.buyer, opp.product, `${opp.quantity} ${opp.unit}`, opp.priceRange, opp.demand, opp.deadline, `${opp.matchScore}%`].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fpo-export-opportunities-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        toast({
            title: 'Data Exported',
            description: 'Export opportunities data has been downloaded',
        });
    };

    const getDemandColor = (demand: string) => {
        switch (demand) {
            case 'high': return 'bg-red-100 text-red-800 border-red-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        return 'text-orange-600';
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
                        <p className="text-muted-foreground">Discover global export opportunities for your FPO</p>
                    </div>
                    <Button onClick={handleExportData} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-blue-700 mb-1">Active Opportunities</p>
                                    <p className="text-3xl font-bold text-blue-900">{stats.activeOpportunities}</p>
                                    <p className="text-xs text-blue-600 mt-1">+3 this week</p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-200">
                                    <Globe className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-green-700 mb-1">Potential Revenue</p>
                                    <p className="text-3xl font-bold text-green-900">₹{(stats.potentialRevenue / 100000).toFixed(1)}L</p>
                                    <p className="text-xs text-green-600 mt-1">Estimated</p>
                                </div>
                                <div className="p-3 rounded-lg bg-green-200">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-purple-700 mb-1">Countries</p>
                                    <p className="text-3xl font-bold text-purple-900">{stats.countries}</p>
                                    <p className="text-xs text-purple-600 mt-1">Global reach</p>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-200">
                                    <MapPin className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-orange-700 mb-1">Avg Match Score</p>
                                    <p className="text-3xl font-bold text-orange-900">{stats.avgMatchScore}%</p>
                                    <p className="text-xs text-orange-600 mt-1">Compatibility</p>
                                </div>
                                <div className="p-3 rounded-lg bg-orange-200">
                                    <Target className="w-6 h-6 text-orange-600" />
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
                                    placeholder="Search by buyer, product, or country..."
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
                                    {countries.map(country => (
                                        <SelectItem key={country} value={country}>{country}</SelectItem>
                                    ))}
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
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {filteredOpportunities.length} of {opportunities.length} opportunities
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Opportunities Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredOpportunities.map(opportunity => (
                        <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span className="font-semibold text-lg">{opportunity.country}</span>
                                            <Badge className={getDemandColor(opportunity.demand)}>
                                                {opportunity.demand} demand
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl">{opportunity.buyer}</CardTitle>
                                        <CardDescription className="mt-1">{opportunity.product}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-2xl font-bold ${getMatchScoreColor(opportunity.matchScore)}`}>
                                            {opportunity.matchScore}%
                                        </div>
                                        <p className="text-xs text-muted-foreground">Match</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Quantity</p>
                                        <p className="font-semibold">{opportunity.quantity.toLocaleString()} {opportunity.unit}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Price Range</p>
                                        <p className="font-semibold text-green-600">{opportunity.priceRange}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Deadline</p>
                                        <p className="font-semibold flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(opportunity.deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Rating</p>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{opportunity.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Certifications Required</p>
                                    <div className="flex flex-wrap gap-2">
                                        {opportunity.certification.split(',').map((cert, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                                <Award className="w-3 h-3 mr-1" />
                                                {cert.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleViewDetails(opportunity)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                    <Button
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        onClick={() => handleOpenProposal(opportunity)}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Proposal
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Export Tips */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-600" />
                            FPO Export Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Collective Bargaining Power</p>
                                    <p className="text-sm text-muted-foreground">Leverage your FPO's combined capacity for better prices</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Quality Consistency</p>
                                    <p className="text-sm text-muted-foreground">Ensure uniform quality across all member farmers</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Documentation Ready</p>
                                    <p className="text-sm text-muted-foreground">Keep all export certifications and licenses updated</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Member Coordination</p>
                                    <p className="text-sm text-muted-foreground">Coordinate with members for timely delivery</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* View Details Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Opportunity Details
                            </DialogTitle>
                            <DialogDescription>Complete information about this export opportunity</DialogDescription>
                        </DialogHeader>
                        {selectedOpportunity && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Country</Label>
                                        <p className="font-semibold flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {selectedOpportunity.country}
                                        </p>
                                    </div>
                                    <div>
                                        <Label>Buyer</Label>
                                        <p className="font-semibold">{selectedOpportunity.buyer}</p>
                                    </div>
                                    <div>
                                        <Label>Product</Label>
                                        <p className="font-semibold">{selectedOpportunity.product}</p>
                                    </div>
                                    <div>
                                        <Label>Quantity Required</Label>
                                        <p className="font-semibold">{selectedOpportunity.quantity.toLocaleString()} {selectedOpportunity.unit}</p>
                                    </div>
                                    <div>
                                        <Label>Price Range</Label>
                                        <p className="font-semibold text-green-600">{selectedOpportunity.priceRange}</p>
                                    </div>
                                    <div>
                                        <Label>Deadline</Label>
                                        <p className="font-semibold">{new Date(selectedOpportunity.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <Label>Demand Level</Label>
                                        <Badge className={getDemandColor(selectedOpportunity.demand)}>
                                            {selectedOpportunity.demand}
                                        </Badge>
                                    </div>
                                    <div>
                                        <Label>Match Score</Label>
                                        <p className={`font-bold text-xl ${getMatchScoreColor(selectedOpportunity.matchScore)}`}>
                                            {selectedOpportunity.matchScore}%
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label>Description</Label>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedOpportunity.description}</p>
                                </div>

                                <div>
                                    <Label>Payment Terms</Label>
                                    <p className="text-sm font-medium mt-1">{selectedOpportunity.paymentTerms}</p>
                                </div>

                                <div>
                                    <Label>Shipping Terms</Label>
                                    <p className="text-sm font-medium mt-1">{selectedOpportunity.shippingTerms}</p>
                                </div>

                                <div>
                                    <Label>Quality Requirements</Label>
                                    <p className="text-sm font-medium mt-1">{selectedOpportunity.qualityRequirements}</p>
                                </div>

                                <div>
                                    <Label>Certifications Required</Label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedOpportunity.certification.split(',').map((cert, idx) => (
                                            <Badge key={idx} variant="outline">
                                                <Award className="w-3 h-3 mr-1" />
                                                {cert.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Submit Proposal Dialog */}
                <Dialog open={isProposalDialogOpen} onOpenChange={setIsProposalDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Send className="w-5 h-5" />
                                Submit Proposal
                            </DialogTitle>
                            <DialogDescription>
                                Submit your proposal for {selectedOpportunity?.product} to {selectedOpportunity?.buyer}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Quantity (kg) *</Label>
                                    <Input
                                        type="number"
                                        placeholder="Enter quantity"
                                        value={proposalData.quantity}
                                        onChange={(e) => setProposalData({ ...proposalData, quantity: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Your Price (₹/kg) *</Label>
                                    <Input
                                        type="number"
                                        placeholder="Enter your price"
                                        value={proposalData.price}
                                        onChange={(e) => setProposalData({ ...proposalData, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Delivery Date *</Label>
                                <Input
                                    type="date"
                                    value={proposalData.deliveryDate}
                                    onChange={(e) => setProposalData({ ...proposalData, deliveryDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>Message (Optional)</Label>
                                <Textarea
                                    placeholder="Add any additional information about your FPO's capabilities, certifications, or special offers..."
                                    rows={4}
                                    value={proposalData.message}
                                    onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>Attach Documents (Optional)</Label>
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setProposalData({ ...proposalData, documents: e.target.files?.[0] || null })}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Upload certifications, quality reports, or FPO profile (PDF, DOC, DOCX)
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsProposalDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitProposal} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
        </DashboardLayout>
    );
};

export default FPOExportOpportunities;
