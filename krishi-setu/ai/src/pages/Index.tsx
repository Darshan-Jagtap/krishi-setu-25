import React, { useState } from "react";
import { Leaf, Sparkles } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

const Index = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SeedAnalysis | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (base64: string) => {
    setImageBase64(base64);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      toast({
        title: "No image selected",
        description: "Please upload a seed image first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-seed", {
        body: { imageBase64 },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: `Identified: ${data.analysis.seedType} with ${data.analysis.quality.overallScore}% quality score.`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-xl bg-gradient-earth flex items-center justify-center shadow-soft">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div> */}
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                KRISHI-SETU
              </h1>
              {/* <p className="text-xs text-muted-foreground">
                Seed Quality Analysis & Market Pricing
              </p> */}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 animate-fade-in">
            Analyze Seed Quality with{" "}
            <span className="text-gradient-earth">AI Precision</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
            Upload an image of your seeds to instantly get quality analysis, 
            grading, and real-time market price predictions for the Indian market.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <ImageUpload 
              onImageSelect={handleImageSelect} 
              isAnalyzing={isAnalyzing} 
            />
            
            {imageBase64 && !isAnalyzing && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={handleAnalyze}
                  className="animate-scale-in"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze Seed Quality
                </Button>
              </div>
            )}
          </section>

          {/* Results Section */}
          {analysis && (
            <section>
              <AnalysisResult analysis={analysis} />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Powered by AI • Seed quality analysis and market predictions for India
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
