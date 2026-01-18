
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
    <div className="flex flex-col animate-fade-in pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 pt-4">
        <button onClick={onBack} className="w-14 h-14 bg-white rounded-3xl shadow-soft border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90">
            <Icon name="back" size={28} />
        </button>
        <h1 className="text-4xl font-black text-slate-900 leading-none">Activities</h1>
      </div>

      {/* List */}
      <div className="space-y-5">
        {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 bg-brand-50 rounded-[2.5rem] flex items-center justify-center text-brand-300 mb-6">
                    <Icon name="sun" size={48} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">A quiet day?</h2>
                <p className="text-slate-500 font-bold mb-8 leading-relaxed">Let's add something fun to your schedule, like art or swimming.</p>
                <button 
                  onClick={onAdd}
                  className="bg-brand-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-brand-100 active:scale-95 flex items-center gap-3"
                >
                    <Icon name="plus" size={24} />
                    <span>Add Now</span>
                </button>
            </div>
        ) : (
            activities.map((item) => (
                <button 
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="w-full bg-white rounded-[2.5rem] p-6 border-2 border-slate-50 shadow-soft flex items-center gap-6 group transition-all text-left active:scale-[0.98]"
                >
                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shrink-0 border border-brand-100 group-hover:scale-110 transition-transform">
                        <Icon name={item.icon || 'sun'} size={32} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="clock" size={14} className="text-brand-400" />
                          <span className="text-brand-600 font-black text-xs uppercase tracking-widest">{item.time}</span>
                        </div>
                        <h4 className="font-extrabold text-2xl text-slate-900 leading-tight truncate">{item.title}</h4>
                        {item.date && (
                            <span className="text-slate-400 font-bold text-xs uppercase mt-2 block">
                                {item.date}
                            </span>
                        )}
                    </div>

                    <div className="w-12 h-12 flex items-center justify-center text-slate-200 group-hover:text-brand-300 transition-colors">
                        <Icon name="chevron-right" size={24} />
                    </div>
                </button>
            ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-32 right-6">
         <button 
           onClick={onAdd}
           className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-brand-200 border-4 border-white active:scale-90 transition-all z-20"
         >
            <Icon name="plus" size={32} />
         </button>
      </div>

      {/* Motivational Card */}
      {activities.length > 0 && (
          <div className="mt-12 p-8 bg-gradient-to-br from-[#5D5FEF] to-[#4F46E5] rounded-[3rem] text-white shadow-xl shadow-brand-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10 flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/30">
                      <Icon name="award" size={32} />
                  </div>
                  <div>
                      <p className="font-black text-xl leading-tight">Stay Active!</p>
                      <p className="text-indigo-100 text-sm font-bold opacity-80">You're making the most of your day.</p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
