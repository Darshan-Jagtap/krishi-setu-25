import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { fpoAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface MemberAnalytics {
    member: {
        _id: string;
        membership_number: string;
        farmer: {
            _id: string;
            full_name: string;
            email: string;
            phone?: string;
            location?: string;
        };
        status: string;
        member_since: string;
    };
    stats: {
        total_products: number;
        revenue_generated: number;
        contribution_percentage: number;
        pending_payment: number;
    };
}

interface AnalyticsSummary {
    total_members: number;
    active_members: number;
    total_revenue: number;
    total_pending_payment: number;
    average_contribution: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const FPOMemberAnalytics = () => {
    const { toast } = useToast();
    const [analytics, setAnalytics] = useState<MemberAnalytics[]>([]);
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fpoAPI.getMemberAnalytics();
            setAnalytics(response.analytics || []);
            setSummary(response.summary || null);
        } catch (error: any) {
            console.error('Error loading analytics:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to load analytics',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const chartData = analytics.map(item => ({
        name: item.member.farmer?.full_name?.split(' ')[0] || 'Member',
        revenue: item.stats.revenue_generated || 0,
        products: item.stats.total_products || 0,
        contribution: item.stats.contribution_percentage || 0,
        pending: item.stats.pending_payment || 0,
    }));

    const pieData = analytics
        .filter(item => (item.stats.revenue_generated || 0) > 0)
        .map(item => ({
            name: item.member.farmer?.full_name?.split(' ')[0] || 'Member',
            value: item.stats.revenue_generated || 0,
        }));

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-8 h-8 text-primary" />
                        FPO Member Analytics
                    </h1>
                    <p className="text-muted-foreground">Comprehensive analytics and insights for your member farmers</p>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.total_members}</div>
                                <p className="text-xs text-muted-foreground">
                                    {summary.active_members} active
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{summary.total_revenue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    From all members
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{summary.total_pending_payment.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    To be distributed
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Contribution</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.average_contribution.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground">
                                    Average contribution percentage
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Charts */}
                {analytics.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue by Member</CardTitle>
                                <CardDescription>Total revenue generated by each member</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                                            <Bar dataKey="revenue" fill="#0088FE" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        No revenue data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Distribution</CardTitle>
                                <CardDescription>Percentage share of total revenue</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        No revenue data available for distribution chart
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Products by Member</CardTitle>
                                <CardDescription>Total products listed by each member</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="products" fill="#00C49F" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        No product data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contribution Percentage</CardTitle>
                                <CardDescription>Member contribution percentages</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                                            <Line type="monotone" dataKey="contribution" stroke="#FF8042" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                        No contribution data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                                <p className="text-muted-foreground text-lg mb-2">No analytics data available</p>
                                <p className="text-sm text-muted-foreground">
                                    Add members to your FPO to see detailed analytics and charts.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Detailed Member Stats Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Member Performance Details</CardTitle>
                        <CardDescription>Detailed statistics for each member farmer</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {analytics.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                                <p className="text-muted-foreground text-lg mb-2">No member analytics available</p>
                                <p className="text-sm text-muted-foreground">
                                    Add members to your FPO to see analytics and performance metrics.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member #</TableHead>
                                        <TableHead>Farmer Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>Revenue Generated</TableHead>
                                        <TableHead>Contribution %</TableHead>
                                        <TableHead>Pending Payment</TableHead>
                                        <TableHead>Member Since</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {analytics.map((item) => (
                                        <TableRow key={item.member._id}>
                                            <TableCell className="font-mono text-sm">
                                                {item.member.membership_number}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{item.member.farmer?.full_name || 'N/A'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                                        <span>{item.member.farmer?.email || 'N/A'}</span>
                                                    </div>
                                                    {item.member.farmer?.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3 text-muted-foreground" />
                                                            <span>{item.member.farmer.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    <Package className="w-3 h-3 mr-1" />
                                                    {item.stats.total_products || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                ₹{(item.stats.revenue_generated || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell>{item.stats.contribution_percentage || 0}%</TableCell>
                                            <TableCell className="font-semibold text-orange-600">
                                                ₹{(item.stats.pending_payment || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    {item.member.member_since ? new Date(item.member.member_since).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default FPOMemberAnalytics;

