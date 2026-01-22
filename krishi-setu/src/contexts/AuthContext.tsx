import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'farmer' | 'processor' | 'buyer';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.getCurrentUser();
        if (response.user) {
          setUser(response.user);
          setUserRole(response.user.role as UserRole);
        } else {
          localStorage.removeItem('token');
          setUser(null);
          setUserRole(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setUserRole(response.user.role as UserRole);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const response = await authAPI.register({
        email,
        password,
        full_name: fullName,
        role
      });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setUserRole(response.user.role as UserRole);
      toast({
        title: "Account created!",
        description: "Welcome to KRISHI-SETU Marketplace.",
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserRole(null);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
