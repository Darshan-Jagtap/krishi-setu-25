import { Tractor, Droplet, Sprout, Wheat, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Tractor,
      title: t('features.cultivation.title'),
      description: t('features.cultivation.description')
    },
    {
      icon: Droplet,
      title: t('features.processing.title'),
      description: t('features.processing.description')
    },
    {
      icon: Sprout,
      title: t('features.varieties.title'),
      description: t('features.varieties.description')
    },
    {
      icon: Wheat,
      title: t('features.quality.title'),
      description: t('features.quality.description')
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border bg-card animate-fade-in hover-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8">
                  <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                    <ArrowRight className="w-5 h-5 text-primary-foreground" />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
