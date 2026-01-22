import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-farm.jpg";
import oilseedImage from "@/assets/oilseed-types.jpg";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.3)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)'
        }}
      />

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <div className="inline-block px-6 py-2 mb-6 rounded-full border border-primary-foreground/30 backdrop-blur-sm animate-scale-in">
              <span className="text-primary-foreground/90 font-medium tracking-wide">{t('hero.badge')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button size="lg" asChild className="text-lg hover-scale">
                <Link to="/auth">
                  {t('hero.getStarted')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg hover-scale">
                <Link to="/auth">
                  {t('hero.signIn')}
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <img
              src={heroImage}
              alt={t('hero.imageAlt')}
              className="rounded-2xl shadow-2xl w-full hover-scale"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
