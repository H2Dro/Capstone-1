
import React, { useState } from 'react';
import { Icon } from './Icon';
import { AppointmentItem } from '../types';

interface RescheduleAppointmentProps {
  appointment: AppointmentItem;
  onSave: (updatedAppointment: AppointmentItem) => void;
  onCancel: () => void;
}

export const RescheduleAppointment: React.FC<RescheduleAppointmentProps> = ({ appointment, onSave, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState<number>(parseInt(appointment.date.split(' ')[1]) || new Date().getDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const MORNING_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '11:15 AM', '11:45 AM'];
  const AFTERNOON_SLOTS = ['01:00 PM', '02:30 PM', '03:15 PM', '04:00 PM', '04:30 PM'];

  const handleSave = () => {
    if (!selectedSlot) return;
    
    const updatedAppointment: AppointmentItem = {
      ...appointment,
      date: `Oct ${selectedDate}`,
      time: selectedSlot
    };
    
    onSave(updatedAppointment);
  };

  const renderCalendar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    return (
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-slate-800 text-lg">October</h3>
            <div className="flex gap-2">
                <button className="p-1 text-slate-400 hover:text-brand-600"><Icon name="chevron-left" size={20} /></button>
                <button className="p-1 text-slate-400 hover:text-brand-600"><Icon name="chevron-right" size={20} /></button>
            </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S','M','T','W','T','F','S'].map((d,i) => (
                <span key={i} className="text-xs font-bold text-slate-400">{d}</span>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
             <div className="h-8"></div>
             <div className="h-8"></div>
            {days.map(d => (
                <button
                    key={d}
                    onClick={() => {
                        setSelectedDate(d);
                        setSelectedSlot(null); // Reset slot when date changes
                    }}
                    className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        selectedDate === d 
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-200' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {d}
                </button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <button onClick={onCancel} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Reschedule</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        
        {/* Doctor Info Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 flex items-center gap-4 shadow-sm">
             <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center overflow-hidden shrink-0 text-brand-500">
                  <Icon name="user" size={32} />
             </div>
             <div>
                <h2 className="font-bold text-lg text-slate-900 leading-tight">{appointment.doctorName}</h2>
                <p className="text-sm font-medium text-brand-600">{appointment.specialty}</p>
                <p className="text-xs text-slate-400 mt-1">{appointment.hospital}</p>
             </div>
        </div>

        {/* Current Time */}
        <div className="flex items-center gap-3 p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-100">
            <Icon name="clock" size={20} />
            <div>
                <p className="text-xs font-bold uppercase opacity-70">Currently Scheduled</p>
                <p className="font-bold">{appointment.date} @ {appointment.time}</p>
            </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
           <label className="text-sm font-bold text-slate-500 uppercase tracking-wide ml-1">Select New Date</label>
           {renderCalendar()}
        </div>

        {/* Time Slots */}
        <div className="space-y-4">
             <label className="text-sm font-bold text-slate-500 uppercase tracking-wide ml-1">Available Times</label>
             
             {/* Morning Block */}
             <div>
                 <div className="flex items-center gap-2 mb-2 text-slate-400">
                     <Icon name="sun" size={16} />
                     <span className="text-xs font-bold uppercase">Morning</span>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                     {MORNING_SLOTS.map(slot => (
                         <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${
                                selectedSlot === slot
                                ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                            }`}
                         >
                             {slot}
                         </button>
                     ))}
                 </div>
             </div>

             {/* Afternoon Block */}
             <div>
                 <div className="flex items-center gap-2 mb-2 text-slate-400">
                     <Icon name="moon" size={16} />
                     <span className="text-xs font-bold uppercase">Afternoon</span>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                     {AFTERNOON_SLOTS.map(slot => (
                         <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${
                                selectedSlot === slot
                                ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                            }`}
                         >
                             {slot}
                         </button>
                     ))}
                 </div>
             </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-slate-100 safe-area-bottom">
        <button
            onClick={handleSave}
            disabled={!selectedSlot}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                selectedSlot
                ? 'bg-brand-600 text-white shadow-brand-200 hover:bg-brand-700 active:scale-[0.98]' 
                : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
            }`}
        >
            Confirm Reschedule
        </button>
      </div>
    </div>
  );
};
