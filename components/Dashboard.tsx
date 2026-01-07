import React, { useState } from 'react';
import { DailyLog } from '../types';
import Gauge from './Gauge';
import { ChevronLeft, ChevronRight, Zap, CalendarDays, Activity, X, RotateCcw, Flame, Trophy, Flag, BarChart2, Calendar } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface DashboardProps {
  currentDate: string;
  log: DailyLog | undefined;
  historyData: any[]; // Expects full history
  onNavigateDate: (dateStr: string) => void;
  onInject: () => void;
  onQuickInject: (type: 'Carb' | 'Protein' | 'Fat', value: number) => void;
  onDeleteEntry: (date: string, id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentDate, log, historyData, onNavigateDate, onInject, onQuickInject, onDeleteEntry }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [showLogViewer, setShowLogViewer] = useState(false);
  
  // Chart Date Range State
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  
  // Quick Inject & Calculator State
  const [activeQuickAdd, setActiveQuickAdd] = useState<'Carb' | 'Protein' | 'Fat' | null>(null);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [newNumber, setNewNumber] = useState(true);

  const c = log?.totalCarbs || 0;
  const p = log?.totalProtein || 0;
  const f = log?.totalFat || 0;
  
  const totalCalories = Math.round((c * 4) + (p * 4) + (f * 9));

  const TARGET_C = 300;
  const TARGET_P = 200;
  const TARGET_F = 80;

  // Filter history based on manual range
  const displayedHistory = historyData.filter(d => d.fullDate >= startDate && d.fullDate <= endDate);

  // --- CALCULATOR LOGIC ---
  const handleCalcInput = (char: string) => {
      if (char === 'C') {
          setCalcDisplay('0');
          setNewNumber(true);
          return;
      }
      if (char === 'BS') { 
          if (newNumber) return;
          if (calcDisplay.length === 1) {
              setCalcDisplay('0');
              setNewNumber(true);
          } else {
              setCalcDisplay(prev => prev.slice(0, -1));
          }
          return;
      }
      if (['+', '-', '*', '/'].includes(char)) {
          setCalcDisplay(prev => prev + char);
          setNewNumber(false);
          return;
      }
      if (char === '=') {
          try {
              // eslint-disable-next-line no-eval
              const result = eval(calcDisplay);
              setCalcDisplay(String(Math.round(result)));
              setNewNumber(true);
          } catch (e) {
              setCalcDisplay('ERR');
              setNewNumber(true);
          }
          return;
      }
      if (newNumber && !['+', '-', '*', '/'].some(op => calcDisplay.includes(op))) {
          setCalcDisplay(char);
          setNewNumber(false);
      } else {
          setCalcDisplay(prev => prev === '0' ? char : prev + char);
          setNewNumber(false);
      }
  };

  const handleQuickSubmit = () => {
    if (activeQuickAdd) {
        let val = 0;
        try { val = eval(calcDisplay); } catch { val = 0; }
        if (val > 0) {
            onQuickInject(activeQuickAdd, Math.round(val));
            setActiveQuickAdd(null);
            setCalcDisplay('0');
            setNewNumber(true);
        }
    }
  };

  // --- RENDERERS ---

  const renderQuickAddModal = () => {
      if (!activeQuickAdd) return null;
      const colors = { Carb: 'cyan', Protein: 'rose', Fat: 'yellow' };
      const themeColor = colors[activeQuickAdd];
      const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'];
      
      return (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="w-full max-w-sm aero-panel border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${themeColor}-500/20 blur-3xl rounded-full`}></div>
                  <button onClick={() => { setActiveQuickAdd(null); setCalcDisplay('0'); }} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
                  <h3 className={`text-xl font-display italic font-black uppercase mb-1 text-white`}>
                      ADD <span className={`text-${themeColor}-500`}>{activeQuickAdd}</span>
                  </h3>
                  <div className="bg-black/50 border border-white/5 p-4 mb-4 text-right rounded-xl shadow-inner">
                      <span className={`text-5xl font-display font-bold text-white tracking-widest`}>{calcDisplay}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                      {buttons.map(btn => (
                          <button
                            key={btn}
                            onClick={() => handleCalcInput(btn)}
                            className={`h-14 text-xl font-display font-bold rounded-xl active:scale-95 transition-all shadow-lg ${
                                ['/', '*', '-', '+', '='].includes(btn) 
                                ? `bg-zinc-800 text-${themeColor}-400 border border-white/5` 
                                : btn === 'C' ? 'bg-red-900/20 text-red-500 border border-red-500/20'
                                : 'bg-zinc-900/80 text-white border border-white/5 hover:bg-zinc-800'
                            }`}
                          >
                              {btn}
                          </button>
                      ))}
                  </div>
                  <button 
                    onClick={handleQuickSubmit}
                    className={`w-full bg-${themeColor}-500 text-black font-black font-display text-lg py-4 rounded-xl uppercase hover:brightness-110 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
                  >
                      INJECT FUEL
                  </button>
              </div>
          </div>
      );
  };

  const renderLogViewer = () => (
      <div className="fixed inset-0 z-[55] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md aero-panel rounded-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-white/10">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
                  <h3 className="text-lg font-display font-bold text-white flex items-center gap-2 italic">
                      <RotateCcw className="w-5 h-5 text-yellow-500" /> 
                      FLIGHT LOG
                  </h3>
                  <button onClick={() => setShowLogViewer(false)}><X className="w-6 h-6 text-zinc-500 hover:text-white" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                  {log && log.entries.length > 0 ? (
                      [...log.entries].reverse().map(entry => (
                          <div key={entry.id} className="flex items-center justify-between bg-zinc-900/40 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                              <div>
                                  <div className="text-white font-display font-bold text-sm uppercase tracking-wide">{entry.foodName}</div>
                                  <div className="text-xs font-mono text-zinc-500 flex gap-2 mt-1">
                                      {entry.carbs > 0 && <span className="text-cyan-400">C:{entry.carbs}</span>}
                                      {entry.protein > 0 && <span className="text-rose-400">P:{entry.protein}</span>}
                                      {entry.fat > 0 && <span className="text-yellow-400">F:{entry.fat}</span>}
                                  </div>
                              </div>
                              <button 
                                onClick={(e) => {
                                    e.preventDefault(); e.stopPropagation();
                                    onDeleteEntry(currentDate, entry.id);
                                }}
                                className="p-2 text-zinc-600 hover:text-red-500 bg-black/20 rounded-lg"
                              >
                                  <X className="w-4 h-4 pointer-events-none" />
                              </button>
                          </div>
                      ))
                  ) : (
                      <div className="text-center text-zinc-600 font-tech uppercase tracking-widest py-10">System Idle // No Data</div>
                  )}
              </div>
          </div>
      </div>
  );

  const renderTelemetry = () => {
    const pieData = [
        { name: 'Carbs', value: c, color: '#06b6d4' },
        { name: 'Protein', value: p, color: '#f43f5e' },
        { name: 'Fat', value: f, color: '#eab308' },
    ].filter(d => d.value > 0);

    return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-end md:items-center justify-center animate-in slide-in-from-bottom-10 duration-200">
        <div className="aero-panel w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl h-[95vh] md:h-auto flex flex-col border border-white/10">
            
            {/* Telemetry Header */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-black/80 to-transparent border-b border-white/10 relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-checkered-pattern opacity-30"></div>
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2 italic">
                    <Activity className="text-apex-papaya" /> TELEMETRY
                </h3>
                <button onClick={() => setShowTelemetry(false)}><X className="w-6 h-6 text-zinc-500 hover:text-white" /></button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-6 pb-24">
                
                {/* CALORIE COUNTER */}
                <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-apex-papaya/10 blur-3xl rounded-full group-hover:bg-apex-papaya/20 transition-all animate-pulse-slow"></div>
                     <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-center gap-2 text-zinc-500 font-tech text-sm uppercase tracking-widest mb-1">
                            <Flame className="w-4 h-4 text-apex-papaya" /> Today's Energy
                        </div>
                        <div className="text-6xl font-display font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            {totalCalories} <span className="text-xl not-italic text-zinc-600">kcal</span>
                        </div>
                     </div>
                </div>

                {/* LINE CHART with Manual Date Picker */}
                <div className="w-full bg-black/20 rounded-2xl border border-white/5 p-4">
                    <div className="flex flex-col gap-3 mb-4 border-b border-white/5 pb-4">
                        <h4 className="text-xs font-tech text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <BarChart2 className="w-3 h-3 text-cyan-500" /> Performance Trend
                        </h4>
                        
                        {/* Custom Date Range Pickers */}
                        <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/10">
                            <div className="flex items-center gap-1 flex-1">
                                <span className="text-[9px] text-zinc-500 font-bold">START</span>
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-transparent text-white text-xs font-mono outline-none w-full cursor-pointer"
                                />
                            </div>
                            <div className="w-px h-4 bg-white/10"></div>
                            <div className="flex items-center gap-1 flex-1">
                                <span className="text-[9px] text-zinc-500 font-bold">END</span>
                                <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-transparent text-white text-xs font-mono outline-none w-full cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={displayedHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="date" stroke="#555" fontSize={9} tickLine={false} axisLine={false} tick={{fontFamily: 'Rajdhani'}} interval="preserveStartEnd" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #333', borderRadius: '8px', fontFamily: 'Rajdhani', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="c" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{r: 4, fill: '#06b6d4'}} />
                                <Line type="monotone" dataKey="p" stroke="#f43f5e" strokeWidth={2} dot={false} activeDot={{r: 4, fill: '#f43f5e'}} />
                                <Line type="monotone" dataKey="f" stroke="#eab308" strokeWidth={2} dot={false} activeDot={{r: 4, fill: '#eab308'}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PIE CHART - Increased Height for Visibility */}
                <div className="min-h-[300px] w-full flex flex-col items-center bg-black/20 rounded-2xl border border-white/5 p-4">
                    <h4 className="text-xs font-tech text-zinc-400 mb-2 uppercase tracking-widest w-full text-left flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-yellow-500" /> Fuel Mix
                    </h4>
                    {pieData.length > 0 ? (
                        <div className="w-full h-64 relative">
                           <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #333', borderRadius: '8px', fontFamily: 'Rajdhani' }} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={40}
                                    iconType="circle"
                                    wrapperStyle={{ fontFamily: 'Rajdhani', fontSize: '12px', paddingTop: '20px' }} 
                                />
                            </PieChart>
                        </ResponsiveContainer> 
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 font-tech text-sm">NO DATA</div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )};

  const renderCalendar = () => {
    const today = new Date();
    const current = new Date(currentDate);
    const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
    const days = [];
    for(let i=0; i<firstDay; i++) days.push(null);
    for(let i=1; i<=daysInMonth; i++) days.push(i);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="aero-panel w-full max-w-sm rounded-2xl p-4 shadow-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-checkered-pattern opacity-50"></div>
                
                <div className="flex justify-between items-center mb-6 mt-2">
                    <h3 className="text-xl font-display font-bold italic text-white">MISSION DATE</h3>
                    <button onClick={() => setShowCalendar(false)}><X className="w-6 h-6 text-zinc-500" /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                    {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-zinc-500 font-tech font-bold text-xs">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((d, idx) => (
                        <button 
                            key={idx}
                            disabled={!d}
                            onClick={() => {
                                if(d) {
                                    const newDate = new Date(current.getFullYear(), current.getMonth(), d);
                                    const year = newDate.getFullYear();
                                    const month = String(newDate.getMonth() + 1).padStart(2, '0');
                                    const day = String(d).padStart(2, '0');
                                    onNavigateDate(`${year}-${month}-${day}`);
                                    setShowCalendar(false);
                                }
                            }}
                            className={`aspect-square flex items-center justify-center font-display text-sm font-bold rounded-lg transition-all ${
                                !d ? 'invisible' : 
                                (d === current.getDate()) 
                                ? 'bg-apex-carb text-black shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-110' 
                                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                            }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-4 relative">
      {showCalendar && renderCalendar()}
      {showTelemetry && renderTelemetry()}
      {showLogViewer && renderLogViewer()}
      {renderQuickAddModal()}

      {/* Header - Cockpit Style */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 sticky top-0 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none"></div>
        
        <button 
          onClick={() => {
             const d = new Date(currentDate);
             d.setDate(d.getDate() - 1);
             onNavigateDate(d.toISOString().split('T')[0]);
          }}
          className="relative z-10 p-3 bg-white/5 rounded-full hover:bg-white/10 backdrop-blur-md transition-all active:scale-95 border border-white/5"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <div 
            onClick={() => setShowCalendar(true)}
            className="relative z-10 flex flex-col items-center cursor-pointer group"
        >
          <div className="flex items-center gap-2 bg-white/5 px-6 py-1.5 rounded-full backdrop-blur-md border border-white/5 group-hover:border-apex-carb/50 transition-all shadow-glass">
              <CalendarDays className="w-3 h-3 text-apex-carb" />
              <span className="text-sm font-display font-bold italic tracking-[0.1em] text-white glow-text">{currentDate}</span>
          </div>
          
          <div className="flex items-center gap-1 mt-1">
               <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
               <div className="text-[9px] text-zinc-500 font-tech uppercase tracking-widest">Race Control</div>
          </div>
        </div>

        <button 
          onClick={() => {
             const d = new Date(currentDate);
             d.setDate(d.getDate() + 1);
             onNavigateDate(d.toISOString().split('T')[0]);
          }}
          className="relative z-10 p-3 bg-white/5 rounded-full hover:bg-white/10 backdrop-blur-md transition-all active:scale-95 border border-white/5"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Gauges - Dashboard Cluster */}
      <div className="flex-1 flex flex-col justify-start px-4 space-y-6 relative z-10 mt-4">
        
        {/* RPM Gauges Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
                <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity animate-pulse-slow"></div>
                <Gauge onClick={() => setActiveQuickAdd('Carb')} value={c} max={TARGET_C} color="#06b6d4" label="CARBS" subLabel="TURBO" />
            </div>
            <div className="relative group">
                <div className="absolute inset-0 bg-rose-500/10 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity animate-pulse-slow"></div>
                <Gauge onClick={() => setActiveQuickAdd('Protein')} value={p} max={TARGET_P} color="#f43f5e" label="PROTEIN" subLabel="ENGINE" />
            </div>
            <div className="relative group">
                <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity animate-pulse-slow"></div>
                <Gauge onClick={() => setActiveQuickAdd('Fat')} value={f} max={TARGET_F} color="#eab308" label="FATS" subLabel="OIL" />
            </div>
        </div>

        {/* Stats Strip - Glass Aero Bar */}
        <div className="mx-2 p-1 aero-panel rounded-2xl flex justify-between items-center shadow-lg relative overflow-hidden">
             {/* Checkered Texture Overlay */}
             <div className="absolute top-0 right-0 w-8 h-full bg-checkered-pattern opacity-10"></div>
             
            <button onClick={() => setShowLogViewer(true)} className="flex-1 py-3 flex flex-col items-center hover:bg-white/5 rounded-xl transition-colors group">
                <div className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-tech uppercase tracking-wider mb-1 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Logs
                </div>
                <div className="text-xl font-display font-bold text-white group-hover:scale-110 transition-transform">{log?.entries.length || 0}</div>
            </button>
            
            <div className="w-px h-8 bg-white/10"></div>

            <button onClick={() => setShowTelemetry(true)} className="flex-1 py-3 flex flex-col items-center hover:bg-white/5 rounded-xl transition-colors group">
                 <div className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-tech uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Data
                 </div>
                 <div className="text-xl font-display font-bold text-emerald-400 group-hover:scale-110 transition-transform tracking-widest italic shadow-neon-green">VIEW</div>
            </button>
            
            <div className="w-px h-8 bg-white/10"></div>

            <div className="flex-1 py-3 flex flex-col items-center">
                <div className="text-[10px] text-zinc-500 font-tech uppercase tracking-wider mb-1">Effic.</div>
                <div className="text-xl font-display font-bold text-white">98%</div>
            </div>
        </div>
      </div>

      {/* Inject Button - CRITICAL FIX: Increased bottom padding relative to container */}
      <div className="px-6 pb-48">
        <button 
          onClick={onInject}
          className="w-full group relative overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300 active:scale-[0.98] border border-cyan-500/30"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-400 skew-x-12 scale-150 translate-x-[-20%] group-hover:translate-x-[0%] transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
            
            <div className="relative py-6 flex items-center justify-center gap-4">
                <div className="bg-black/20 p-3 rounded-full backdrop-blur-sm border border-white/20">
                    <Zap className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="text-left">
                    <div className="text-2xl font-black font-display italic text-black tracking-tighter">INJECT FUEL</div>
                    <div className="text-[10px] font-tech font-bold text-black/70 tracking-[0.3em] uppercase flex items-center gap-2">
                        Initialize Sequence <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                </div>
            </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;