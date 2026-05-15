import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Need larger body size for image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON Schema for the expected response
const mealResponseSchema = {
  type: Type.OBJECT,
  properties: {
    foodItems: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of detected food items in the meal"
    },
    calories: {
      type: Type.NUMBER,
      description: "Estimated total calories (kcal)"
    },
    protein: {
      type: Type.NUMBER,
      description: "Estimated protein in grams"
    },
    carbs: {
      type: Type.NUMBER,
      description: "Estimated carbohydrates in grams"
    },
    fat: {
      type: Type.NUMBER,
      description: "Estimated fat in grams"
    },
    sugar: {
      type: Type.NUMBER,
      description: "Estimated sugar in grams"
    },
    fiber: {
      type: Type.NUMBER,
      description: "Estimated dietary fiber in grams"
    },
    sodium: {
      type: Type.NUMBER,
      description: "Estimated sodium in milligrams"
    },
    healthScore: {
      type: Type.NUMBER,
      description: "Overall health score from 1 to 10 (10 being healthiest)"
    },
    healthVerdict: {
      type: Type.STRING,
      description: "A short verdict summarizing if this meal is healthy, moderate, or unhealthy based on its balance."
    },
    healthierAlternatives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Suggestions to make the meal healthier"
    },
    hydrationTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Hydration suggestions based on the meal, such as drinking more water if it's high sodium."
    },
    mealBalanceAdvice: {
      type: Type.STRING,
      description: "A short paragraph explaining the balance of macros and missing nutrients"
    }
  },
  required: ["foodItems", "calories", "protein", "carbs", "fat", "sugar", "fiber", "sodium", "healthScore", "healthVerdict", "healthierAlternatives", "hydrationTips", "mealBalanceAdvice"]
};

app.post("/api/analyze-meal", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Determine mimeType from base64 string
    const match = imageBase64.match(/^data:(image\/[^;]+);base64,/);
    if (!match) {
      return res.status(400).json({ error: "Invalid image format" });
    }
    
    const mimeType = match[1];
    const base64Data = imageBase64.replace(/^data:image\/[^;]+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            text: `Analyze this meal image and estimate:
            1. Food items
            2. Calories
            3. Macros (Protein, Carbs, Fat)
            4. Sugar, Fiber, Sodium
            5. Health score (1-10)
            6. A short verdict ("Is this healthy?")
            7. Healthier alternatives
            8. Hydration tips
            9. Meal balance advice`
          },
          {
            inlineData: {
              mimeType,
              data: base64Data
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: mealResponseSchema
      }
    });

    res.json(JSON.parse(response.text));
  } catch (err: any) {
    console.error("AI Analysis Error:", err);
    res.status(500).json({ error: "Failed to analyze meal." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
