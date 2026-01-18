
import React from 'react';
import { Icon } from './Icon';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  iconName: string;
  onClick: () => void;
  variant?: 'brand' | 'accent' | 'stone';
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  subtitle,
  iconName, 
  onClick, 
  variant = 'brand',
  className = ''
}) => {
  const colors = {
    brand: {
      bg: 'bg-brand-50',
      text: 'text-brand-600',
      border: 'border-brand-100/50',
      bar: 'bg-brand-200/50'
    },
    accent: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100/50',
      bar: 'bg-indigo-200/50'
    },
    stone: {
      bg: 'bg-stone-50',
      text: 'text-stone-600',
      border: 'border-stone-100/50',
      bar: 'bg-stone-200/50'
    }
  };

  const active = colors[variant];

  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-[2rem] bg-white border border-stone-100 shadow-soft flex flex-col items-start justify-between text-left transition-all duration-300 hover:border-brand-200 hover:shadow-card active:scale-95 active:shadow-pressed overflow-hidden aspect-[4/5] ${className}`}
    >
      <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${active.bar} rounded-r-full`}></div>
      
      <div className={`w-14 h-14 ${active.bg} rounded-xl flex items-center justify-center ${active.text} shadow-sm border ${active.border}`}>
        <Icon name={iconName} size={32} />
      </div>
      
      <div className="mt-4 relative z-10 w-full overflow-hidden">
        <h3 className="font-extrabold text-2xl text-stone-900 tracking-tight leading-tight truncate">{title}</h3>
        {subtitle && (
          <p className="text-stone-500 font-bold text-[10px] mt-2 uppercase tracking-widest opacity-80 truncate">
            {subtitle}
          </p>
        )}
      </div>

      <div className="absolute top-6 right-6 text-stone-200 group-hover:text-brand-300 transition-colors">
        <Icon name="chevron-right" size={20} />
      </div>
    </button>
  );
};
