export enum NutrientType {
  Carb = 'Carb',
  Protein = 'Protein',
  Fat = 'Fat'
}

export interface FoodItem {
  id: string;
  name: string;
  image: string; // Placeholder URL
  category: 'Carb' | 'Protein' | 'Fat' | 'Liquid';
  carbsPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
}

export interface LogEntry {
  id: string;
  foodId: string;
  foodName: string;
  timestamp: number;
  weightGrams: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: LogEntry[];
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  resetFrequency: 'DAILY' | 'MANUAL'; // New property
  items: ChecklistItem[];
}

export type ViewState = 'DASHBOARD' | 'INJECTOR' | 'LIBRARY' | 'PITSTOP';
