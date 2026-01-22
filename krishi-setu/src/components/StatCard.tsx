import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  prefix?: string;
  suffix?: string;
  delay?: number;
}

const StatCard = ({ title, value, icon: Icon, trend, prefix = '', suffix = '', delay = 0 }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 1000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [value]);

  return (
    <Card
      className='border-border hover-scale animate-scale-in overflow-hidden group'
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
          {title}
        </CardTitle>
        <div className='p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors'>
          <Icon className='w-4 h-4 text-primary' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-3xl font-bold text-foreground mb-2 animate-fade-in'>
          {prefix}
          {typeof value === 'number' ? displayValue.toLocaleString() : value}
          {suffix}
        </div>
        {trend && (
          <div className='flex items-center text-sm'>
            <span className={`font-medium ${trend.isPositive !== false ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.isPositive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className='text-muted-foreground ml-2'>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
