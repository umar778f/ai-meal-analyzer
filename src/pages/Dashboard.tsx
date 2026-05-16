import React, { useState } from "react";
import { UploadArea } from "../components/UploadArea";
import { AnalysisResult } from "../components/AnalysisResult";
import { MealAnalysis } from "../types";

export default function Dashboard() {
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // 🛑 REPLACE THE URL BELOW WITH YOUR ACTUAL RENDER URL 🛑
      // Look at your Render Dashboard for your web service URL.
      // It should look something like: "https://ai-meal-analyzer-backend.onrender.com/api/analyze-meal"
      
      const res = await fetch("https://ai-meal-analyzer.onrender.com/api/analyze-meal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: base64 }),
});
      
      if (!res.ok) {
        throw new Error("Failed to analyze image");
      }
      
      const data = await res.json();
      
      // Save to localStorage
      const newAnalysis: MealAnalysis = {
        ...data,
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString(),
        imageBase64: base64
      };
      
      const saved = JSON.parse(localStorage.getItem('mealHistory') || '[]');
      localStorage.setItem('mealHistory', JSON.stringify([newAnalysis, ...saved]));

      setAnalysis(newAnalysis);
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Please try again with a clearer picture.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeak = () => {
    if (!analysis) return;
    const utterance = new SpeechSynthesisUtterance(
      `Your meal analysis is complete. It contains approximately ${analysis.calories} calories, with ${analysis.protein} grams of protein. 
      The AI health score is ${analysis.healthScore} out of 10. ${analysis.healthVerdict}`
    );
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-8 hidden md:block">
        <h1 className="text-3xl font-bold tracking-tight">AI Analyzer Dashboard</h1>
        <p className="text-gray-400 mt-2">Upload any food image and get an instant breakdown.</p>
      </div>

      {!analysis && (
        <div className="max-w-2xl mx-auto w-full">
          <UploadArea onImageReady={analyzeImage} isAnalyzing={isAnalyzing} />
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>
      )}

      {analysis && (
        <div className="space-y-8">
          <AnalysisResult result={analysis} onSpeak={handleSpeak} />
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => setAnalysis(null)}
              className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-medium text-sm"
            >
              Analyze Another Meal
            </button>
          </div>
        </div>
      )}

    </div>
  );
}