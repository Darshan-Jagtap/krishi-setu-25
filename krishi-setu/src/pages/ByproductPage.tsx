import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  Cake, 
  Wheat, 
  Leaf, 
  Package, 
  TrendingUp, 
  Users,
  Star,
  ArrowRight
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const byproductData = {
  'mustard-cake': {
    name: 'Mustard Oil Cake',
    icon: Droplets,
    description: 'High-protein byproduct from mustard oil extraction',
    protein: '38-42%',
    moisture: '8-10%',
    fiber: '7-9%',
    uses: ['Animal Feed', 'Organic Fertilizer', 'Biofuel'],
    benefits: ['Rich in protein', 'Improves soil health', 'Cost-effective feed'],
    price: '₹12-15/kg',
    availability: 'In Stock',
    rating: 4.6,
    suppliers: 15
  },
  'soybean-meal': {
    name: 'Soybean Meal',
    icon: Cake,
    description: 'Premium protein meal from soybean oil processing',
    protein: '44-48%',
    moisture: '10-12%',
    fiber: '3-5%',
    uses: ['Animal Feed', 'Food Industry', 'Pet Food'],
    benefits: ['High protein content', 'Essential amino acids', 'Versatile usage'],
    price: '₹25-30/kg',
    availability: 'In Stock',
    rating: 4.8,
    suppliers: 22
  },
  'groundnut-cake': {
    name: 'Groundnut Cake',
    icon: Wheat,
    description: 'Nutritious byproduct from groundnut oil extraction',
    protein: '45-50%',
    moisture: '7-9%',
    fiber: '8-10%',
    uses: ['Animal Feed', 'Organic Manure', 'Industrial Applications'],
    benefits: ['High protein', 'Rich in oil residue', 'Excellent fertilizer'],
    price: '₹18-22/kg',
    availability: 'Limited',
    rating: 4.5,
    suppliers: 12
  },
  'sunflower-meal': {
    name: 'Sunflower Meal',
    icon: Leaf,
    description: 'Fiber-rich meal from sunflower oil processing',
    protein: '28-32%',
    moisture: '9-11%',
    fiber: '20-24%',
    uses: ['Animal Feed', 'Biofuel', 'Industrial Applications'],
    benefits: ['High fiber content', 'Cost-effective', 'Renewable energy source'],
    price: '₹10-13/kg',
    availability: 'In Stock',
    rating: 4.4,
    suppliers: 18
  }
};

const ByproductPage = () => {
  const { byproductType } = useParams();
  const navigate = useNavigate();
  const byproduct = byproductData[byproductType as keyof typeof byproductData];

  if (!byproduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Byproduct Not Found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const Icon = byproduct.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{byproduct.name}</h1>
            <p className="text-lg text-muted-foreground">{byproduct.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {byproduct.availability}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{byproduct.rating}</span>
            <span className="text-muted-foreground">({byproduct.suppliers} suppliers)</span>
          </div>
          <Badge variant="secondary">
            {byproduct.price}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Nutritional Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{byproduct.protein}</div>
                  <div className="text-sm text-muted-foreground">Protein Content</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{byproduct.moisture}</div>
                  <div className="text-sm text-muted-foreground">Moisture</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{byproduct.fiber}</div>
                  <div className="text-sm text-muted-foreground">Fiber Content</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Common Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {byproduct.uses.map((use, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gray-50">
                    <div className="font-medium text-sm">{use}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {byproduct.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Supplier Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Suppliers</span>
                  <span className="font-semibold">{byproduct.suppliers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Rating</span>
                  <span className="font-semibold">{byproduct.rating}/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Price Range</span>
                  <span className="font-semibold">{byproduct.price}</span>
                </div>
              </div>
              <Button className="w-full mt-4">
                View All Suppliers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Place Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Market Trends
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Contact Suppliers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ByproductPage;
