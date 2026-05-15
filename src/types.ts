export interface MealAnalysis {
  id: string; // generated client-side
  date: string;
  imageBase64: string;
  foodItems: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
  sodium: number;
  healthScore: number;
  healthVerdict: string;
  healthierAlternatives: string[];
  hydrationTips: string[];
  mealBalanceAdvice: string;
}
