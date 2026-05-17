import express from "express";
import { GoogleGenerativeAI, SchemaType, ResponseSchema } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

/** * Port configuration
 * Number conversion fixes the "string | 3000" type error for Render
 */
const PORT = Number(process.env.PORT) || 3000; 

/** * Middleware
 * CORS is locked down to ONLY allow requests from your specific Vercel frontend URL.
 * Increased limits allow for high-resolution image uploads.
 */
app.use(cors({
  origin: 'https://ai-meal-analyzer-ebon.vercel.app'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/** * Structured JSON Schema for Gemini
 * Explicitly typed as ResponseSchema to fix the SchemaType mismatch error
 */
const mealResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    foodItems: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "List of detected food items"
    },
    calories: { type: SchemaType.NUMBER },
    protein: { type: SchemaType.NUMBER },
    carbs: { type: SchemaType.NUMBER },
    fat: { type: SchemaType.NUMBER },
    sugar: { type: SchemaType.NUMBER },
    fiber: { type: SchemaType.NUMBER },
    sodium: { type: SchemaType.NUMBER },
    healthScore: { 
      type: SchemaType.INTEGER, 
      description: "Health score strictly between 1 and 10. DO NOT use percentages or a 100-point scale." 
    },
    healthVerdict: { type: SchemaType.STRING },
    healthierAlternatives: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING } 
    },
    hydrationTips: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING } 
    },
    mealBalanceAdvice: { type: SchemaType.STRING }
  },
  required: [
    "foodItems", "calories", "protein", "carbs", "fat", "sugar", 
    "fiber", "sodium", "healthScore", "healthVerdict", 
    "healthierAlternatives", "hydrationTips", "mealBalanceAdvice"
  ]
};

app.post("/api/analyze-meal", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Determine mimeType and extract clean base64 data
    const match = imageBase64.match(/^data:(image\/[^;]+);base64,/);
    if (!match) {
      return res.status(400).json({ error: "Invalid image format" });
    }
    
    const mimeType = match[1];
    const base64Data = imageBase64.replace(/^data:image\/[^;]+;base64,/, "");

    // Initialize the latest Flash model with JSON output configuration
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest", 
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: mealResponseSchema,
      }
    });

    // Explicitly prompt the AI to use a 1-10 scale
    const promptText = "Analyze this meal image for nutrition facts and provide healthy living advice. IMPORTANT: The healthScore MUST be an integer between 1 and 10. Do not use a 100-point scale.";

    const result = await model.generateContent([
      { text: promptText },
      {
        inlineData: {
          mimeType,
          data: base64Data
        }
      }
    ]);

    // Parse the structured AI response
    const responseText = result.response.text();
    let parsedData = JSON.parse(responseText);

    // DEFENSIVE FALLBACK: Check if AI hallucinated a percentage (e.g., 95)
    if (parsedData.healthScore > 10) {
      // Convert 95 -> 9.5 -> rounds to 10. Convert 85 -> 8.5 -> rounds to 9.
      parsedData.healthScore = Math.round(parsedData.healthScore / 10);
    }
    
    // Final safety check just in case it still exceeds 10 somehow
    if (parsedData.healthScore > 10) {
      parsedData.healthScore = 10;
    }

    // Send the sanitized JSON back to the frontend
    res.json(parsedData);

  } catch (err: any) {
    console.error("AI Analysis Error:", err);
    res.status(500).json({ error: "Failed to analyze meal." });
  }
});

/** * Server Start
 * Binds to 0.0.0.0 to ensure the service is reachable on Render
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend service running on port ${PORT}`);
});