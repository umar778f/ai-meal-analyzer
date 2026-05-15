import React, { useEffect, useState } from "react";
import { MealAnalysis } from "../types";
import { Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState<MealAnalysis[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mealHistory") || "[]");
    setHistory(saved);
  }, []);

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem("mealHistory", JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const getHealthColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  const totalCaloriesToday = history
    .filter(h => new Date(h.date).toDateString() === new Date().toDateString())
    .reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">History & Tracking</h1>
          <p className="text-gray-400">Review past meals and track your daily stats.</p>
        </div>
        
        <div className="glass-panel px-6 py-4 rounded-2xl flex items-center space-x-6 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Today's Calories</p>
            <p className="text-2xl font-bold font-mono">{totalCaloriesToday} <span className="text-sm font-sans text-gray-500">kcal</span></p>
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-3xl">
          <p className="text-gray-400 mb-4">No meals tracked yet.</p>
          <Link to="/dashboard" className="text-emerald-400 hover:underline">Start analyzing your first meal</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel overflow-hidden rounded-3xl group"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img src={item.imageBase64} alt="Meal" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent" />
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="absolute top-4 right-4 p-2 bg-dark/50 hover:bg-red-500/80 rounded-full transition-colors backdrop-blur z-10"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <p className="font-bold text-lg">{item.calories} <span className="text-sm font-normal text-gray-300">kcal</span></p>
                    <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div className={`font-bold text-xl ${getHealthColor(item.healthScore)}`}>
                    {item.healthScore}/10
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-b-3xl">
                <p className="text-sm text-gray-300 mb-3 line-clamp-1">{item.foodItems.join(", ")}</p>
                <div className="flex gap-4 text-xs">
                  <div className="text-gray-400">P <span className="text-white font-mono">{item.protein}g</span></div>
                  <div className="text-gray-400">C <span className="text-white font-mono">{item.carbs}g</span></div>
                  <div className="text-gray-400">F <span className="text-white font-mono">{item.fat}g</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
