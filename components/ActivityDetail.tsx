
import React from 'react';
import { Icon } from './Icon';
import { ActivityItem } from '../types';

interface ActivityDetailProps {
  activity: ActivityItem;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity, onBack, onDelete }) => {
  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col animate-fade-in relative">
      {/* Dynamic Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-br from-[#5D5FEF] to-[#4F46E5] z-0"></div>
      
      {/* Header Over Overlay */}
      <header className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all"
        >
          <Icon name="back" size={24} />
        </button>
        <button 
          onClick={() => { onDelete(activity.id); onBack(); }}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/60 border border-white/10 active:scale-95 transition-all"
        >
          <Icon name="trash" size={20} />
        </button>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 px-8 pt-4 pb-12 flex flex-col items-center text-center text-white">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-6 border border-white/20 shadow-xl">
           <Icon name={activity.icon} size={48} />
        </div>
        <h1 className="text-4xl font-black tracking-tight leading-tight mb-2">{activity.title}</h1>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/10">
           <Icon name="clock" size={16} />
           <span>{activity.time}</span>
        </div>
      </div>

      {/* Content Card */}
      <main className="relative z-10 flex-1 bg-white rounded-t-[3rem] px-8 pt-10 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="space-y-8">
           <section className="space-y-3">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Location</h3>
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-[#F8FAFF] border border-[#EEF2FF]">
                 <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#4F46E5] shadow-sm border border-slate-50">
                    <Icon name="location" size={24} />
                 </div>
                 <div>
                    <p className="font-bold text-slate-900 text-lg leading-none">{activity.location || 'Community Center'}</p>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">Silver Oaks Main Hall</p>
                 </div>
              </div>
           </section>

           <section className="space-y-3">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">About Activity</h3>
              <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                 <p className="text-slate-600 font-medium leading-relaxed text-lg">
                    {activity.description || "This activity is part of our daily wellness program designed to keep you engaged, healthy, and connected with the community."}
                 </p>
              </div>
           </section>
           
           <section className="space-y-3 pb-20">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Scheduled Date</h3>
              <div className="flex items-center gap-4">
                 <div className="px-5 py-3 rounded-2xl bg-brand-50 text-brand-600 font-black text-lg">
                    {activity.date || 'Thursday, Oct 24'}
                 </div>
              </div>
           </section>
        </div>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-20">
         <button 
           onClick={onBack}
           className="w-full py-5 bg-[#4F46E5] text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-[#4f46e5]/40 active:scale-95 transition-all"
         >
            Back to Activities
         </button>
      </div>
    </div>
  );
};
