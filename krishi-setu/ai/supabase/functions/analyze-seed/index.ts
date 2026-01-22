import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing seed image with Gemini...");

    const systemPrompt = `You are an expert agricultural analyst specializing in seed quality assessment for the Indian market. Analyze the provided seed image and provide a detailed assessment.

Your response MUST be a valid JSON object with this exact structure:
{
  "seedType": "string - the type/variety of seed (e.g., Wheat, Rice, Mustard, Chickpea, Sunflower, Cumin, etc.)",
  "scientificName": "string - scientific name if identifiable",
  "quality": {
    "overallGrade": "Excellent | Good | Fair | Poor",
    "overallScore": number between 0-100,
    "size": {
      "rating": "Excellent | Good | Fair | Poor",
      "score": number between 0-100,
      "description": "string describing size uniformity and appropriateness"
    },
    "color": {
      "rating": "Excellent | Good | Fair | Poor", 
      "score": number between 0-100,
      "description": "string describing color consistency and health indicators"
    },
    "texture": {
      "rating": "Excellent | Good | Fair | Poor",
      "score": number between 0-100,
      "description": "string describing surface texture and integrity"
    },
    "brokenSeeds": {
      "percentage": number between 0-100,
      "impact": "string describing how broken seeds affect quality"
    },
    "moisture": {
      "estimated": "string - estimated moisture level",
      "notes": "string - moisture-related observations"
    }
  },
  "marketAnalysis": {
    "currentPriceRange": {
      "min": number in INR per kg,
      "max": number in INR per kg,
      "average": number in INR per kg
    },
    "priceFactors": ["array of strings explaining price factors"],
    "marketTrend": "Rising | Stable | Declining",
    "bestSellingStates": ["array of Indian states where this seed has high demand"],
    "seasonalNotes": "string about seasonal price variations"
  },
  "recommendations": ["array of strings with storage/handling recommendations"],
  "confidence": number between 0-100 indicating analysis confidence
}

Be specific to Indian agricultural context and current market conditions (2024-2025). Provide realistic price ranges in Indian Rupees (₹).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this seed image and provide the quality assessment and market price prediction for India."
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Gemini response received");

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return new Response(
        JSON.stringify({ error: "No analysis generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON from the response
    let analysis;
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      analysis = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw content:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis results", rawContent: content }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analysis complete:", analysis.seedType);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-seed function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
