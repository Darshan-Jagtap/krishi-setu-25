import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import GovernmentSchemes from "@/components/GovernmentSchemes";
import ProfessionalIndiaMap from "@/components/ProfessionalIndiaMap";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Stats />
      <Services />
      <GovernmentSchemes />

      {/* Oilseed Industry Map Section */}
      <section className="py-16 bg-gradient-to-b from-background to-green-50/30">
        <div className="container mx-auto px-4">
          <ProfessionalIndiaMap />
        </div>
      </section>

      <footer className="bg-card border-t border-border py-12 animate-fade-in">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-lg">{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
