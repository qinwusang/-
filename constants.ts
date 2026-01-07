import { FoodItem, ChecklistCategory } from './types';

export const INITIAL_FOODS: FoodItem[] = [
  // Carbs (碳水)
  { id: 'f1', name: '米饭 (熟)', image: 'https://picsum.photos/100/100?random=1', category: 'Carb', carbsPer100g: 28, proteinPer100g: 2.7, fatPer100g: 0.3 },
  { id: 'f2', name: '土豆 (水煮)', image: 'https://picsum.photos/100/100?random=2', category: 'Carb', carbsPer100g: 20, proteinPer100g: 1.9, fatPer100g: 0.1 },
  { id: 'f3', name: '燕麦 (生)', image: 'https://picsum.photos/100/100?random=3', category: 'Carb', carbsPer100g: 66, proteinPer100g: 17, fatPer100g: 7 },
  { id: 'f4', name: '红薯/紫薯', image: 'https://picsum.photos/100/100?random=4', category: 'Carb', carbsPer100g: 20, proteinPer100g: 1.6, fatPer100g: 0.1 },
  { id: 'f4_1', name: '馒头/面食', image: 'https://picsum.photos/100/100?random=41', category: 'Carb', carbsPer100g: 50, proteinPer100g: 7, fatPer100g: 1 },
  
  // Protein (蛋白质)
  { id: 'f5', name: '鸡胸肉 (熟)', image: 'https://picsum.photos/100/100?random=5', category: 'Protein', carbsPer100g: 0, proteinPer100g: 31, fatPer100g: 3.6 },
  { id: 'f6', name: '牛排/瘦牛肉', image: 'https://picsum.photos/100/100?random=6', category: 'Protein', carbsPer100g: 0, proteinPer100g: 26, fatPer100g: 10 },
  { id: 'f7', name: '鸡蛋 (全蛋)', image: 'https://picsum.photos/100/100?random=7', category: 'Protein', carbsPer100g: 1.1, proteinPer100g: 13, fatPer100g: 11 },
  { id: 'f8', name: '蛋白粉 (一勺)', image: 'https://picsum.photos/100/100?random=8', category: 'Protein', carbsPer100g: 3, proteinPer100g: 24, fatPer100g: 1 },
  { id: 'f8_1', name: '瘦猪肉', image: 'https://picsum.photos/100/100?random=81', category: 'Protein', carbsPer100g: 0, proteinPer100g: 20, fatPer100g: 15 },

  // Fat (脂肪)
  { id: 'f9', name: '杏仁/坚果', image: 'https://picsum.photos/100/100?random=9', category: 'Fat', carbsPer100g: 22, proteinPer100g: 21, fatPer100g: 49 },
  { id: 'f10', name: '花生酱', image: 'https://picsum.photos/100/100?random=10', category: 'Fat', carbsPer100g: 20, proteinPer100g: 25, fatPer100g: 50 },
  { id: 'f11', name: '牛油果', image: 'https://picsum.photos/100/100?random=11', category: 'Fat', carbsPer100g: 9, proteinPer100g: 2, fatPer100g: 15 },

  // Liquids (液体/补剂)
  { id: 'f12', name: '零度可乐/魔爪', image: 'https://picsum.photos/100/100?random=12', category: 'Liquid', carbsPer100g: 0, proteinPer100g: 0, fatPer100g: 0 },
  { id: 'f13', name: '脱脂牛奶', image: 'https://picsum.photos/100/100?random=13', category: 'Liquid', carbsPer100g: 5, proteinPer100g: 3.4, fatPer100g: 0.1 },
];

export const INITIAL_CHECKLISTS: ChecklistCategory[] = [
  {
    id: 'leg_day',
    title: '腿部训练 (Leg Day)',
    icon: 'Weight',
    resetFrequency: 'DAILY',
    items: [
      { id: 'l1', text: '护膝 (Sleeves)', checked: false },
      { id: 'l2', text: '腰带 (Belt)', checked: false },
      { id: 'l3', text: '深蹲鞋', checked: false },
      { id: 'l4', text: '肌酸', checked: false },
      { id: 'l5', text: '氮泵 (Pre-workout)', checked: false },
    ]
  },
  {
    id: 'push_day',
    title: '推类训练 (Push)',
    icon: 'Dumbbell',
    resetFrequency: 'DAILY',
    items: [
      { id: 'p1', text: '护腕', checked: false },
      { id: 'p2', text: '护肘', checked: false },
      { id: 'p3', text: '毛巾/水壶', checked: false },
    ]
  },
  {
    id: 'cardio',
    title: '有氧/户外 (Cardio)',
    icon: 'Mountain',
    resetFrequency: 'DAILY',
    items: [
      { id: 'h1', text: '心率带/手表', checked: false },
      { id: 'h2', text: '蓝牙耳机', checked: false },
      { id: 'h3', text: '电解质水', checked: false },
    ]
  }
];