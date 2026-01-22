import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

const BuyerNotifications = () => {
    const notifications = [
        { id: 1, type: 'order', title: 'Order Delivered', message: 'Your order #ORD001 has been delivered', time: '2 hours ago', read: false },
        { id: 2, type: 'price', title: 'Price Drop Alert', message: 'Soybean Meal price dropped by 5.9%', time: '5 hours ago', read: false },
        { id: 3, type: 'order', title: 'Order Confirmed', message: 'Your order #ORD002 has been confirmed', time: '1 day ago', read: true },
        { id: 4, type: 'alert', title: 'Payment Reminder', message: 'Payment pending for order #ORD003', time: '2 days ago', read: true }
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return Package;
            case 'price': return TrendingDown;
            case 'alert': return AlertCircle;
            default: return Bell;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Notifications
                    </h1>
                    <p className="text-muted-foreground">Stay updated with your orders and alerts</p>
                </div>

                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const Icon = getIcon(notification.type);
                        return (
                            <Card key={notification.id} className={`border-0 shadow-lg hover:shadow-xl transition-all ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''}`}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold">{notification.title}</h4>
                                                {!notification.read && <Badge className="bg-blue-600">New</Badge>}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                                        </div>
                                        {notification.read && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BuyerNotifications;
