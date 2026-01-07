import { useState, useEffect } from 'react';
import { DailyLog, FoodItem, ChecklistCategory, LogEntry } from '../types';
import { INITIAL_FOODS, INITIAL_CHECKLISTS } from '../constants';

const STORAGE_KEY_LOGS = 'apex_fuel_logs_v1';
const STORAGE_KEY_FOODS = 'apex_fuel_foods_v1';
const STORAGE_KEY_CHECKLISTS = 'apex_fuel_checklists_v1';
const STORAGE_KEY_LAST_DATE = 'apex_fuel_last_active_date_v1';

export const getTodayStr = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useStorage = () => {
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [checklists, setChecklists] = useState<ChecklistCategory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      const savedFoods = localStorage.getItem(STORAGE_KEY_FOODS);
      const savedChecklists = localStorage.getItem(STORAGE_KEY_CHECKLISTS);
      const lastActiveDate = localStorage.getItem(STORAGE_KEY_LAST_DATE);
      const today = getTodayStr();

      if (savedLogs) setLogs(JSON.parse(savedLogs));
      
      if (savedFoods) {
        setFoods(JSON.parse(savedFoods));
      } else {
        setFoods(INITIAL_FOODS);
      }

      if (savedChecklists) {
        let parsedChecklists: ChecklistCategory[] = JSON.parse(savedChecklists);
        
        // Ensure resetFrequency property exists for old data
        parsedChecklists = parsedChecklists.map(c => ({
            ...c,
            resetFrequency: c.resetFrequency || 'DAILY'
        }));

        // Auto-reset checklists if it's a new day AND the category is set to DAILY
        if (lastActiveDate !== today) {
           console.log("New day detected. Processing checklist resets.");
           parsedChecklists = parsedChecklists.map(cat => {
               if (cat.resetFrequency === 'DAILY') {
                   return {
                       ...cat,
                       items: cat.items.map(item => ({ ...item, checked: false }))
                   };
               }
               return cat;
           });
           localStorage.setItem(STORAGE_KEY_LAST_DATE, today);
        }
        setChecklists(parsedChecklists);
      } else {
        const initialWithFreq = INITIAL_CHECKLISTS.map(c => ({...c, resetFrequency: 'DAILY' as const}));
        setChecklists(initialWithFreq);
        localStorage.setItem(STORAGE_KEY_LAST_DATE, today);
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persistence Effects
  useEffect(() => {
    if (isLoaded) localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }, [logs, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(STORAGE_KEY_FOODS, JSON.stringify(foods));
  }, [foods, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(checklists));
        localStorage.setItem(STORAGE_KEY_LAST_DATE, getTodayStr());
    }
  }, [checklists, isLoaded]);

  // --- LOGGING ---
  const addLogEntry = (date: string, entry: LogEntry) => {
    setLogs(prev => {
      const dayLog = prev[date] || { date, entries: [], totalCarbs: 0, totalProtein: 0, totalFat: 0 };
      const newEntries = [...dayLog.entries, entry];
      
      const newTotalCarbs = newEntries.reduce((acc, curr) => acc + curr.carbs, 0);
      const newTotalProtein = newEntries.reduce((acc, curr) => acc + curr.protein, 0);
      const newTotalFat = newEntries.reduce((acc, curr) => acc + curr.fat, 0);

      return {
        ...prev,
        [date]: {
          ...dayLog,
          entries: newEntries,
          totalCarbs: Math.round(newTotalCarbs),
          totalProtein: Math.round(newTotalProtein),
          totalFat: Math.round(newTotalFat),
        }
      };
    });
  };

  const deleteLogEntry = (date: string, entryId: string) => {
    setLogs(prev => {
        const dayLog = prev[date];
        if (!dayLog) return prev;

        const newEntries = dayLog.entries.filter(e => e.id !== entryId);
        const newTotalCarbs = newEntries.reduce((acc, curr) => acc + curr.carbs, 0);
        const newTotalProtein = newEntries.reduce((acc, curr) => acc + curr.protein, 0);
        const newTotalFat = newEntries.reduce((acc, curr) => acc + curr.fat, 0);

        return {
            ...prev,
            [date]: {
                ...dayLog,
                entries: newEntries,
                totalCarbs: Math.round(newTotalCarbs),
                totalProtein: Math.round(newTotalProtein),
                totalFat: Math.round(newTotalFat),
            }
        };
    });
  };

  // --- FOOD MGMT ---
  const addFood = (food: FoodItem) => {
    setFoods(prev => [food, ...prev]);
  };

  const updateFood = (updatedFood: FoodItem) => {
    setFoods(prev => prev.map(f => f.id === updatedFood.id ? updatedFood : f));
  };

  const deleteFood = (id: string) => {
    setFoods(prev => prev.filter(f => f.id !== id));
  };

  // --- CHECKLIST MGMT ---
  const updateChecklist = (categoryId: string, itemId: string, checked: boolean) => {
    setChecklists(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => item.id === itemId ? { ...item, checked } : item)
      };
    }));
  };

  const resetChecklist = (categoryId: string) => {
    setChecklists(prev => prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map(item => ({...item, checked: false}))
        }
    }));
  };

  const addChecklistCategory = (title: string, resetFrequency: 'DAILY' | 'MANUAL') => {
    const newCat: ChecklistCategory = {
        id: Date.now().toString(),
        title,
        icon: 'Box',
        resetFrequency,
        items: []
    };
    setChecklists(prev => [...prev, newCat]);
  };

  const deleteChecklistCategory = (id: string) => {
      setChecklists(prev => prev.filter(c => c.id !== id));
  };

  const addChecklistItem = (catId: string, text: string) => {
    setChecklists(prev => prev.map(cat => {
        if (cat.id !== catId) return cat;
        return {
            ...cat,
            items: [...cat.items, { id: Date.now().toString(), text, checked: false }]
        };
    }));
  };

  const deleteChecklistItem = (catId: string, itemId: string) => {
    setChecklists(prev => prev.map(cat => {
        if (cat.id !== catId) return cat;
        return {
            ...cat,
            items: cat.items.filter(i => i.id !== itemId)
        };
    }));
  };

  const updateChecklistCategory = (catId: string, updates: Partial<ChecklistCategory>) => {
      setChecklists(prev => prev.map(cat => {
          if (cat.id !== catId) return cat;
          return { ...cat, ...updates };
      }));
  }

  // --- HISTORY DATA HELPERS ---
  // Return a large set of history, UI will filter. 
  // Fetching last 365 days to ensure range selection works for a year.
  const getHistoryData = (days: number = 365) => {
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const log = logs[dateStr];
        data.push({
            date: dateStr.slice(5), // MM-DD
            fullDate: dateStr,
            c: log?.totalCarbs || 0,
            p: log?.totalProtein || 0,
            f: log?.totalFat || 0,
        });
    }
    return data;
  };

  return {
    logs,
    foods,
    checklists,
    addLogEntry,
    deleteLogEntry,
    addFood,
    updateFood,
    deleteFood,
    updateChecklist,
    resetChecklist,
    addChecklistCategory,
    deleteChecklistCategory,
    updateChecklistCategory,
    addChecklistItem,
    deleteChecklistItem,
    getHistoryData,
    isLoaded
  };
};