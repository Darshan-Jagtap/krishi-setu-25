import React from "react";
import { NavLink } from "@/components/NavLink";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Globe,
  Settings,
  Heart,
  Users,
  BarChart3,
  TrendingUp,
  FileText,
  Truck,
  CreditCard,
  Bell,
  DollarSign
} from "lucide-react";
import krishisetuLogo from "@/assets/krishisetu.png";

const DashboardSidebar = () => {
  const { userRole } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // Check if we're on a buyer page based on route only
  const isBuyerPage = location.pathname.startsWith('/buyer');

  // Buyer-specific menu items
  const buyerMenuItems = [
    { icon: LayoutDashboard, label: t('navigation.dashboard'), path: "/buyer-dashboard" },
    { icon: ShoppingCart, label: t('navigation.marketplace'), path: "/marketplace" },
    { icon: Package, label: t('navigation.orders'), path: "/buyer-orders" },
    { icon: Users, label: t('navigation.suppliers'), path: "/buyer-suppliers" },
    { icon: BarChart3, label: t('navigation.analytics'), path: "/buyer-analytics" },
    { icon: Heart, label: t('navigation.favorites'), path: "/buyer-favorites" },
    { icon: Bell, label: t('navigation.notifications'), path: "/buyer-notifications" },
    { icon: Settings, label: t('navigation.settings'), path: "/settings" },
  ];

  // FPO-specific menu items
  const fpoMenuItems = [
    { icon: LayoutDashboard, label: t('navigation.dashboard'), path: "/fpo" },
    { icon: ShoppingCart, label: t('navigation.marketplace'), path: "/marketplace" },
    { icon: Package, label: t('navigation.listings'), path: "/fpo-listings" },
    { icon: Receipt, label: t('navigation.transactions'), path: "/fpo-transactions" },
    { icon: Globe, label: t('navigation.exports'), path: "/fpo-exports" },
    { icon: Users, label: t('navigation.members'), path: "/fpo-members" },
    { icon: BarChart3, label: t('navigation.analytics'), path: "/fpo-analytics" },
    { icon: DollarSign, label: t('navigation.payments'), path: "/fpo-payments" },
    { icon: Settings, label: t('navigation.settings'), path: "/settings" },
  ];

  // Default menu items (for farmers and processors) - Carbon Credits removed
  const defaultMenuItems = [
    {
      icon: LayoutDashboard,
      label: t('navigation.dashboard'),
      path: userRole === 'processor' ? "/processor" : "/dashboard"
    },
    { icon: ShoppingCart, label: t('navigation.marketplace'), path: "/marketplace" },
    {
      icon: Package,
      label: t('navigation.listings'),
      path: userRole === 'processor' ? "/listings" : "/farmer-listings"
    },
    {
      icon: Receipt,
      label: t('navigation.transactions'),
      path: userRole === 'processor' ? "/transactions" : "/farmer-transactions"
    },
    {
      icon: Globe,
      label: t('navigation.exports'),
      path: userRole === 'processor' ? "/exports" : "/farmer-exports"
    },
    { icon: Settings, label: t('navigation.settings'), path: "/settings" },
  ];

  // Select menu items based on current page and role
  const isFPOPage = userRole === 'fpo' && !isBuyerPage;
  const menuItems = isBuyerPage ? buyerMenuItems : isFPOPage ? fpoMenuItems : defaultMenuItems;

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border fixed left-0 top-0 z-40 flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2 hover-scale">
          <img src={krishisetuLogo} alt="KRISHI-SETU Logo" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h2 className="font-bold text-lg text-foreground">KRISHI-SETU</h2>
            <p className="text-xs text-muted-foreground">
              {isBuyerPage ? t('sidebar.buyerPortal') : userRole === 'fpo' ? t('sidebar.fpoPortal') : t('sidebar.smartMarketplace')}
            </p>
          </div>
        </Link>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">
          {isBuyerPage ? t('sidebar.buyerMenu') : userRole === 'fpo' ? t('sidebar.fpoMenu') : t('sidebar.platformMenu')}
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                activeClassName="bg-primary text-primary-foreground hover:bg-primary"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {isBuyerPage && (
          <>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">
                {t('dashboard.quickActions')}
              </div>
              <div className="space-y-2 px-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('dashboard.activeListings')}</span>
                  <span className="font-semibold text-primary">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('navigation.favorites')}</span>
                  <span className="font-semibold text-primary">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('navigation.suppliers')}</span>
                  <span className="font-semibold text-primary">3</span>
                </div>
              </div>
            </div>

            <div className="mt-6 mx-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">{t('sidebar.marketAlert')}</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {t('sidebar.marketAlertMessage')}
              </p>
            </div>
          </>
        )}
      </nav>

      {/* Language Switcher at bottom */}
      <div className="p-4 border-t border-border">
        <div className="text-xs font-semibold text-muted-foreground mb-2">
          {t('settings.language')}
        </div>
        <LanguageSwitcher />
      </div>
    </aside>
  );
};

export default DashboardSidebar;
