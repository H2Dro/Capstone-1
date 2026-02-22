
import React, { useState } from 'react';
import { Icon } from './Icon';
import { ActivityItem } from '../types';

interface ActivityDetailProps {
  activity: ActivityItem;
  onBack: () => void;
  onDelete: (id: string) => void;
  onEdit: (activity: ActivityItem) => void;
}

export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity, onBack, onDelete, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col animate-fade-in relative">
      {/* Dynamic Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-[#5D5FEF] to-[#4F46E5] z-0"></div>
      
      {/* Header */}
      <header className="relative z-10 px-6 pt-10 pb-4 flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all"
        >
          <Icon name="back" size={20} />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(activity)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all"
            aria-label="Edit activity"
          >
            <Icon name="edit" size={18} />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/60 border border-white/10 active:scale-95 transition-all"
          >
            <Icon name="trash" size={18} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 px-8 pt-2 pb-8 flex flex-col items-center text-center text-white">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[1.75rem] flex items-center justify-center mb-4 border border-white/20 shadow-xl">
           <Icon name={activity.icon} size={40} />
        </div>
        <h1 className="text-3xl font-black tracking-tight leading-tight mb-2">{activity.title}</h1>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">
           <Icon name="clock" size={14} />
           <span>{activity.time}</span>
        </div>
      </div>

      {/* Content Card */}
      <main className="relative z-10 flex-1 bg-white rounded-t-[2.5rem] px-6 pt-8 shadow-[0_-15px_30px_rgba(0,0,0,0.05)] -mt-2">
        <div className="space-y-6">
           <section className="space-y-2">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Location</h3>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8FAFF] border border-[#EEF2FF]">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#4F46E5] shadow-sm border border-slate-50">
                    <Icon name="location" size={20} />
                 </div>
                 <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-base leading-none truncate">{activity.location || 'Community Center'}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wide">Main Hall</p>
                 </div>
              </div>
           </section>

           <section className="space-y-2">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">About Activity</h3>
              <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                 <p className="text-slate-600 font-medium leading-relaxed text-base">
                    {activity.description || "This activity is part of our daily wellness program designed to keep you engaged, healthy, and connected with the community."}
                 </p>
              </div>
           </section>
           
           <section className="space-y-2 pb-24">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Date</h3>
              <div className="inline-flex px-4 py-2 rounded-xl bg-brand-50 text-brand-600 font-black text-base border border-brand-100">
                {activity.date || 'Thursday, Oct 24'}
              </div>
           </section>
        </div>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20">
         <button 
           onClick={onBack}
           className="w-full py-4 bg-[#4F46E5] text-white rounded-2xl font-black text-lg shadow-2xl shadow-[#4f46e5]/30 active:scale-95 transition-all"
         >
            Back to Activities
         </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-6 animate-fade-in" onClick={() => setShowDeleteConfirm(false)}>
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs text-center space-y-6 shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="trash" size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900">Delete Activity?</h3>
                    <p className="text-slate-400 font-bold text-sm leading-tight">Are you sure you want to remove "{activity.title}" from your schedule?</p>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 bg-slate-100 rounded-xl font-black text-slate-500 uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Keep</button>
                      <button 
                        onClick={() => { onDelete(activity.id); onBack(); }} 
                        className="flex-1 py-4 bg-rose-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-100 active:scale-95 transition-transform"
                      >
                        Delete
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
