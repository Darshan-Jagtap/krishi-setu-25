import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'lucide-react';

const TestFarmerIoT = () => {
  console.log('TestFarmerIoT component loaded!');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Test Farmer IoT Devices</h1>
          <p className="text-muted-foreground">This is a test page to verify routing works</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Test Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>If you can see this page, the routing is working correctly!</p>
          <p>This is the Farmer IoT Devices page.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestFarmerIoT;
