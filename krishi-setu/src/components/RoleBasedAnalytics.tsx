import { useAuth } from '@/hooks/useAuth';
import ProcessorAIAnalytics from '@/pages/ProcessorAIAnalytics';
import FarmerAIAnalytics from '@/pages/FarmerAIAnalytics';
import TestFarmerAnalytics from '@/pages/TestFarmerAnalytics';

const RoleBasedAnalytics = () => {
  const { userRole } = useAuth();

  // Debug logging
  console.log('RoleBasedAnalytics - Current userRole:', userRole);

  if (userRole === 'processor') {
    console.log('RoleBasedAnalytics - Showing ProcessorAIAnalytics');
    return <ProcessorAIAnalytics />;
  } else if (userRole === 'farmer') {
    console.log('RoleBasedAnalytics - Showing FarmerAIAnalytics');
    return <TestFarmerAnalytics />;
  } else {
    console.log('RoleBasedAnalytics - Defaulting to FarmerAIAnalytics');
    // Default to farmer dashboard for other roles or when role is not set
    return <TestFarmerAnalytics />;
  }
};

export default RoleBasedAnalytics;
