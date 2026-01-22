import { ArrowRight, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  category: string;
  description: string;
  image: string;
}

const ServiceCard = ({ icon: Icon, title, category, description, image }: ServiceCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 animate-scale-in hover-scale">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{category}</span>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
        <button className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
