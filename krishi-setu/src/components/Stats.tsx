import farmerTechImage from "@/assets/IndianFarmer.jpg";
import { Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative animate-fade-in">
            <img
              src={farmerTechImage}
              alt={t('stats.imageAlt')}
              className="rounded-3xl shadow-2xl w-full hover-scale"
            />
            <button className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-card shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-accent" />
              </div>
            </button>
          </div>

          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('stats.badge')}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {t('stats.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('stats.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
