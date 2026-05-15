import express from "express";
import { GoogleGenerativeAI, SchemaType, ResponseSchema } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// FIX 1: Convert PORT to a number
const PORT = Number(process.env.PORT) || 3000; 

app.use(cors()); 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// FIX 2: Explicitly type as ResponseSchema
const mealResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    foodItems: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    calories: { type: SchemaType.NUMBER },
    protein: { type: SchemaType.NUMBER },
    carbs: { type: SchemaType.NUMBER },
    fat: { type: SchemaType.NUMBER },
    sugar: { type: SchemaType.NUMBER },
    fiber: { type: SchemaType.NUMBER },
    sodium: { type: SchemaType.NUMBER },
    healthScore: { type: SchemaType.NUMBER },
    healthVerdict: { type: SchemaType.STRING },
    healthierAlternatives: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    hydrationTips: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
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
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    const match = imageBase64.match(/^data:(image\/[^;]+);base64,/);
    if (!match) return res.status(400).json({ error: "Invalid image format" });
    
    const mimeType = match[1];
    const base64Data = imageBase64.replace(/^data:image\/[^;]+;base64,/, "");

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: mealResponseSchema,
      }
    });

    const result = await model.generateContent([
      { text: "Analyze this meal image for nutrition facts and provide healthy living advice." },
      { inlineData: { mimeType, data: base64Data } }
    ]);

    res.json(JSON.parse(result.response.text()));
  } catch (err: any) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "Failed to analyze meal." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend service running on port ${PORT}`);
});
