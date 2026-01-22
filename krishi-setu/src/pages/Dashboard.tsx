import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Package,
  TrendingUp,
  Loader2,
  Sparkles,
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  Clock,
  BarChart3,
  Image as ImageIcon,
  Leaf
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import TransactionCard from "@/components/TransactionCard";
import StatCard from "@/components/StatCard";
import ActivityFeed from "@/components/ActivityFeed";
import QuickActions from "@/components/QuickActions";
import RevenueChart from "@/components/RevenueChart";
import FarmerDashboard from "@/components/dashboards/FarmerDashboardEnhanced";
import BuyerDashboard from "@/components/dashboards/BuyerDashboard";
import ProcessorDashboard from "@/components/dashboards/ProcessorDashboard";
import FPODashboard from "@/components/dashboards/FPODashboard";
import AIImageAnalytics from "@/components/AIImageAnalytics";
import { mlPriceService } from "@/services/mlPriceService";
import { Badge } from "@/components/ui/badge";

const priceData = [
  { date: "Nov 1", price: 28 },
  { date: "Nov 2", price: 32 },
  { date: "Nov 3", price: 29 },
  { date: "Nov 4", price: 35 },
  { date: "Nov 5", price: 31 },
  { date: "Nov 6", price: 38 },
  { date: "Nov 7", price: 34 },
];

// Generate sample revenue data
const generateRevenueData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 5000) + 2000,
      transactions: Math.floor(Math.random() * 20) + 5
    });
  }
  return data;
};

const Dashboard = () => {
  const { toast } = useToast();
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<string>("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [revenueData] = useState(generateRevenueData());

  // Check for URL parameter-based role testing
  useEffect(() => {
    console.log('Dashboard: Checking URL parameters...');
    const urlParams = new URLSearchParams(window.location.search);
    const testRole = urlParams.get('role');
    console.log('Dashboard: URL role parameter:', testRole);

    if (testRole && ['farmer', 'processor', 'buyer', 'fpo'].includes(testRole)) {
      console.log('Dashboard: Setting role from URL parameter:', testRole);
      (window as any).testUserRole = testRole;
      // Remove the parameter from URL
      window.history.replaceState({}, '', window.location.pathname);
      console.log('Dashboard: Role set, reloading...');
      // Reload to apply the role
      window.location.reload();
    } else {
      console.log('Dashboard: No valid role parameter found');
    }
  }, []);

  // Redirect processor users to processor dashboard
  useEffect(() => {
    if (userRole === 'processor' && !loading) {
      console.log('Dashboard: Processor user detected, redirecting to processor dashboard');
      window.location.href = '/processor';
    }
  }, [userRole, loading]);

  // Redirect FPO users to FPO dashboard
  useEffect(() => {
    if (userRole === 'fpo' && !loading) {
      console.log('Dashboard: FPO user detected, redirecting to FPO dashboard');
      window.location.href = '/fpo';
    }
  }, [userRole, loading]);

  // Debug: Show current state
  useEffect(() => {
    console.log('Dashboard: Current state:', {
      loading,
      user: user?.id,
      userRole,
      testUserRole: (window as any).testUserRole,
      tempUserRole: (window as any).tempUserRole
    });
  }, [loading, user, userRole]);

  // Dashboard now just routes to role-specific dashboards
  // No need for data fetching here

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!user) return null;

  // Show role-specific dashboards
  if (userRole === 'farmer') {
    return (
      <DashboardLayout>
        <FarmerDashboard />
      </DashboardLayout>
    );
  }

  if (userRole === 'buyer') {
    return (
      <DashboardLayout>
        <BuyerDashboard />
      </DashboardLayout>
    );
  }

  if (userRole === 'processor') {
    return (
      <DashboardLayout>
        <ProcessorDashboard />
      </DashboardLayout>
    );
  }

  if (userRole === 'fpo') {
    return (
      <DashboardLayout>
        <FPODashboard />
      </DashboardLayout>
    );
  }

  // If no role is found, show a loading state with more info and testing options
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">Loading your dashboard...</p>
        <div className="text-xs text-muted-foreground max-w-md mx-auto mb-4">
          {loading ? 'Fetching user information...' : user ? 'No role found for user. Please contact support or select a role below for testing.' : 'Please sign in to continue.'}
        </div>
        {!loading && user && (
          <div className="space-y-2">
            <p className="text-sm font-medium mb-2">Select Role for Testing:</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  localStorage.setItem('userRole', 'farmer');
                  window.location.reload();
                }}
                variant="outline"
                size="sm"
              >
                Farmer
              </Button>
              <Button
                onClick={() => {
                  localStorage.setItem('userRole', 'processor');
                  window.location.reload();
                }}
                variant="default"
                size="sm"
              >
                Processor
              </Button>
              <Button
                onClick={() => {
                  localStorage.setItem('userRole', 'buyer');
                  window.location.reload();
                }}
                variant="outline"
                size="sm"
              >
                Buyer
              </Button>
              <Button
                onClick={() => {
                  localStorage.setItem('userRole', 'fpo');
                  window.location.reload();
                }}
                variant="outline"
                size="sm"
              >
                FPO
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Or run: <code className="bg-gray-100 px-1 rounded">setProcessorRole()</code> in browser console
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
