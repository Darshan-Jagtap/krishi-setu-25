import React from "react";
import { cn } from "@/lib/utils";

interface QualityMeterProps {
  label: string;
  score: number;
  rating: string;
  description?: string;
}

export const QualityMeter: React.FC<QualityMeterProps> = ({
  label,
  score,
  rating,
  description,
}) => {
  const getColorClass = (score: number) => {
    if (score >= 80) return "bg-quality-excellent";
    if (score >= 60) return "bg-quality-good";
    if (score >= 40) return "bg-quality-fair";
    return "bg-quality-poor";
  };

  const getGradient = (score: number) => {
    if (score >= 80) return "from-quality-excellent to-quality-good";
    if (score >= 60) return "from-quality-good to-quality-fair";
    if (score >= 40) return "from-quality-fair to-quality-poor";
    return "from-quality-poor to-destructive";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            score >= 80 && "quality-excellent",
            score >= 60 && score < 80 && "quality-good",
            score >= 40 && score < 60 && "quality-fair",
            score < 40 && "quality-poor"
          )}>
            {rating}
          </span>
          <span className="text-sm font-semibold text-foreground">{score}%</span>
        </div>
      </div>
      
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            `bg-gradient-to-r ${getGradient(score)}`
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
