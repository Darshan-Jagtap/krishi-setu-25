import fs from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vrqtnsxfxxutcgjzdjlt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRuc3hmeHh1dGNnanpkamx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODcyMzMsImV4cCI6MjA4MDc2MzIzM30.kBZSdSsTOwdaJH4E7ezLxw6xTVfodzc4w1Gb1RoYXEY';

interface ImageAnalysisResult {
    product_name: string;
    variety: string;
    quality_grade: 'A' | 'B' | 'C';
    visual_observations: string;
    indicative_market_price: {
        min: number;
        max: number;
        recommended: number;
        unit: string;
    };
}

export const analyzeProductImage = async (imagePath: string): Promise<ImageAnalysisResult> => {
    try {
        // Read image file and convert to base64
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:${getMimeType(imagePath)};base64,${imageBuffer.toString('base64')}`;

        console.log('Calling Supabase edge function for image analysis...');

        // Call Supabase edge function
        const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-seed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
                imageBase64: base64Image
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})) as any;
            throw new Error(errorData.error || `Supabase function error: ${response.status}`);
        }

        const data = await response.json() as any;
        const analysis = data.analysis;

        if (!analysis) {
            throw new Error('No analysis data received from Supabase function');
        }

        // Transform Supabase response to our expected format
        const result: ImageAnalysisResult = {
            product_name: analysis.seedType || 'Unknown',
            variety: analysis.scientificName || 'Unknown',
            quality_grade: mapQualityGrade(analysis.quality?.overallGrade),
            visual_observations: buildVisualObservations(analysis),
            indicative_market_price: {
                min: analysis.marketAnalysis?.currentPriceRange?.min || 0,
                max: analysis.marketAnalysis?.currentPriceRange?.max || 0,
                recommended: analysis.marketAnalysis?.currentPriceRange?.average || 0,
                unit: 'per kg'
            }
        };

        console.log('Analysis complete:', result.product_name);
        return result;
    } catch (error: any) {
        console.error('Error analyzing image:', error);
        throw new Error(`Image analysis failed: ${error.message}`);
    }
};

const mapQualityGrade = (grade?: string): 'A' | 'B' | 'C' => {
    if (!grade) return 'C';
    const normalized = grade.toLowerCase();
    if (normalized === 'excellent') return 'A';
    if (normalized === 'good') return 'B';
    return 'C'; // Fair or Poor
};

const buildVisualObservations = (analysis: any): string => {
    const points: string[] = [];

    // Point 1: Overall Grade and Score
    if (analysis.quality?.overallGrade) {
        points.push(`Overall Quality: ${analysis.quality.overallGrade} (Score: ${analysis.quality.overallScore || 'N/A'}/100)`);
    }

    // Point 2: Size Assessment
    if (analysis.quality?.size) {
        points.push(`Size: ${analysis.quality.size.rating} - ${analysis.quality.size.description || 'Size uniformity assessed'}`);
    }

    // Point 3: Color Assessment
    if (analysis.quality?.color) {
        points.push(`Color: ${analysis.quality.color.rating} - ${analysis.quality.color.description || 'Color consistency checked'}`);
    }

    // Point 4: Texture/Integrity
    if (analysis.quality?.texture) {
        points.push(`Texture: ${analysis.quality.texture.rating} - ${analysis.quality.texture.description || 'Surface integrity verified'}`);
    }

    // Point 5: Defects/Broken Seeds
    if (analysis.quality?.brokenSeeds?.percentage !== undefined) {
        points.push(`Broken Seeds: ${analysis.quality.brokenSeeds.percentage}% - ${analysis.quality.brokenSeeds.impact || 'Impact on quality noted'}`);
    } else if (analysis.quality?.moisture) {
        // Fallback to moisture if broken seeds not available
        points.push(`Moisture: ${analysis.quality.moisture.estimated || 'Assessed'} - ${analysis.quality.moisture.notes || 'Within acceptable range'}`);
    }

    // Ensure we always have 5 points
    while (points.length < 5 && analysis.recommendations?.length > 0) {
        const rec = analysis.recommendations[points.length - 4];
        if (rec) points.push(`Recommendation: ${rec}`);
        else break;
    }

    return points.slice(0, 5).join('\n• ');
};

const getMimeType = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp'
    };
    return mimeTypes[ext || 'jpg'] || 'image/jpeg';
};
