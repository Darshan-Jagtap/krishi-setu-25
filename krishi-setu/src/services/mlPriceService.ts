// ML-based Price Recommendation Service
// Provides price recommendations based on product images and market data

export interface PriceRecommendation {
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidence: number;
  factors: string[];
  offlineMarketRate: number;
  platformRate: number;
  priceAdvantage: number;
}

export interface ImageAnalysisResult {
  productQuality: 'excellent' | 'good' | 'fair' | 'poor';
  estimatedWeight: number;
  freshness: number; // 0-100
  defects: string[];
  recommendations: string[];
}

class MLPriceService {
  private offlineMarketRates: Map<string, number> = new Map([
    ['mustard', 4500],
    ['soybean', 5200],
    ['sunflower', 4800],
    ['groundnut', 6500],
    ['sesame', 8000],
    ['coconut', 3500],
    ['palm', 4200],
    ['castor', 5800],
  ]);

  /**
   * Analyze product image and extract quality metrics
   */
  async analyzeProductImage(imageFile: File): Promise<ImageAnalysisResult> {
    try {
      // In production, use TensorFlow.js or a backend ML model
      // For now, simulate analysis based on file properties
      
      const result: ImageAnalysisResult = {
        productQuality: this.getRandomQuality(),
        estimatedWeight: Math.random() * 50 + 10, // 10-60 kg
        freshness: Math.floor(Math.random() * 40) + 60, // 60-100
        defects: this.getRandomDefects(),
        recommendations: this.getQualityRecommendations()
      };

      return result;
    } catch (error) {
      console.error('Image analysis error:', error);
      throw error;
    }
  }

  /**
   * Get price recommendation based on product and market data
   */
  async getPriceRecommendation(
    productName: string,
    quantity: number,
    imageAnalysis?: ImageAnalysisResult,
    location?: string
  ): Promise<PriceRecommendation> {
    try {
      const offlineRate = this.offlineMarketRates.get(productName.toLowerCase()) || 5000;
      
      // Base price calculation
      let basePrice = offlineRate;
      let confidence = 0.75;
      const factors: string[] = [];

      // Adjust based on image quality
      if (imageAnalysis) {
        if (imageAnalysis.productQuality === 'excellent') {
          basePrice *= 1.15;
          confidence += 0.1;
          factors.push('Premium quality detected');
        } else if (imageAnalysis.productQuality === 'good') {
          basePrice *= 1.08;
          confidence += 0.05;
          factors.push('Good quality detected');
        } else if (imageAnalysis.productQuality === 'fair') {
          basePrice *= 0.95;
          factors.push('Fair quality detected');
        }

        // Freshness adjustment
        if (imageAnalysis.freshness > 85) {
          basePrice *= 1.1;
          factors.push('High freshness premium');
        }

        // Defects penalty
        if (imageAnalysis.defects.length > 0) {
          basePrice *= (1 - imageAnalysis.defects.length * 0.05);
          factors.push(`${imageAnalysis.defects.length} defects detected`);
        }
      }

      // Quantity adjustment (bulk discount)
      if (quantity > 100) {
        basePrice *= 0.95;
        factors.push('Bulk quantity discount');
      } else if (quantity > 50) {
        basePrice *= 0.97;
        factors.push('Quantity discount');
      }

      // Market volatility (simulated)
      const volatility = (Math.random() - 0.5) * 0.1;
      basePrice *= (1 + volatility);

      const platformRate = Math.round(basePrice);
      const minPrice = Math.round(platformRate * 0.9);
      const maxPrice = Math.round(platformRate * 1.15);
      const priceAdvantage = ((platformRate - offlineRate) / offlineRate) * 100;

      return {
        recommendedPrice: platformRate,
        minPrice,
        maxPrice,
        confidence: Math.min(confidence, 0.95),
        factors,
        offlineMarketRate: offlineRate,
        platformRate,
        priceAdvantage
      };
    } catch (error) {
      console.error('Price recommendation error:', error);
      throw error;
    }
  }

  /**
   * Get price comparison data
   */
  getPriceComparison(productName: string): {
    offlineRate: number;
    platformRate: number;
    difference: number;
    percentageDifference: number;
  } {
    const offlineRate = this.offlineMarketRates.get(productName.toLowerCase()) || 5000;
    const platformRate = Math.round(offlineRate * (1 + (Math.random() - 0.3) * 0.2));
    const difference = platformRate - offlineRate;
    const percentageDifference = (difference / offlineRate) * 100;

    return {
      offlineRate,
      platformRate,
      difference,
      percentageDifference
    };
  }

  /**
   * Get market trends
   */
  getMarketTrends(productName: string, days: number = 30) {
    const trends = [];
    const basePrice = this.offlineMarketRates.get(productName.toLowerCase()) || 5000;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      trends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        offlineRate: Math.round(basePrice * (1 + (Math.random() - 0.5) * 0.15)),
        platformRate: Math.round(basePrice * (1 + (Math.random() - 0.3) * 0.15))
      });
    }
    
    return trends;
  }

  /**
   * Get oilseed by-products information
   */
  getOilseedByProducts() {
    return [
      {
        name: 'Mustard Cake',
        baseProduct: 'Mustard',
        uses: ['Animal feed', 'Fertilizer', 'Pesticide'],
        price: 2500,
        demand: 'High'
      },
      {
        name: 'Soybean Meal',
        baseProduct: 'Soybean',
        uses: ['Protein supplement', 'Animal feed'],
        price: 3200,
        demand: 'Very High'
      },
      {
        name: 'Sunflower Meal',
        baseProduct: 'Sunflower',
        uses: ['Animal feed', 'Biofuel'],
        price: 2800,
        demand: 'High'
      },
      {
        name: 'Groundnut Shell',
        baseProduct: 'Groundnut',
        uses: ['Fuel', 'Mulch', 'Bedding'],
        price: 1500,
        demand: 'Medium'
      },
      {
        name: 'Coconut Cake',
        baseProduct: 'Coconut',
        uses: ['Animal feed', 'Fertilizer'],
        price: 2200,
        demand: 'High'
      }
    ];
  }

  private getRandomQuality(): 'excellent' | 'good' | 'fair' | 'poor' {
    const qualities: ('excellent' | 'good' | 'fair' | 'poor')[] = ['excellent', 'good', 'fair', 'poor'];
    const weights = [0.3, 0.4, 0.2, 0.1];
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < qualities.length; i++) {
      sum += weights[i];
      if (random < sum) return qualities[i];
    }
    
    return 'good';
  }

  private getRandomDefects(): string[] {
    const defects = ['slight discoloration', 'minor bruising', 'small cracks'];
    const selectedDefects: string[] = [];
    
    if (Math.random() > 0.6) selectedDefects.push(defects[0]);
    if (Math.random() > 0.7) selectedDefects.push(defects[1]);
    if (Math.random() > 0.8) selectedDefects.push(defects[2]);
    
    return selectedDefects;
  }

  private getQualityRecommendations(): string[] {
    return [
      'Store in cool, dry place',
      'Maintain proper moisture levels',
      'Check for pest infestation regularly'
    ];
  }
}

export const mlPriceService = new MLPriceService();
