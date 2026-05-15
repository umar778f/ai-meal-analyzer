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
    healthScore: { type: SchemaType.NUMBER },
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

    // Initialize the 1.5 Flash model with JSON output configuration
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: mealResponseSchema,
      }
    });

    const result = await model.generateContent([
      { text: "Analyze this meal image for nutrition facts and provide healthy living advice." },
      {
        inlineData: {
          mimeType,
          data: base64Data
        }
      }
    ]);

    // Send the structured AI response back to the frontend
    const responseText = result.response.text();
    res.json(JSON.parse(responseText));

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