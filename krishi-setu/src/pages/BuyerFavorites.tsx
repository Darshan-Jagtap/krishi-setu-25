import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const BuyerFavorites = () => {
    const favorites = [
        { id: 1, name: 'Soybean Meal', supplier: 'Green Valley', price: 45, rating: 4.8 },
        { id: 2, name: 'Mustard Oil Cake', supplier: 'Harvest Mills', price: 28, rating: 4.5 },
        { id: 3, name: 'Groundnut Husk', supplier: 'Agro Solutions', price: 15, rating: 4.6 }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Favorites
                    </h1>
                    <p className="text-muted-foreground">Products you've saved for quick access</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                        <Card key={product.id} className="border-0 shadow-xl hover:shadow-2xl transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-lg">{product.name}</h4>
                                        <p className="text-sm text-muted-foreground">From: {product.supplier}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            <span className="text-sm font-semibold">{product.rating}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        ₹{product.price}
                                    </p>
                                    <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                                        <ShoppingCart className="w-3 h-3" />
                                        Order
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BuyerFavorites;
