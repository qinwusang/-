import React, { useState, useMemo } from 'react';
import { FoodItem, NutrientType } from '../types';
import { Search, Calculator, X, Plus, Hexagon, Database } from 'lucide-react';

interface InjectorProps {
  foods: FoodItem[];
  onConfirm: (food: FoodItem | null, weight: number, manualMacros?: {c: number, p: number, f: number}) => void;
  onCancel: () => void;
}

const Injector: React.FC<InjectorProps> = ({ foods, onConfirm, onCancel }) => {
  const [mode, setMode] = useState<'LIBRARY' | 'MANUAL'>('LIBRARY');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  
  // Library State
  const [weight, setWeight] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Manual State
  const [manualC, setManualC] = useState('');
  const [manualP, setManualP] = useState('');
  const [manualF, setManualF] = useState('');

  const filteredFoods = useMemo(() => {
    return foods.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(filter.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || f.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [foods, filter, categoryFilter]);

  const handleConfirmManual = () => {
    onConfirm(null, 0, {
        c: parseInt(manualC) || 0,
        p: parseInt(manualP) || 0,
        f: parseInt(manualF) || 0
    });
  };

  const calculatedMacros = useMemo(() => {
    if (!selectedFood || !weight) return null;
    const w = parseInt(weight);
    return {
      c: Math.round((w / 100) * selectedFood.carbsPer100g),
      p: Math.round((w / 100) * selectedFood.proteinPer100g),
      f: Math.round((w / 100) * selectedFood.fatPer100g),
    };
  }, [selectedFood, weight]);

  // --- MANUAL ENTRY VIEW ---
  if (mode === 'MANUAL') {
      return (
        <div className="flex flex-col h-full bg-apex-bg relative animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-apex-border bg-apex-panel">
                <div className="flex space-x-4">
                    <button onClick={() => setMode('LIBRARY')} className="text-zinc-500 font-display font-bold">LIBRARY</button>
                    <button className="text-apex-carb font-display font-bold border-b-2 border-apex-carb">MANUAL</button>
                </div>
                <button onClick={onCancel} className="p-2 hover:text-red-500 transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <div className="flex-1 p-6 flex flex-col justify-center space-y-8">
                <div className="text-center">
                    <Hexagon className="w-16 h-16 text-apex-carb mx-auto mb-4 stroke-[1.5]" />
                    <h2 className="text-2xl font-display font-bold text-white">MANUAL OVERRIDE</h2>
                    <p className="text-xs text-zinc-500 font-mono mt-2">DIRECT NUTRIENT INJECTION</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-cyan-400 font-display font-bold text-sm">CARBS (g)</label>
                        <input type="number" value={manualC} onChange={e => setManualC(e.target.value)} className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-cyan-500 p-4 text-2xl font-display text-white rounded outline-none" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-rose-500 font-display font-bold text-sm">PROTEIN (g)</label>
                        <input type="number" value={manualP} onChange={e => setManualP(e.target.value)} className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-rose-500 p-4 text-2xl font-display text-white rounded outline-none" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-yellow-500 font-display font-bold text-sm">FAT (g)</label>
                        <input type="number" value={manualF} onChange={e => setManualF(e.target.value)} className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-yellow-500 p-4 text-2xl font-display text-white rounded outline-none" placeholder="0" />
                    </div>
                </div>

                <button 
                    onClick={handleConfirmManual}
                    className="w-full bg-white text-black font-black font-display text-lg py-4 uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-lg"
                >
                    CONFIRM MANUAL ENTRY
                </button>
            </div>
        </div>
      );
  }

  // --- CALCULATOR VIEW (Library selected) ---
  if (selectedFood) {
    return (
      <div className="flex flex-col h-full bg-apex-bg relative animate-in fade-in slide-in-from-bottom-10 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-apex-border bg-apex-panel">
          <h2 className="text-xl font-display font-bold text-apex-text flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-apex-carb" />
            CALCULATOR
          </h2>
          <button onClick={() => setSelectedFood(null)} className="p-2 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-lg border-2 border-apex-border overflow-hidden mb-6 shadow-2xl relative ring-2 ring-apex-carb/20">
             <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-full object-cover opacity-80" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-2">
                <span className="text-xs font-display font-bold text-white uppercase tracking-widest">{selectedFood.category}</span>
             </div>
          </div>
          
          <h3 className="text-2xl font-bold font-display text-center mb-8 text-white tracking-wide">{selectedFood.name}</h3>

          <div className="w-full max-w-xs relative mb-8">
            <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Input Weight (g)</label>
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <input 
                    type="number" 
                    inputMode="numeric"
                    autoFocus
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0"
                    className="relative w-full bg-zinc-900 border-2 border-apex-border focus:border-apex-carb text-right text-5xl font-display p-4 rounded-none outline-none text-white transition-colors"
                />
                <span className="absolute right-4 bottom-5 text-sm text-zinc-500 font-mono">g</span>
            </div>
          </div>

          <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-8">
             <div className="bg-zinc-900 p-2 border-t-2 border-cyan-500 flex flex-col items-center shadow-[0_-10px_20px_-10px_rgba(6,182,212,0.3)]">
                <span className="text-[10px] text-zinc-500 font-bold mb-1">CARB</span>
                <span className="text-xl font-display font-bold text-white">{calculatedMacros?.c || 0}</span>
             </div>
             <div className="bg-zinc-900 p-2 border-t-2 border-rose-500 flex flex-col items-center shadow-[0_-10px_20px_-10px_rgba(244,63,94,0.3)]">
                <span className="text-[10px] text-zinc-500 font-bold mb-1">PRO</span>
                <span className="text-xl font-display font-bold text-white">{calculatedMacros?.p || 0}</span>
             </div>
             <div className="bg-zinc-900 p-2 border-t-2 border-yellow-500 flex flex-col items-center shadow-[0_-10px_20px_-10px_rgba(234,179,8,0.3)]">
                <span className="text-[10px] text-zinc-500 font-bold mb-1">FAT</span>
                <span className="text-xl font-display font-bold text-white">{calculatedMacros?.f || 0}</span>
             </div>
          </div>

          <button 
            disabled={!weight || parseInt(weight) <= 0}
            onClick={() => onConfirm(selectedFood, parseInt(weight))}
            className="w-full max-w-xs bg-apex-protein text-white font-black font-display text-lg py-4 uppercase tracking-widest hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-neon-red active:scale-95"
          >
            INJECT
          </button>
        </div>
      </div>
    );
  }

  // --- SELECTION VIEW ---
  return (
    <div className="flex flex-col h-full bg-apex-bg">
       <div className="p-4 bg-apex-panel border-b border-apex-border space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex space-x-6">
                <button className="text-apex-carb font-display font-bold border-b-2 border-apex-carb">LIBRARY</button>
                <button onClick={() => setMode('MANUAL')} className="text-zinc-500 font-display font-bold hover:text-white transition-colors">MANUAL</button>
             </div>
             <button onClick={onCancel} className="text-xs font-mono text-zinc-500 hover:text-white uppercase">[ CANCEL ]</button>
          </div>
          
          <div className="relative">
             <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
             <input 
                type="text" 
                placeholder="SEARCH DATABASE..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-black border border-zinc-800 py-3 pl-10 pr-4 text-sm font-mono text-white focus:border-apex-carb outline-none uppercase placeholder:text-zinc-700 rounded-sm focus:ring-1 focus:ring-apex-carb"
             />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
             {['ALL', 'Carb', 'Protein', 'Fat', 'Liquid'].map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 text-xs font-display font-bold border ${categoryFilter === cat ? 'bg-apex-carb text-black border-apex-carb shadow-neon-blue' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'} transition-all uppercase skew-x-[-10deg]`}
                 >
                    <span className="skew-x-[10deg] inline-block">{cat}</span>
                 </button>
             ))}
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-24">
             {filteredFoods.map(food => (
                 <button 
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className="group relative aspect-square bg-zinc-900 border border-zinc-800 hover:border-apex-carb transition-colors overflow-hidden flex flex-col"
                 >
                    <div className="flex-1 w-full relative">
                        <img src={food.image} alt={food.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                        <div className="absolute top-2 right-2 px-1 py-0.5 bg-black/80 text-[10px] font-mono text-apex-carb border border-apex-carb/30 backdrop-blur-sm">
                            {food.category.substring(0,3).toUpperCase()}
                        </div>
                    </div>
                    <div className="p-3 bg-zinc-950 border-t border-zinc-800 w-full text-left relative z-10">
                        <div className="text-sm font-bold font-display text-white truncate">{food.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-1 space-x-2 flex">
                           <span className={food.carbsPer100g > 10 ? 'text-cyan-600' : ''}>C{food.carbsPer100g}</span>
                           <span className={food.proteinPer100g > 10 ? 'text-rose-600' : ''}>P{food.proteinPer100g}</span>
                           <span className={food.fatPer100g > 10 ? 'text-yellow-600' : ''}>F{food.fatPer100g}</span>
                        </div>
                    </div>
                 </button>
             ))}
          </div>
       </div>
    </div>
  );
};

export default Injector;
