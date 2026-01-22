import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const ActivityFeed = ({ userId }: { userId: string }) => {
  return (
    <Card className='border-border animate-fade-in'>
      <CardHeader>
        <CardTitle className='text-foreground flex items-center gap-2'>
          <TrendingUp className='w-5 h-5' />
          Recent Activity
        </CardTitle>
        <p className='text-sm text-muted-foreground'>
          Real-time updates on your transactions and orders
        </p>
      </CardHeader>
      <CardContent>
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>Activity feed coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
