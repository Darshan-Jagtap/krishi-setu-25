import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp } from "lucide-react";

const opportunities = [
  {
    id: 1,
    country: "United Arab Emirates",
    product: "Basmati Rice",
    demand: "High",
    price: "₹85/kg",
    potential: "+45%",
  },
  {
    id: 2,
    country: "United Kingdom",
    product: "Organic Spices",
    demand: "Medium",
    price: "₹150/kg",
    potential: "+32%",
  },
  {
    id: 3,
    country: "Singapore",
    product: "Fresh Vegetables",
    demand: "High",
    price: "₹60/kg",
    potential: "+28%",
  },
  {
    id: 4,
    country: "United States",
    product: "Cotton Products",
    demand: "Low",
    price: "₹120/kg",
    potential: "+15%",
  },
];

const Exports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Export Opportunities</h1>
          <p className="text-muted-foreground">
            Connect with international buyers and expand globally
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="border-border hover:border-primary transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">{opportunity.country}</CardTitle>
                      <p className="text-sm text-muted-foreground">{opportunity.product}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      opportunity.demand === 'High' ? 'default' : 
                      opportunity.demand === 'Medium' ? 'secondary' : 
                      'outline'
                    }
                    className={opportunity.demand === 'High' ? 'bg-primary' : ''}
                  >
                    {opportunity.demand} Demand
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Export Price</p>
                    <p className="text-xl font-bold text-foreground">{opportunity.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit Potential</p>
                    <div className="flex items-center text-xl font-bold text-primary">
                      <TrendingUp className="w-5 h-5 mr-1" />
                      {opportunity.potential}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">Express Interest</Button>
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

export default Exports;
