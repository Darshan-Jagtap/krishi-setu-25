import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number; transactions: number; }>;
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  return (
    <Card className='border-border animate-fade-in'>
      <CardHeader>
        <CardTitle className='text-foreground flex items-center gap-2'>
          <TrendingUp className='w-5 h-5' />
          Revenue Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='p-8 bg-primary/5 rounded-lg text-center'>
          <p className='text-sm text-muted-foreground mb-2'>Total Revenue</p>
          <p className='text-4xl font-bold text-foreground'></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
