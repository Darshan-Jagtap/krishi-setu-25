// Gemini AI Image Analysis Service
// Uses Google Gemini API to analyze oilseed by-product images

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ImageAnalysisResult {
  productType: string;
  quality: "excellent" | "good" | "fair" | "poor";
  freshness: number; // 0-100
  defects: string[];
  estimatedWeight: number;
  recommendations: string[];
  priceRecommendation: {
    recommendedPrice: number;
    minPrice: number;
    maxPrice: number;
    confidence: number;
    factors: string[];
  };
}

class GeminiImageService {
  private client: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Convert file to base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  }

  /**
   * Analyze oilseed by-product image using Gemini
   */
  async analyzeOilseedImage(imageFile: File): Promise<ImageAnalysisResult> {
    try {
      const base64Image = await this.fileToBase64(imageFile);
      const mimeType = imageFile.type || "image/jpeg";

      const prompt = `You are an expert agricultural analyst specializing in oilseed by-products quality assessment.

Analyze this image of an oilseed by-product and provide a detailed assessment in JSON format:

{
  "productType": "identify the oilseed by-product (e.g., Mustard Cake, Soybean Meal, Sunflower Meal, Groundnut Shell, Coconut Cake)",
  "quality": "rate as excellent/good/fair/poor based on appearance, color, texture, and visible defects",
  "freshness": "score 0-100 based on color vibrancy, moisture appearance, and signs of degradation",
  "defects": ["list any visible defects like discoloration, mold, moisture damage, contamination, etc."],
  "estimatedWeight": "estimate weight in kg based on volume and density",
  "recommendations": ["provide 2-3 specific recommendations for storage, handling, or quality improvement"],
  "priceFactors": {
    "qualityMultiplier": "1.15 for excellent, 1.08 for good, 0.95 for fair, 0.85 for poor",
    "freshnessBonus": "bonus percentage based on freshness score (0-10%)",
    "defectPenalty": "penalty percentage for each defect (-5% per defect)",
    "marketDemand": "current market demand level (high/medium/low)",
    "seasonalAdjustment": "seasonal price adjustment factor"
  }
}

Be specific and accurate in your assessment. Focus on factors that affect market price.`;

      const response = await this.model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ]);

      const responseText = response.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error("Could not parse Gemini response");
      }

      const analysisData = JSON.parse(jsonMatch[0]);
      const priceRecommendation = this.calculatePriceRecommendation(analysisData);

      return {
        productType: analysisData.productType,
        quality: analysisData.quality,
        freshness: analysisData.freshness,
        defects: analysisData.defects,
        estimatedWeight: analysisData.estimatedWeight,
        recommendations: analysisData.recommendations,
        priceRecommendation,
      };
    } catch (error) {
      console.error("Gemini image analysis error:", error);
      throw error;
    }
  }

  /**
   * Calculate price recommendation based on analysis
   */
  private calculatePriceRecommendation(analysisData: any) {
    // Base prices for oilseed by-products
    const basePrices: { [key: string]: number } = {
      "mustard cake": 2500,
      "soybean meal": 3200,
      "sunflower meal": 2800,
      "groundnut shell": 1500,
      "coconut cake": 3500,
    };

    const productType = analysisData.productType.toLowerCase();
    let basePrice = basePrices[productType] || 2500;

    const factors: string[] = [];
    let confidence = 0.75;

    // Quality adjustment
    const qualityMultiplier = analysisData.priceFactors?.qualityMultiplier || 1.0;
    basePrice *= qualityMultiplier;
    
    if (analysisData.quality === "excellent") {
      factors.push("Excellent quality detected (+15%)");
    } else if (analysisData.quality === "good") {
      factors.push("Good quality detected (+8%)");
    } else if (analysisData.quality === "fair") {
      factors.push("Fair quality detected (-5%)");
    } else if (analysisData.quality === "poor") {
      factors.push("Poor quality detected (-15%)");
    }

    // Freshness bonus
    const freshnessBonus = (analysisData.freshness / 100) * 0.1; // Max 10% bonus
    basePrice *= (1 + freshnessBonus);
    if (analysisData.freshness > 85) {
      factors.push(`High freshness bonus (+${(freshnessBonus * 100).toFixed(1)}%)`);
      confidence += 0.1;
    }

    // Defect penalties
    if (analysisData.defects && analysisData.defects.length > 0) {
      const defectPenalty = analysisData.defects.length * 0.05;
      basePrice *= (1 - defectPenalty);
      factors.push(`${analysisData.defects.length} defects detected (-${(defectPenalty * 100).toFixed(1)}%)`);
    }

    // Market demand adjustment
    const demandMultiplier = analysisData.priceFactors?.marketDemand === "high" ? 1.1 : 1.0;
    basePrice *= demandMultiplier;
    if (demandMultiplier > 1) {
      factors.push("High market demand (+10%)");
    }

    // Seasonal adjustment
    const seasonalFactor = analysisData.priceFactors?.seasonalAdjustment || 1.0;
    basePrice *= seasonalFactor;

    const recommendedPrice = Math.round(basePrice);
    const minPrice = Math.round(recommendedPrice * 0.9);
    const maxPrice = Math.round(recommendedPrice * 1.15);

    return {
      recommendedPrice,
      minPrice,
      maxPrice,
      confidence: Math.min(confidence, 0.95),
      factors,
    };
  }

  /**
   * Get market insights for a specific by-product
   */
  async getMarketInsights(productType: string): Promise<any> {
    try {
      const prompt = `Provide current market insights for ${productType} in the Indian agricultural market:
      
      Return JSON with:
      {
        "currentMarketPrice": "average price in INR per kg",
        "demandLevel": "high/medium/low",
        "seasonalTrend": "current seasonal trend",
        "storageRecommendations": ["list of storage tips"],
        "qualityStandards": ["list of quality parameters"],
        "marketOutlook": "3-6 month market outlook"
      }`;

      const response = await this.model.generateContent(prompt);
      const responseText = response.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error("Error getting market insights:", error);
      throw error;
    }
  }
}

// Initialize with API key from environment
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "VITE_GEMINI_API_KEY not found in environment variables. Image analysis will not work."
  );
}

export const geminiImageService = apiKey
  ? new GeminiImageService(apiKey)
  : null;
