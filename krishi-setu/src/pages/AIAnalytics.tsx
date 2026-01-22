import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mlPriceService } from '@/services/mlPriceService';
import AIImageAnalytics from '@/components/AIImageAnalytics';
import {
  BarChart3,
  Image as ImageIcon,
  TrendingUp,
  Zap,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface PriceComparison {
  product: string;
  offlineRate: number;
  platformRate: number;
  advantage: number;
}

const AIAnalytics = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [priceComparisons, setPriceComparisons] = useState<PriceComparison[]>([]);
  const [marketTrends, setMarketTrends] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('mustard');
  const [oilseedByProducts, setOilseedByProducts] = useState<any[]>([]);
  const [showPriceComparison, setShowPriceComparison] = useState(true);
  const [showMLRecommendations, setShowMLRecommendations] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
    if (user) {
      loadAnalyticsData();
    }
  }, [user, loading, navigate]);

  const loadAnalyticsData = () => {
    // Load price comparisons
    const products = ['mustard', 'soybean', 'sunflower', 'groundnut', 'sesame'];
    const comparisons = products.map(product => {
      const comparison = mlPriceService.getPriceComparison(product);
      return {
        product: product.charAt(0).toUpperCase() + product.slice(1),
        offlineRate: comparison.offlineRate,
        platformRate: comparison.platformRate,
        advantage: comparison.percentageDifference
      };
    });
    setPriceComparisons(comparisons);

    // Load market trends
    const trends = mlPriceService.getMarketTrends(selectedProduct, 14);
    setMarketTrends(trends);

    // Load oilseed by-products
    setOilseedByProducts(mlPriceService.getOilseedByProducts());
  };

  const handleProductChange = (product: string) => {
    setSelectedProduct(product);
    const trends = mlPriceService.getMarketTrends(product, 14);
    setMarketTrends(trends);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-600" />
            AI Analytics
          </h1>
          <p className="text-muted-foreground">Advanced market analysis and AI-powered recommendations</p>
        </div>

        {/* Feature Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Price Comparison Box */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in">
            <CardContent className="pt-8 pb-8">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-700 mb-2">📊 Price Comparison</h3>
                    <p className="text-sm text-blue-700 opacity-80">Compare platform rates with offline market prices</p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-blue-700 opacity-20" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4" onClick={() => setShowPriceComparison(!showPriceComparison)}>
                  {showPriceComparison ? 'Hide' : 'Show'} Comparison
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ML Recommendations Box */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="pt-8 pb-8">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-700 mb-2">🤖 ML Recommendations</h3>
                    <p className="text-sm text-purple-700 opacity-80">Upload product images to get AI-powered recommendations</p>
                  </div>
                  <ImageIcon className="w-12 h-12 text-purple-700 opacity-20" />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full mt-4" onClick={() => setShowMLRecommendations(!showMLRecommendations)}>
                  {showMLRecommendations ? 'Hide' : 'Show'} Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Comparison Section */}
        {showPriceComparison && (
          <Card className="animate-fade-in border-2 border-blue-200 bg-blue-50/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Price Comparison: Platform vs Offline Market
                </CardTitle>
                <CardDescription>See how our platform rates compare to traditional markets</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPriceComparison(false)} className="text-gray-500">
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {priceComparisons.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold">Product</th>
                        <th className="text-right py-2 px-3 font-semibold">Offline Rate</th>
                        <th className="text-right py-2 px-3 font-semibold">Platform Rate</th>
                        <th className="text-right py-2 px-3 font-semibold">Advantage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceComparisons.map((comp, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-3 font-medium">{comp.product}</td>
                          <td className="text-right py-3 px-3">₹{comp.offlineRate}</td>
                          <td className="text-right py-3 px-3 font-semibold text-green-600">₹{comp.platformRate}</td>
                          <td className="text-right py-3 px-3">
                            <Badge className={comp.advantage > 0 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'} variant="outline">
                              {comp.advantage > 0 ? '+' : ''}{comp.advantage.toFixed(1)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Loading price comparisons...</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ML Recommendations Section */}
        {showMLRecommendations && (
          <Card className="animate-fade-in border-2 border-purple-200 bg-purple-50/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  ML-Based Price Recommendations
                </CardTitle>
                <CardDescription>Upload product images to get AI-powered price recommendations</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowMLRecommendations(false)} className="text-gray-500">
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <AIImageAnalytics compact={false} />
            </CardContent>
          </Card>
        )}

        {/* Market Trends */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Market Trends (14 Days)
            </CardTitle>
            <CardDescription>
              <div className="flex gap-2 mt-3">
                {['mustard', 'soybean', 'sunflower', 'groundnut'].map(product => (
                  <Button
                    key={product}
                    variant={selectedProduct === product ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleProductChange(product)}
                    className="capitalize"
                  >
                    {product}
                  </Button>
                ))}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="offlineRate"
                  stroke="#ef4444"
                  name="Offline Rate"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="platformRate"
                  stroke="#22c55e"
                  name="Platform Rate"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Oilseed By-Products */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Oilseed By-Products Market
            </CardTitle>
            <CardDescription>Additional revenue opportunities from processing by-products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {oilseedByProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow animate-scale-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">From {product.baseProduct}</p>
                    </div>
                    <Badge variant="outline" className={
                      product.demand === 'Very High' ? 'bg-green-100 text-green-800' :
                      product.demand === 'High' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {product.demand}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-semibold text-green-600">₹{product.price}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-semibold mb-1">Uses:</p>
                      <ul className="space-y-0.5">
                        {product.uses.map((use, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            {use}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    List Product
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAnalytics;
