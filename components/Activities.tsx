
import React, { useState } from 'react';
import { Icon } from './Icon';
import { ActivityItem } from '../types';
import { ScheduleConflict } from '../services/schedulingService';

interface ActivitiesProps {
  activities: ActivityItem[];
  conflicts?: ScheduleConflict[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (activity: ActivityItem) => void;
  onSelect: (activity: ActivityItem) => void;
  onBack: () => void;
}

export const Activities: React.FC<ActivitiesProps> = ({ 
  activities, 
  conflicts = [],
  onAdd, 
  onDelete,
  onEdit,
  onSelect,
  onBack 
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const activityToDelete = activities.find(a => a.id === deleteConfirmId);

  return (
    <div className="flex flex-col animate-fade-in pb-32">
      {/* Header - Tightened spacing */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl shadow-soft border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
              <Icon name="back" size={24} />
          </button>
          <h1 className="text-3xl font-black text-slate-900 leading-none">Activities</h1>
        </div>
        <button 
          onClick={onAdd} 
          className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
          aria-label="Add activity"
        >
          <Icon name="plus" size={20} />
        </button>
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
                    className={`w-full bg-white rounded-[2rem] p-4 border border-slate-100 shadow-soft flex flex-col gap-2 group transition-all text-left active:scale-[0.98] ${conflicts.some(c => c.item1.id === item.id || c.item2.id === item.id) ? 'border-orange-200' : ''}`}
                >
                    {conflicts.some(c => c.item1.id === item.id || c.item2.id === item.id) && (
                      <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl border border-orange-100">
                        <Icon name="alert" size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Schedule Conflict</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 w-full">
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

                        <div className="flex items-center gap-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                            className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-brand-500 transition-colors rounded-xl hover:bg-brand-50"
                            aria-label="Edit activity"
                          >
                              <Icon name="edit" size={18} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteClick(e, item.id)}
                            className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50"
                            aria-label="Delete activity"
                          >
                              <Icon name="trash" size={20} />
                          </button>
                          <div className="w-10 h-10 flex items-center justify-center text-slate-200 group-hover:text-brand-300 transition-colors">
                              <Icon name="chevron-right" size={20} />
                          </div>
                        </div>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-6 animate-fade-in" onClick={() => setDeleteConfirmId(null)}>
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs text-center space-y-6 shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="trash" size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900">Delete Activity?</h3>
                    <p className="text-slate-400 font-bold text-sm leading-tight">Are you sure you want to remove "{activityToDelete?.title}" from your list?</p>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-4 bg-slate-100 rounded-xl font-black text-slate-500 uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Keep</button>
                      <button 
                        onClick={confirmDelete} 
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
