import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface GaugeProps {
  value: number;
  max: number;
  color: string;
  label: string;
  subLabel?: string;
  onClick?: () => void;
}

const Gauge: React.FC<GaugeProps> = ({ value, max, color, label, subLabel, onClick }) => {
  const percentage = Math.min(100, (value / max) * 100);
  
  const data = [
    {
      name: label,
      value: percentage,
      fill: color,
    },
  ];

  return (
    <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center relative w-full h-full transition-all duration-300 active:scale-95 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
    >
      <div className="w-full h-36 md:h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
                innerRadius="75%" 
                outerRadius="100%" 
                barSize={12} 
                data={data} 
                startAngle={220} 
                endAngle={-40}
            >
                <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
                />
                <RadialBar
                background={{ fill: 'rgba(255,255,255,0.05)' }}
                dataKey="value"
                cornerRadius={10} // Rounded ends for fluid look
                />
            </RadialBarChart>
        </ResponsiveContainer>
        
        {/* Center Text with Glow */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
            <span 
                className="text-4xl md:text-5xl font-black font-display tracking-tighter italic drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]" 
                style={{ color, textShadow: `0 0 20px ${color}80` }}
            >
                {Math.round(value)}
            </span>
            <div className="h-px w-12 bg-white/20 my-1"></div>
            <span className="text-[10px] md:text-xs uppercase text-zinc-500 font-tech font-bold tracking-[0.2em]">
                {subLabel || 'GRAMS'}
            </span>
        </div>
      </div>
      
      {/* Label Badge */}
      <div className="mt-[-20px] bg-black/40 backdrop-blur border border-white/10 px-3 py-1 rounded-full">
        <span className="text-xs font-display uppercase text-zinc-300 font-bold tracking-widest">
            {label}
        </span>
      </div>
    </div>
  );
};

export default Gauge;