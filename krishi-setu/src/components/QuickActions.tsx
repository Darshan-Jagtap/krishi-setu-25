import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Package, BarChart3, ShoppingCart, Droplets, Cake, Wheat, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ userRole }: { userRole: string }) => {
  const navigate = useNavigate();
  
  const getQuickActions = () => {
    const commonActions = [
      { icon: Plus, label: 'Add Product', path: '/marketplace' },
      { icon: Package, label: 'My Products', path: '/listings' },
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      { icon: ShoppingCart, label: 'Browse', path: '/marketplace' },
    ];

    if (userRole === 'processor') {
      return [
        { icon: Droplets, label: 'Mustard Cake', path: '/byproducts/mustard-cake' },
        { icon: Cake, label: 'Soybean Meal', path: '/byproducts/soybean-meal' },
        { icon: Wheat, label: 'Groundnut Cake', path: '/byproducts/groundnut-cake' },
        { icon: Leaf, label: 'Sunflower Meal', path: '/byproducts/sunflower-meal' },
        ...commonActions,
      ];
    }
    
    return commonActions;
  };

  const actions = getQuickActions();
  
  return (
    <Card className='border-border animate-fade-in'>
      <CardContent className='pt-6'>
        <h3 className='text-lg font-semibold text-foreground mb-4'>Quick Actions</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {actions.slice(0, 4).map((action, index) => {
            const Icon = action.icon;
            return (
              <Button 
                key={index}
                variant={index === 0 ? 'default' : 'outline'} 
                onClick={() => navigate(action.path)} 
                className='h-auto py-4 flex-col gap-2'
              >
                <Icon className='w-5 h-5' />
                <span className='text-xs font-medium'>{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
