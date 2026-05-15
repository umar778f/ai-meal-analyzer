import React from "react";
import { motion } from "motion/react";
import { MealAnalysis } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles, Droplets, Info, HeartPulse, ShieldAlert } from "lucide-react";

export function AnalysisResult({ result, onSpeak }: { result: MealAnalysis; onSpeak: () => void }) {
  const macrosData = [
    { name: "Protein", value: result.protein, color: "#10b981" }, // emerald-500
    { name: "Carbs", value: result.carbs, color: "#3b82f6" }, // blue-500
    { name: "Fat", value: result.fat, color: "#34d399" }, // emerald-400
  ];

  const getHealthColor = (score: number) => {
    if (score >= 8) return "text-emerald-400 border-emerald-400";
    if (score >= 5) return "text-yellow-400 border-yellow-400";
    return "text-red-400 border-red-400";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full"
    >
      <div className="flex bg-blue-500/10 rounded-2xl p-4 items-center justify-between border border-blue-500/20">
        <div className="flex items-center space-x-3 text-blue-400">
          <Sparkles className="w-6 h-6" />
          <span className="font-semibold text-lg">{result.healthVerdict}</span>
        </div>
        <button 
          onClick={onSpeak}
          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-full font-medium transition-colors text-sm"
        >
          Listen to Summary
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Stats overview */}
        <div className="glass-panel p-6 rounded-3xl col-span-1 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">Detected Items</h3>
            <p className="text-gray-400 text-sm mb-6">{result.foodItems.join(", ")}</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full h-[200px] md:w-1/2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macrosData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macrosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#333", borderRadius: "12px", color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">{result.calories}</span>
                <span className="text-xs text-gray-400">kcal</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              {macrosData.map(macro => (
                <div key={macro.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{macro.name}</span>
                    <span className="font-mono">{macro.value}g</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ width: `${Math.min((macro.value / 150) * 100, 100)}%`, backgroundColor: macro.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health Score Component */}
        <div className="glass-panel p-6 rounded-[32px] col-span-1 flex flex-col items-center justify-center relative overflow-hidden">
          <HeartPulse className="absolute opacity-5 w-48 h-48 sm:top-10 sm:-right-10 text-white" />
          <h3 className="text-[10px] uppercase font-bold text-white/60 mb-2 z-10 tracking-widest">Health Score</h3>
          <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-4 z-10 ${getHealthColor(result.healthScore)}`}>
            <span className="text-5xl font-black">{result.healthScore}</span>
          </div>
          <p className="text-center text-sm text-gray-400 z-10">Out of 10</p>
          
          <div className="mt-6 w-full space-y-2 z-10">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Sugar</span>
              <span className="font-mono">{result.sugar}g</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Fiber</span>
              <span className="font-mono">{result.fiber}g</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Sodium</span>
              <span className="font-mono">{result.sodium}mg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-[32px] space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Info className="w-5 h-5" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Smart Suggestions</h3>
          </div>
          <ul className="space-y-3 pt-2">
            {result.healthierAlternatives.map((alt, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0" />
                <span className="text-gray-300 text-sm leading-relaxed">{alt}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-panel p-6 rounded-[32px] space-y-4">
          <div className="flex items-center space-x-2 text-blue-400">
            <Droplets className="w-5 h-5" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Hydration & Balance</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4 pt-2">{result.mealBalanceAdvice}</p>
          <ul className="space-y-3">
            {result.hydrationTips.map((tip, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 mr-3 shrink-0" />
                <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
