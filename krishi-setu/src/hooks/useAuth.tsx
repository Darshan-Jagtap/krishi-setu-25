import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'farmer' | 'processor' | 'buyer' | 'fpo';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useAuth: Initializing localStorage auth...');

    // Check for test role first (for manual testing)
    const testRole = (window as any).testUserRole;
    console.log('useAuth: testUserRole:', testRole);
      if (testRole && ['farmer', 'processor', 'buyer', 'fpo'].includes(testRole)) {
      console.log('useAuth: Using test role:', testRole);
      setUserRole(testRole as UserRole);
      setLoading(false);
      // Set a dummy user for testing
      setUser({ id: 'test-user', email: 'test@example.com' } as User);
      return;
    }

    // Check if current path is processor route and default to processor
    const currentPath = window.location.pathname;
    console.log('useAuth: Current path:', currentPath);
    if (currentPath.includes('/processor') || currentPath.includes('/listings') ||
      currentPath.includes('/analytics') || currentPath.includes('/iot-devices') ||
      currentPath.includes('/transactions') || currentPath.includes('/exports') ||
      currentPath.includes('/byproducts/')) {
      console.log('useAuth: Detected processor route, defaulting to processor role');
      setUserRole('processor');
      setLoading(false);
      setUser({ id: 'processor-user-id', email: 'processor@example.com' } as User);
      return;
    }

    // Check localStorage for stored user data
    try {
      const storedRole = localStorage.getItem('userRole');
      const storedUserData = localStorage.getItem('userData');

      console.log('useAuth: Stored role from localStorage:', storedRole);
      console.log('useAuth: Stored user data from localStorage:', storedUserData);

      if (storedRole && ['farmer', 'processor', 'buyer', 'fpo'].includes(storedRole)) {
        setUserRole(storedRole as UserRole);

        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser({
            id: 'stored-user-id',
            email: userData.email,
            user_metadata: {
              full_name: userData.fullName,
              phone: userData.phone,
              location: userData.location
            }
          } as User);
        } else {
          setUser({ id: 'stored-user-id', email: 'stored@example.com' } as User);
        }

        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('Error reading stored auth data:', error);
    }

    // Check URL parameters for role (for direct access)
    const urlParams = new URLSearchParams(window.location.search);
    const urlRole = urlParams.get('role');
    console.log('useAuth: URL role parameter:', urlRole);
    if (urlRole && ['farmer', 'processor', 'buyer', 'fpo'].includes(urlRole)) {
      console.log('useAuth: Using URL role:', urlRole);
      setUserRole(urlRole as UserRole);
      setLoading(false);
      setUser({ id: 'url-user-id', email: 'url@example.com' } as User);
      return;
    }

    // Default to processor role for processor routes, otherwise farmer
    if (currentPath.includes('/processor')) {
      console.log('useAuth: Defaulting to processor role for processor route');
      setUserRole('processor');
    } else {
      console.log('useAuth: Defaulting to farmer role for direct access');
      setUserRole('farmer');
    }
    setLoading(false);
    setUser({ id: 'default-user-id', email: 'default@example.com' } as User);
  }, []);

  const signOut = async () => {
    // Clear all stored data
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    delete (window as any).testUserRole;
    delete (window as any).tempUserRole;
    delete (window as any).storedUserRole;

    setUser(null);
    setSession(null);
    setUserRole(null);
    navigate('/auth');
  };

  // Add global test function for manual role setting
  (window as any).setProcessorRole = () => {
    console.log('Setting processor role manually...');
    setUserRole('processor');
    setUser({ id: 'processor-user-id', email: 'processor@example.com' } as User);
    localStorage.setItem('userRole', 'processor');
    console.log('Processor role set successfully!');
  };

  return { user, session, userRole, loading, signOut };
};
