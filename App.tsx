import React, { useState } from 'react';
import { useStorage, getTodayStr } from './services/storage';
import { ViewState, FoodItem, LogEntry } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Injector from './components/Injector';
import PitStop from './components/PitStop';
import FuelLibrary from './components/FuelLibrary';

const App: React.FC = () => {
  const { 
    logs, foods, checklists, 
    addLogEntry, deleteLogEntry,
    addFood, updateFood, deleteFood,
    updateChecklist, resetChecklist,
    addChecklistCategory, deleteChecklistCategory, updateChecklistCategory,
    addChecklistItem, deleteChecklistItem,
    getHistoryData,
    isLoaded 
  } = useStorage();

  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [currentDate, setCurrentDate] = useState<string>(getTodayStr());

  const handleNavigateDate = (dateStr: string) => {
      setCurrentDate(dateStr);
  };

  const generateId = (prefix: string) => {
      return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleQuickInject = (type: 'Carb' | 'Protein' | 'Fat', value: number) => {
    if (value <= 0) return;
    
    const entry: LogEntry = {
      id: generateId('quick'),
      foodId: `quick_${type.toLowerCase()}`,
      foodName: `QUICK ${type.toUpperCase()}`,
      timestamp: Date.now(),
      weightGrams: 0, // Not applicable
      carbs: type === 'Carb' ? value : 0,
      protein: type === 'Protein' ? value : 0,
      fat: type === 'Fat' ? value : 0,
    };
    addLogEntry(currentDate, entry);
  };

  const handleInjectConfirm = (food: FoodItem | null, weight: number, manualMacros?: {c: number, p: number, f: number}) => {
    let carbs, protein, fat, foodName, foodId;

    if (manualMacros) {
        // Manual Mode
        carbs = manualMacros.c;
        protein = manualMacros.p;
        fat = manualMacros.f;
        foodName = "MANUAL ENTRY";
        foodId = "manual_override";
    } else if (food) {
        // Library Mode
        carbs = Math.round((weight / 100) * food.carbsPer100g);
        protein = Math.round((weight / 100) * food.proteinPer100g);
        fat = Math.round((weight / 100) * food.fatPer100g);
        foodName = food.name;
        foodId = food.id;
    } else {
        return;
    }

    const entry = {
      id: generateId('entry'),
      foodId: foodId,
      foodName: foodName,
      timestamp: Date.now(),
      weightGrams: weight,
      carbs,
      protein,
      fat
    };

    addLogEntry(currentDate, entry);
    setCurrentView('DASHBOARD');
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-cyan-500 font-display animate-pulse">
        INITIALIZING SYSTEM...
      </div>
    );
  }

  return (
    // FULL SCREEN NATIVE APP CONTAINER
    <div className="w-full h-[100dvh] bg-apex-bg relative overflow-hidden flex flex-col">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
        {currentView === 'DASHBOARD' && (
          <Dashboard 
            currentDate={currentDate} 
            log={logs[currentDate]} 
            historyData={getHistoryData(365)} // Fetch full year history
            onNavigateDate={handleNavigateDate}
            onInject={() => setCurrentView('INJECTOR')}
            onQuickInject={handleQuickInject}
            onDeleteEntry={deleteLogEntry}
          />
        )}

        {currentView === 'INJECTOR' && (
          <Injector 
            foods={foods} 
            onConfirm={handleInjectConfirm}
            onCancel={() => setCurrentView('DASHBOARD')}
          />
        )}

        {currentView === 'PITSTOP' && (
          <PitStop 
            checklists={checklists}
            onToggleItem={updateChecklist}
            onReset={resetChecklist}
            onAddCategory={addChecklistCategory}
            onAddItem={addChecklistItem}
            onDeleteCategory={deleteChecklistCategory}
            onDeleteItem={deleteChecklistItem}
            onUpdateCategory={updateChecklistCategory}
          />
        )}

        {currentView === 'LIBRARY' && (
          <FuelLibrary 
              foods={foods} 
              onAddFood={addFood}
              onUpdateFood={updateFood}
              onDeleteFood={deleteFood}
          />
        )}
      </div>

      {/* Navigation - Hidden on Injector screen for focus, but visible elsewhere */}
      {currentView !== 'INJECTOR' && (
          <Navigation currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;