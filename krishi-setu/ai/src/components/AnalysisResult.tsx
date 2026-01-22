import React from "react";
import { 
  Leaf, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MapPin,
  Droplets,
  AlertCircle,
  CheckCircle2,
  Info
} from "lucide-react";
import { QualityMeter } from "./QualityMeter";
import { cn } from "@/lib/utils";

interface SeedAnalysis {
  seedType: string;
  scientificName?: string;
  quality: {
    overallGrade: string;
    overallScore: number;
    size: { rating: string; score: number; description: string };
    color: { rating: string; score: number; description: string };
    texture: { rating: string; score: number; description: string };
    brokenSeeds: { percentage: number; impact: string };
    moisture?: { estimated: string; notes: string };
  };
  marketAnalysis: {
    currentPriceRange: { min: number; max: number; average: number };
    priceFactors: string[];
    marketTrend: string;
    bestSellingStates: string[];
    seasonalNotes?: string;
  };
  recommendations: string[];
  confidence: number;
}

interface AnalysisResultProps {
  analysis: SeedAnalysis;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case "rising":
        return <TrendingUp className="w-5 h-5 text-quality-excellent" />;
      case "declining":
        return <TrendingDown className="w-5 h-5 text-quality-poor" />;
      default:
        return <Minus className="w-5 h-5 text-quality-fair" />;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case "excellent":
        return "quality-excellent";
      case "good":
        return "quality-good";
      case "fair":
        return "quality-fair";
      default:
        return "quality-poor";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-gradient-card rounded-2xl p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-earth flex items-center justify-center shadow-soft">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                {analysis.seedType}
              </h2>
              {analysis.scientificName && (
                <p className="text-sm text-muted-foreground italic">
                  {analysis.scientificName}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-4 py-2 rounded-xl text-lg font-bold",
              getGradeColor(analysis.quality.overallGrade)
            )}>
              {analysis.quality.overallGrade}
            </span>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">
                {analysis.quality.overallScore}%
              </p>
              <p className="text-xs text-muted-foreground">Quality Score</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" />
          <span>Analysis confidence: {analysis.confidence}%</span>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-display font-semibold text-foreground mb-6">
          Quality Analysis
        </h3>
        
        <div className="space-y-5">
          <QualityMeter
            label="Size Uniformity"
            score={analysis.quality.size.score}
            rating={analysis.quality.size.rating}
            description={analysis.quality.size.description}
          />
          <QualityMeter
            label="Color Quality"
            score={analysis.quality.color.score}
            rating={analysis.quality.color.rating}
            description={analysis.quality.color.description}
          />
          <QualityMeter
            label="Surface Texture"
            score={analysis.quality.texture.score}
            rating={analysis.quality.texture.rating}
            description={analysis.quality.texture.description}
          />
        </div>

        {/* Broken Seeds & Moisture */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className={cn(
                "w-5 h-5",
                analysis.quality.brokenSeeds.percentage < 5 
                  ? "text-quality-excellent" 
                  : analysis.quality.brokenSeeds.percentage < 15 
                    ? "text-quality-fair" 
                    : "text-quality-poor"
              )} />
              <span className="font-medium text-foreground">Broken Seeds</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {analysis.quality.brokenSeeds.percentage}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {analysis.quality.brokenSeeds.impact}
            </p>
          </div>

          {analysis.quality.moisture && (
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Moisture Level</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {analysis.quality.moisture.estimated}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {analysis.quality.moisture.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Market Price Analysis */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-display font-semibold text-foreground mb-6">
          Indian Market Price Analysis
        </h3>
        
        <div className="bg-gradient-golden rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-foreground" />
              <span className="font-medium text-foreground">Price Range (per kg)</span>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(analysis.marketAnalysis.marketTrend)}
              <span className="text-sm font-medium text-foreground">
                {analysis.marketAnalysis.marketTrend}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-foreground/70">Min</p>
              <p className="text-xl font-bold text-foreground">
                ₹{analysis.marketAnalysis.currentPriceRange.min}
              </p>
            </div>
            <div className="border-x border-foreground/20">
              <p className="text-sm text-foreground/70">Average</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{analysis.marketAnalysis.currentPriceRange.average}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/70">Max</p>
              <p className="text-xl font-bold text-foreground">
                ₹{analysis.marketAnalysis.currentPriceRange.max}
              </p>
            </div>
          </div>
        </div>

        {/* Price Factors */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Price Factors</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.marketAnalysis.priceFactors.map((factor, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>

        {/* Best Selling States */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-medium text-foreground">High Demand States</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.marketAnalysis.bestSellingStates.map((state, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {state}
              </span>
            ))}
          </div>
        </div>

        {analysis.marketAnalysis.seasonalNotes && (
          <p className="text-sm text-muted-foreground italic">
            📅 {analysis.marketAnalysis.seasonalNotes}
          </p>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">
          Recommendations
        </h3>
        <ul className="space-y-3">
          {analysis.recommendations.map((rec, index) => (
            <li 
              key={index}
              className="flex items-start gap-3 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
