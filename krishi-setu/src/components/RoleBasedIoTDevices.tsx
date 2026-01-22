import { useAuth } from '@/hooks/useAuth';
import ProcessorIoTDevices from '@/pages/ProcessorIoTDevices';
import FarmerIoTDevices from '@/pages/FarmerIoTDevices';
import TestFarmerIoT from '@/pages/TestFarmerIoT';

const RoleBasedIoTDevices = () => {
  const { userRole } = useAuth();

  // Debug logging
  console.log('RoleBasedIoTDevices - Current userRole:', userRole);

  if (userRole === 'processor') {
    console.log('RoleBasedIoTDevices - Showing ProcessorIoTDevices');
    return <ProcessorIoTDevices />;
  } else if (userRole === 'farmer') {
    console.log('RoleBasedIoTDevices - Showing FarmerIoTDevices');
    return <TestFarmerIoT />;
  } else {
    console.log('RoleBasedIoTDevices - Defaulting to FarmerIoTDevices');
    // Default to farmer dashboard for other roles or when role is not set
    return <TestFarmerIoT />;
  }
};

export default RoleBasedIoTDevices;
