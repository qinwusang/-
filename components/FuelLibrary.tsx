import React, { useState, useRef } from 'react';
import { FoodItem } from '../types';
import { Plus, Trash2, X, Save, Edit2, Upload, Image as ImageIcon, Search } from 'lucide-react';

interface FuelLibraryProps {
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
  onUpdateFood: (food: FoodItem) => void;
  onDeleteFood: (id: string) => void;
}

const FuelLibrary: React.FC<FuelLibraryProps> = ({ foods, onAddFood, onUpdateFood, onDeleteFood }) => {
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<'Carb' | 'Protein' | 'Fat' | 'Liquid'>('Carb');
  const [newC, setNewC] = useState('');
  const [newP, setNewP] = useState('');
  const [newF, setNewF] = useState('');
  const [newImage, setNewImage] = useState('');

  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const openAdd = () => {
      setEditId(null);
      setNewName('');
      setNewCat('Carb');
      setNewC('');
      setNewP('');
      setNewF('');
      setNewImage('');
      setShowForm(true);
  }

  const openEdit = (food: FoodItem) => {
      setEditId(food.id);
      setNewName(food.name);
      setNewCat(food.category);
      setNewC(String(food.carbsPer100g));
      setNewP(String(food.proteinPer100g));
      setNewF(String(food.fatPer100g));
      setNewImage(food.image);
      setShowForm(true);
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          alert('Image too large. Please select an image under 2MB.');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
          setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if(!newName) return;
    const imageToUse = newImage || `https://picsum.photos/100/100?random=${Date.now()}`;

    if (editId) {
        const updatedFood: FoodItem = {
            id: editId,
            name: newName,
            image: imageToUse,
            category: newCat,
            carbsPer100g: parseFloat(newC) || 0,
            proteinPer100g: parseFloat(newP) || 0,
            fatPer100g: parseFloat(newF) || 0,
        };
        onUpdateFood(updatedFood);
    } else {
        const newFood: FoodItem = {
            id: Date.now().toString(),
            name: newName,
            image: imageToUse,
            category: newCat,
            carbsPer100g: parseFloat(newC) || 0,
            proteinPer100g: parseFloat(newP) || 0,
            fatPer100g: parseFloat(newF) || 0,
        };
        onAddFood(newFood);
    }
    setShowForm(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-black/80 to-transparent backdrop-blur-md sticky top-0 z-20">
         <div>
            <h2 className="text-xl font-display font-bold italic uppercase text-white flex items-center gap-2">
                FUEL TANK <span className="text-apex-carb text-sm not-italic font-mono bg-apex-carb/10 px-2 py-0.5 rounded">V.2.0</span>
            </h2>
         </div>
         <button 
            onClick={openAdd}
            className="bg-apex-carb text-black hover:bg-white p-2 rounded-lg transition-colors shadow-neon-blue"
         >
            <Plus className="w-5 h-5" />
         </button>
      </div>

      <div className="px-4 py-2 bg-black/20">
          <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500"/>
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="SEARCH RESOURCES..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm font-tech text-white focus:outline-none focus:border-apex-carb/50"
              />
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-3">
        {filteredFoods.map(food => (
            <div key={food.id} className="aero-panel rounded-xl p-0 flex overflow-hidden group hover:border-white/30 transition-all">
                {/* Image Section - Slanted */}
                <div className="w-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 z-10"></div>
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                {/* Content Section */}
                <div className="flex-1 p-3 flex flex-col justify-center relative">
                    <div className="absolute top-0 right-0 p-1">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            food.category === 'Carb' ? 'bg-cyan-900/50 text-cyan-400' :
                            food.category === 'Protein' ? 'bg-rose-900/50 text-rose-400' :
                            food.category === 'Fat' ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-zinc-800 text-zinc-400'
                        }`}>{food.category.toUpperCase()}</span>
                    </div>

                    <h3 className="font-display font-bold text-white text-sm tracking-wide italic">{food.name}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-xs font-tech text-zinc-400">
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_5px_cyan]"></div> {food.carbsPer100g}</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_rose]"></div> {food.proteinPer100g}</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_5px_yellow]"></div> {food.fatPer100g}</span>
                    </div>
                </div>

                {/* Actions - Slide in on hover on desktop, always visible on touch but subtle */}
                <div className="flex flex-col border-l border-white/5 bg-black/20">
                    <button 
                        onClick={(e) => { e.stopPropagation(); openEdit(food); }}
                        className="flex-1 px-3 text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <Edit2 className="w-4 h-4 pointer-events-none" />
                    </button>
                    <div className="h-px bg-white/5"></div>
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteFood(food.id); }}
                        className="flex-1 px-3 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 pointer-events-none" />
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* Add/Edit Food Modal */}
      {showForm && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-6 animate-in fade-in duration-200">
             <div className="w-full max-w-sm aero-panel rounded-2xl border border-white/10 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-display font-black italic text-white">{editId ? 'MODIFY SPECS' : 'NEW COMPONENT'}</h3>
                    <button onClick={() => setShowForm(false)}><X className="text-zinc-500 hover:text-white" /></button>
                </div>
                
                <div className="space-y-4">
                    <div className="w-full flex justify-center">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center cursor-pointer hover:border-apex-carb transition-colors relative overflow-hidden group"
                        >
                            {newImage ? (
                                <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-zinc-600 group-hover:text-apex-carb transition-colors">
                                    <ImageIcon className="w-6 h-6 mb-1" />
                                    <span className="text-[9px] font-tech uppercase">Upload</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-tech uppercase tracking-widest">Name</label>
                        <input className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white font-display focus:border-apex-carb outline-none" placeholder="e.g. High Octane Rice" value={newName} onChange={e => setNewName(e.target.value)} />
                    </div>
                    
                    <div className="flex gap-2">
                        {['Carb', 'Protein', 'Fat', 'Liquid'].map(c => (
                            <button 
                                key={c} 
                                onClick={() => setNewCat(c as any)}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded border transition-all ${newCat === c ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-white/10'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <label className="text-[10px] text-cyan-500 font-bold font-tech">CARBS</label>
                            <input type="number" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white font-mono" placeholder="0" value={newC} onChange={e => setNewC(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-rose-500 font-bold font-tech">PRO</label>
                            <input type="number" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white font-mono" placeholder="0" value={newP} onChange={e => setNewP(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-yellow-500 font-bold font-tech">FAT</label>
                            <input type="number" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white font-mono" placeholder="0" value={newF} onChange={e => setNewF(e.target.value)} />
                        </div>
                    </div>
                </div>

                <button onClick={handleSave} className="w-full bg-emerald-500 text-black font-bold font-display italic py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    <Save className="w-5 h-5" /> {editId ? 'UPDATE DATABASE' : 'SAVE TO DB'}
                </button>
             </div>
        </div>
      )}
    </div>
  );
};

export default FuelLibrary;