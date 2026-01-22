import { Tractor, Apple, Sprout } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { useTranslation } from "react-i18next";
import farmerTechImage from "@/assets/IndianFarmer.jpg";
import heroImage from "@/assets/hero-farm.jpg";
import marketaImage from "@/assets/marketa.jpg";

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Tractor,
      title: t('services.marketAnalysis.title'),
      category: t('services.marketAnalysis.category'),
      description: t('services.marketAnalysis.description'),
      image: marketaImage
    },
    {
      icon: Apple,
      title: t('services.tradingPlatform.title'),
      category: t('services.tradingPlatform.category'),
      description: t('services.tradingPlatform.description'),
      image: farmerTechImage
    },
    {
      icon: Sprout,
      title: t('services.qualityStandards.title'),
      category: t('services.qualityStandards.category'),
      description: t('services.qualityStandards.description'),
      image: heroImage
    }
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary-foreground/50"></div>
              <span className="text-sm font-medium text-primary-foreground/90 uppercase tracking-wide">{t('services.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              {t('services.title')}
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="w-12 h-12 rounded-lg border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
              ←
            </button>
            <button className="w-12 h-12 rounded-lg border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
              →
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
