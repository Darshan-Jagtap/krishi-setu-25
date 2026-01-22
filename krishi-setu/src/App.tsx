import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n/config"; // Initialize i18n
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import PaymentFlow from "./pages/PaymentFlow";
import CarbonCredits from "./pages/CarbonCredits";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ByproductPage from "./pages/ByproductPage";
import ProcessorListings from "./pages/ProcessorListings";
import ProcessorTransactions from "./pages/ProcessorTransactions";
import ProcessorExportOpportunities from "./pages/ProcessorExportOpportunities";
import FarmerDashboard from "./components/dashboards/FarmerDashboardEnhanced";
import BuyerDashboard from "./components/dashboards/BuyerDashboard";
import ProcessorDashboard from "./components/dashboards/ProcessorDashboard";
import DashboardLayout from "./components/DashboardLayout";
import NewBuyerDashboard from "./pages/BuyerDashboard";
import BuyerOrders from "./pages/BuyerOrders";
import BuyerSuppliers from "./pages/BuyerSuppliers";
import BuyerAnalytics from "./pages/BuyerAnalytics";
import BuyerFavorites from "./pages/BuyerFavorites";
import BuyerNotifications from "./pages/BuyerNotifications";
import FarmerListings from "./pages/FarmerListings";
import FarmerTransactions from "./pages/FarmerTransactions";
import FarmerExportOpportunities from "./pages/FarmerExportOpportunities";
import FPODashboard from "./components/dashboards/FPODashboard";
import FPOListings from "./pages/FPOListings";
import FPOTransactions from "./pages/FPOTransactions";
import FPOExportOpportunities from "./pages/FPOExportOpportunities";
import FPOMembers from "./pages/FPOMembers";
import FPOMemberAnalytics from "./pages/FPOMemberAnalytics";
import FPOPaymentDistribution from "./pages/FPOPaymentDistribution";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Direct access routes for each dashboard */}
          <Route path="/processor" element={<DashboardLayout><ProcessorDashboard /></DashboardLayout>} />
          <Route path="/processor-dashboard" element={<DashboardLayout><ProcessorDashboard /></DashboardLayout>} />
          <Route path="/buyer" element={<Marketplace />} />
          <Route path="/buyer-dashboard" element={<NewBuyerDashboard />} />
          <Route path="/buyer-orders" element={<BuyerOrders />} />
          <Route path="/buyer-suppliers" element={<BuyerSuppliers />} />
          <Route path="/buyer-analytics" element={<BuyerAnalytics />} />
          <Route path="/buyer-favorites" element={<BuyerFavorites />} />
          <Route path="/buyer-notifications" element={<BuyerNotifications />} />

          {/* Farmer Routes */}
          <Route path="/farmer-listings" element={<FarmerListings />} />
          <Route path="/farmer-transactions" element={<FarmerTransactions />} />
          <Route path="/farmer-exports" element={<FarmerExportOpportunities />} />

          <Route path="/farmer" element={<DashboardLayout><FarmerDashboard /></DashboardLayout>} />

          {/* FPO Routes */}
          <Route path="/fpo" element={<DashboardLayout><FPODashboard /></DashboardLayout>} />
          <Route path="/fpo-listings" element={<FPOListings />} />
          <Route path="/fpo-transactions" element={<FPOTransactions />} />
          <Route path="/fpo-exports" element={<FPOExportOpportunities />} />
          <Route path="/fpo-members" element={<FPOMembers />} />
          <Route path="/fpo-analytics" element={<FPOMemberAnalytics />} />
          <Route path="/fpo-payments" element={<FPOPaymentDistribution />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/payment-flow" element={<PaymentFlow />} />
          <Route path="/carbon-credits" element={<CarbonCredits />} />
          <Route path="/settings" element={<Settings />} />

          {/* Role-specific Routes */}
          <Route path="/listings" element={<DashboardLayout><ProcessorListings /></DashboardLayout>} />
          <Route path="/transactions" element={<DashboardLayout><ProcessorTransactions /></DashboardLayout>} />
          <Route path="/exports" element={<DashboardLayout><ProcessorExportOpportunities /></DashboardLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
