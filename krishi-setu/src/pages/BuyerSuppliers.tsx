import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star, MapPin, Award, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BuyerSuppliers = () => {
    const suppliers = [
        { id: 1, name: 'Green Valley Processors', location: 'Maharashtra', rating: 4.9, products: 12, orders: 45, reliability: 98 },
        { id: 2, name: 'Harvest Oil Mills', location: 'Rajasthan', rating: 4.7, products: 8, orders: 32, reliability: 95 },
        { id: 3, name: 'Agro Waste Solutions', location: 'Gujarat', rating: 4.8, products: 15, orders: 28, reliability: 97 }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Suppliers
                    </h1>
                    <p className="text-muted-foreground">Your trusted and preferred suppliers</p>
                </div>

                <div className="space-y-4">
                    {suppliers.map((supplier) => (
                        <Card key={supplier.id} className="border-0 shadow-xl hover:shadow-2xl transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                            {supplier.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">{supplier.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                    <span className="text-sm font-semibold">{supplier.rating}</span>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">{supplier.orders} orders</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                                        View Profile
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">Location</p>
                                        <p className="font-semibold flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {supplier.location}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">Products</p>
                                        <p className="font-semibold">{supplier.products} items</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs mb-1">Reliability</p>
                                        <p className="font-semibold text-green-600">{supplier.reliability}%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BuyerSuppliers;
