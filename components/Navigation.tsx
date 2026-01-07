import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Fuel, ClipboardList, BookOpen } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems: { view: ViewState; label: string; icon: React.FC<any> }[] = [
    { view: 'DASHBOARD', label: 'DASH', icon: LayoutDashboard },
    { view: 'INJECTOR', label: 'FUEL', icon: Fuel },
    { view: 'LIBRARY', label: 'TANK', icon: BookOpen },
    { view: 'PITSTOP', label: 'PIT', icon: ClipboardList },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
      <div className="aero-panel w-full max-w-sm rounded-2xl flex items-center justify-between p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-visible pointer-events-auto">
        
        {/* F1 Rain Light - Flashing Center Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 z-[-1]">
            <div className="w-16 h-8 bg-black/80 rounded-b-xl border border-white/5 flex items-center justify-center">
                 <div className="w-8 h-2 bg-red-600 rounded-full animate-f1-flash shadow-[0_0_15px_#ef4444]"></div>
            </div>
        </div>

        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;
          
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className="flex-1 flex flex-col items-center justify-center py-2 relative group"
            >
              {/* Active Glow Backdrop */}
              {isActive && (
                 <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-xl"></div>
              )}
              
              <div className={`relative z-10 p-2 transition-all duration-300 transform ${isActive ? '-translate-y-2 scale-110' : 'group-hover:-translate-y-1'}`}>
                  <Icon 
                    className={`w-6 h-6 transition-all duration-300 ${
                        isActive 
                        ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    }`} 
                  />
                  
                  {/* Active Dot - Rain Light Style */}
                  {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_5px_red]"></div>
                  )}
              </div>
              
              <span className={`text-[8px] font-display font-bold tracking-widest uppercase transition-all duration-300 ${isActive ? 'text-white opacity-100' : 'text-zinc-600 opacity-0 group-hover:opacity-100'}`}>
                  {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;