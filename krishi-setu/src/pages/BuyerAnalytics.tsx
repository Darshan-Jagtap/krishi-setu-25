import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Package, Target } from 'lucide-react';

const BuyerAnalytics = () => {
    const purchaseData = [
        { month: 'Jul', amount: 420 },
        { month: 'Aug', amount: 580 },
        { month: 'Sep', amount: 650 },
        { month: 'Oct', amount: 720 },
        { month: 'Nov', amount: 850 },
        { month: 'Dec', amount: 920 }
    ];

    const categoryData = [
        { name: 'Oilseeds', value: 45, color: '#3b82f6' },
        { name: 'By-Products', value: 30, color: '#10b981' },
        { name: 'Processed', value: 25, color: '#f59e0b' }
    ];

    const stats = [
        { title: 'Total Spent', value: '₹58.5L', icon: DollarSign, color: 'text-blue-600' },
        { title: 'Orders', value: '156', icon: Package, color: 'text-purple-600' },
        { title: 'Avg Savings', value: '12.5%', icon: TrendingUp, color: 'text-green-600' },
        { title: 'Top Category', value: 'Oilseeds', icon: Target, color: 'text-orange-600' }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Analytics
                    </h1>
                    <p className="text-muted-foreground">Insights into your purchasing patterns</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className="border-0 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    </div>
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle>Purchase Trends</CardTitle>
                            <CardDescription>Last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={purchaseData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle>Purchase by Category</CardTitle>
                            <CardDescription>Distribution of purchases</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name} ${entry.value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BuyerAnalytics;
