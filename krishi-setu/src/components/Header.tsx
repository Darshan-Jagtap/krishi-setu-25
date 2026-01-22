import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import krishisetuLogo from "@/assets/krishisetu.png";

const Header = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm animate-fade-in">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover-scale">
          <img src={krishisetuLogo} alt="KRISHI-SETU Logo" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-2xl font-bold text-foreground">KRISHI-SETU</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {/* Navigation removed as requested */}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>

          {user ? (
            <Button asChild variant="outline">
              <Link to="/auth">{t('auth.signIn')}</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/auth">{t('auth.signIn')}</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/auth">{t('common.welcome')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
