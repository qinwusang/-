import React, { useState } from 'react';
import { ChecklistCategory } from '../types';
import { CheckSquare, Square, RefreshCw, ChevronDown, ChevronUp, Plus, Trash2, X, Lock, RotateCw } from 'lucide-react';

interface PitStopProps {
  checklists: ChecklistCategory[];
  onToggleItem: (catId: string, itemId: string, checked: boolean) => void;
  onReset: (catId: string) => void;
  onAddCategory: (title: string, resetFrequency: 'DAILY' | 'MANUAL') => void;
  onAddItem: (catId: string, text: string) => void;
  onDeleteCategory: (id: string) => void;
  onDeleteItem: (catId: string, itemId: string) => void;
  onUpdateCategory: (catId: string, updates: Partial<ChecklistCategory>) => void;
}

const PitStop: React.FC<PitStopProps> = ({ checklists, onToggleItem, onReset, onAddCategory, onAddItem, onDeleteCategory, onDeleteItem, onUpdateCategory }) => {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatFreq, setNewCatFreq] = useState<'DAILY' | 'MANUAL'>('DAILY');
  const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleAddCat = () => {
      if(newCatName) {
          onAddCategory(newCatName, newCatFreq);
          setNewCatName('');
          setNewCatFreq('DAILY');
          setShowAddCat(false);
      }
  };

  const handleAddItem = (catId: string) => {
      if(newItemName) {
          onAddItem(catId, newItemName);
          setNewItemName('');
          setAddingItemTo(null);
      }
  };

  const toggleFreq = (cat: ChecklistCategory, e: React.MouseEvent) => {
      e.stopPropagation();
      const newFreq = cat.resetFrequency === 'DAILY' ? 'MANUAL' : 'DAILY';
      onUpdateCategory(cat.id, { resetFrequency: newFreq });
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-4 space-y-6">
      <div className="border-l-4 border-yellow-500 pl-4 py-2 flex justify-between items-end bg-gradient-to-r from-yellow-500/10 to-transparent rounded-r-lg">
        <div>
            <h2 className="text-2xl font-black font-display italic uppercase tracking-tighter text-white">PIT WALL</h2>
            <p className="text-xs text-yellow-500 font-tech tracking-[0.2em] mt-1">SYSTEM DIAGNOSTICS & PREP</p>
        </div>
        <button onClick={() => setShowAddCat(true)} className="text-zinc-500 hover:text-white bg-black/40 p-2 rounded-lg border border-white/10"><Plus className="w-5 h-5"/></button>
      </div>

      {showAddCat && (
          <div className="aero-panel rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
              <input 
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-yellow-500 outline-none" 
                placeholder="Protocol Name..."
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
              />
              <div className="flex gap-2">
                  <button 
                    onClick={() => setNewCatFreq('DAILY')}
                    className={`flex-1 py-2 text-xs font-bold border rounded ${newCatFreq === 'DAILY' ? 'bg-white text-black border-white' : 'text-zinc-500 border-white/10'}`}
                  >
                      DAILY
                  </button>
                  <button 
                    onClick={() => setNewCatFreq('MANUAL')}
                    className={`flex-1 py-2 text-xs font-bold border rounded ${newCatFreq === 'MANUAL' ? 'bg-white text-black border-white' : 'text-zinc-500 border-white/10'}`}
                  >
                      MANUAL
                  </button>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowAddCat(false)} className="px-4 py-2 text-zinc-500 text-xs">CANCEL</button>
                  <button onClick={handleAddCat} className="bg-yellow-500 text-black px-4 py-2 font-bold font-display italic rounded text-xs hover:bg-yellow-400">INITIATE</button>
              </div>
          </div>
      )}

      <div className="space-y-4 pb-32">
        {checklists.map(category => {
          const isExpanded = expanded === category.id;
          const allChecked = category.items.length > 0 && category.items.every(i => i.checked);
          const isAdding = addingItemTo === category.id;
          const isDaily = category.resetFrequency === 'DAILY';

          return (
            <div key={category.id} className={`aero-panel rounded-xl overflow-hidden transition-all duration-300 ${allChecked ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-white/10'}`}>
                <div 
                    onClick={() => toggleExpand(category.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center space-x-4">
                        <div className={`w-1.5 h-full self-stretch absolute left-0 top-0 bottom-0 ${allChecked ? 'bg-emerald-500 shadow-[0_0_10px_lime]' : 'bg-zinc-700'}`}></div>
                        <h3 className={`text-lg font-display font-bold uppercase tracking-widest pl-2 ${allChecked ? 'text-emerald-400' : 'text-white'}`}>
                            {category.title}
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-4">
                         <div onClick={(e) => toggleFreq(category, e)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/40 border border-white/5 hover:border-white/20 transition-colors" title={`Change to ${isDaily ? 'MANUAL' : 'DAILY'}`}>
                             {isDaily ? <RotateCw className="w-3 h-3 text-cyan-500"/> : <Lock className="w-3 h-3 text-yellow-500"/>}
                             <span className={`text-[9px] font-tech font-bold ${isDaily ? 'text-cyan-500' : 'text-yellow-500'}`}>{isDaily ? 'AUTO' : 'MANUAL'}</span>
                         </div>
                         
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                    </div>
                </div>

                {isExpanded && (
                    <div className="border-t border-white/5 bg-black/20 animate-in fade-in slide-in-from-top-2 duration-200">
                        {category.items.map(item => (
                            <div 
                                key={item.id} 
                                className="flex items-center justify-between p-3 border-b border-white/5 hover:bg-white/5 group pl-6"
                            >
                                <div 
                                    onClick={() => onToggleItem(category.id, item.id, !item.checked)}
                                    className="flex items-center flex-1 cursor-pointer"
                                >
                                    {item.checked ? (
                                        <CheckSquare className="w-5 h-5 text-emerald-500 mr-4 shadow-neon-green" />
                                    ) : (
                                        <Square className="w-5 h-5 text-zinc-600 mr-4 group-hover:text-zinc-400" />
                                    )}
                                    <span className={`font-tech text-sm uppercase tracking-wide ${item.checked ? 'text-zinc-600 line-through decoration-zinc-700' : 'text-zinc-200'}`}>
                                        {item.text}
                                    </span>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault(); e.stopPropagation();
                                        onDeleteItem(category.id, item.id);
                                    }}
                                    className="text-zinc-700 hover:text-red-500 px-2"
                                >
                                    <Trash2 className="w-4 h-4 pointer-events-none"/>
                                </button>
                            </div>
                        ))}
                        
                        {isAdding ? (
                            <div className="p-3 flex gap-2 pl-6 bg-black/40">
                                <input 
                                    className="flex-1 bg-transparent border-b border-white/20 p-2 text-white font-mono text-xs focus:border-apex-carb outline-none" 
                                    placeholder="Check item..."
                                    autoFocus
                                    value={newItemName}
                                    onChange={e => setNewItemName(e.target.value)}
                                />
                                <button onClick={() => handleAddItem(category.id)} className="text-apex-carb font-bold text-xs hover:text-white">SAVE</button>
                                <button onClick={() => setAddingItemTo(null)} className="text-zinc-500"><X className="w-4 h-4"/></button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setAddingItemTo(category.id)}
                                className="w-full py-3 text-center text-[10px] font-display font-bold text-zinc-500 hover:text-white hover:bg-white/5 border-b border-white/5 tracking-widest uppercase"
                            >
                                + ADD SEQUENCE
                            </button>
                        )}

                        <div className="p-3 flex justify-between items-center bg-black/30">
                             <button 
                                onClick={(e) => { 
                                    e.preventDefault(); e.stopPropagation();
                                    onDeleteCategory(category.id); 
                                }}
                                className="text-zinc-700 hover:text-red-600 p-2"
                             >
                                <Trash2 className="w-4 h-4 pointer-events-none"/>
                             </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); onReset(category.id); }}
                                className="flex items-center text-[10px] font-tech font-bold text-zinc-500 hover:text-white uppercase space-x-2 px-3 py-1 rounded border border-white/10 hover:border-white/50 transition-colors"
                             >
                                <RefreshCw className="w-3 h-3" />
                                <span>Reset Status</span>
                             </button>
                        </div>
                    </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PitStop;