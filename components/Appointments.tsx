
import React, { useMemo } from 'react';
import { Icon } from './Icon';
import { AppointmentItem } from '../types';
import { ScheduleConflict } from '../services/schedulingService';

interface AppointmentsProps {
  appointments: AppointmentItem[];
  conflicts?: ScheduleConflict[];
  onAdd: () => void;
  onReschedule: (appt: AppointmentItem) => void;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({ 
  appointments, 
  conflicts = [],
  onAdd, 
  onReschedule,
  onToggleFavorite,
  onBack
}) => {
  // Sort appointments to put favorites first
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });
  }, [appointments]);

  return (
    <div className="flex flex-col animate-fade-in pb-24">
      <div className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl shadow-soft border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
              <Icon name="back" size={24} />
          </button>
          <h1 className="text-3xl font-bold text-[#111827]">Appointments</h1>
        </div>
        <button 
          onClick={onAdd} 
          className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
          aria-label="Add appointment"
        >
          <Icon name="plus" size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {sortedAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4 border-2 border-dashed border-slate-200">
                    <Icon name="calendar" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No visits scheduled</h2>
                <p className="text-slate-500 mb-8 max-w-[240px]">Keep track of your doctor visits and checkups here.</p>
                <button 
                  onClick={onAdd}
                  className="bg-[#4182F9] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 active:scale-95 transition-transform flex items-center gap-2"
                >
                    <Icon name="plus" size={20} />
                    <span>Book Appointment</span>
                </button>
            </div>
        ) : (
            sortedAppointments.map((appt) => (
                <div 
                    key={appt.id}
                    className={`bg-white rounded-[2.5rem] p-6 shadow-soft border-2 flex flex-col gap-5 relative transition-all ${appt.status === 'PENDING' ? 'border-orange-100' : 'border-transparent'}`}
                >
                    {conflicts.some(c => c.item1.id === appt.id || c.item2.id === appt.id) && (
                      <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl border border-orange-100">
                        <Icon name="alert" size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Schedule Conflict</span>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center text-slate-400 shrink-0">
                            <Icon name="user" size={28} />
                        </div>

                        <div className="flex-1 min-w-0 pt-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-2xl text-[#111827] leading-tight">
                                    {appt.doctorName.split(' ').map((word, i) => (
                                        <React.Fragment key={i}>
                                            {word}{i === 0 ? <br /> : ''}
                                        </React.Fragment>
                                    ))}
                                </h4>
                                
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#F8FAFC] px-3 py-2 rounded-2xl flex flex-col items-center gap-0.5 border border-slate-50">
                                        <Icon name="calendar" size={14} className="text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase leading-none">
                                            {appt.date}
                                        </span>
                                    </div>
                                    
                                    <button 
                                      onClick={() => onToggleFavorite(appt.id)}
                                      className="p-2 -m-2 active:scale-125 transition-transform hover:bg-slate-50 rounded-full"
                                      aria-label={appt.favorite ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        <Icon 
                                            name="heart" 
                                            size={24} 
                                            className={`${appt.favorite ? 'fill-[#FF5A72] text-[#FF5A72]' : 'text-slate-300'} transition-colors`} 
                                        />
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-slate-400 font-bold text-sm mt-1">
                                {appt.specialty} <span className="mx-1 text-slate-200">|</span> {appt.hospital}
                            </p>

                            <div className="flex items-center gap-6 mt-4">
                                <div className="flex items-center gap-1.5">
                                    <Icon name="star" size={18} className="fill-[#FBBF24] text-[#FBBF24]" />
                                    <span className="font-black text-slate-700">{appt.rating}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Icon name="clock" size={18} />
                                    <span className="font-bold text-sm">{appt.time}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {appt.status === 'PENDING' ? (
                      <div className="w-full py-4 bg-orange-50 border border-orange-100 rounded-[1.25rem] flex items-center justify-center gap-3">
                          <Icon name="timer" size={20} className="text-orange-500" />
                          <span className="text-sm font-black text-orange-600 uppercase tracking-widest">Awaiting Caregiver Approval</span>
                      </div>
                    ) : (
                      <button 
                          onClick={() => onReschedule(appt)}
                          className="w-full py-5 bg-[#4182F9] text-white rounded-[1.25rem] font-black text-lg shadow-lg shadow-blue-100 hover:bg-[#3572E8] active:scale-[0.98] transition-all"
                      >
                          Reschedule
                      </button>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
};
