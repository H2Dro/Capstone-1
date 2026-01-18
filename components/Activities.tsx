
import React from 'react';
import { Icon } from './Icon';
import { ActivityItem } from '../types';

interface ActivitiesProps {
  activities: ActivityItem[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onSelect: (activity: ActivityItem) => void;
  onBack: () => void;
}

export const Activities: React.FC<ActivitiesProps> = ({ 
  activities, 
  onAdd, 
  onDelete,
  onSelect,
  onBack 
}) => {
  return (
    <div className="flex flex-col animate-fade-in pb-32">
      {/* Header - Tightened spacing */}
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl shadow-soft border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
            <Icon name="back" size={24} />
        </button>
        <h1 className="text-3xl font-black text-slate-900 leading-none">Activities</h1>
      </div>

      {/* List */}
      <div className="space-y-4">
        {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-brand-50 rounded-[2rem] flex items-center justify-center text-brand-300 mb-5">
                    <Icon name="sun" size={40} />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-2">A quiet day?</h2>
                <p className="text-slate-500 font-bold mb-6 text-sm leading-relaxed">Let's add something fun to your schedule, like art or swimming.</p>
                <button 
                  onClick={onAdd}
                  className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-brand-100 active:scale-95 flex items-center gap-2.5 transition-all"
                >
                    <Icon name="plus" size={20} />
                    <span>Add Now</span>
                </button>
            </div>
        ) : (
            activities.map((item) => (
                <button 
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="w-full bg-white rounded-[2rem] p-4 border border-slate-100 shadow-soft flex items-center gap-4 group transition-all text-left active:scale-[0.98]"
                >
                    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shrink-0 border border-brand-100 group-hover:scale-105 transition-transform">
                        <Icon name={item.icon || 'sun'} size={28} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Icon name="clock" size={12} className="text-brand-400" />
                          <span className="text-brand-600 font-black text-[10px] uppercase tracking-wider">{item.time}</span>
                        </div>
                        <h4 className="font-extrabold text-xl text-slate-900 leading-tight truncate">{item.title}</h4>
                        {item.date && (
                            <span className="text-slate-400 font-bold text-[10px] uppercase mt-1 block">
                                {item.date}
                            </span>
                        )}
                    </div>

                    <div className="w-10 h-10 flex items-center justify-center text-slate-200 group-hover:text-brand-300 transition-colors">
                        <Icon name="chevron-right" size={20} />
                    </div>
                </button>
            ))
        )}
      </div>

      {/* Motivational Card - More compact */}
      {activities.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-br from-[#5D5FEF] to-[#4F46E5] rounded-[2rem] text-white shadow-xl shadow-brand-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
              <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md border border-white/20">
                      <Icon name="award" size={24} />
                  </div>
                  <div>
                      <p className="font-black text-lg leading-tight">Stay Active!</p>
                      <p className="text-indigo-100 text-xs font-bold opacity-80">You're doing great today.</p>
                  </div>
              </div>
          </div>
      )}

      {/* Floating Add Button - Adjusted position */}
      <div className="fixed bottom-28 right-6">
         <button 
           onClick={onAdd}
           className="w-14 h-14 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-brand-200 border-4 border-white active:scale-90 transition-all z-20"
         >
            <Icon name="plus" size={28} />
         </button>
      </div>
    </div>
  );
};
