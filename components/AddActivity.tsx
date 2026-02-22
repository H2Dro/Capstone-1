
import React, { useState } from 'react';
import { Icon } from './Icon';
import { ActivityItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { generateActivityDescription } from '../services/geminiService';

interface AddActivityProps {
  onSave: (activity: ActivityItem) => void;
  onCancel: () => void;
  activity?: ActivityItem;
}

export const AddActivity: React.FC<AddActivityProps> = ({ onSave, onCancel, activity }) => {
  const { fontSize } = useTheme();
  const [title, setTitle] = useState(activity?.title || '');
  const [selectedIcon, setSelectedIcon] = useState(activity?.icon || 'church');
  const [isSaving, setIsSaving] = useState(false);
  
  // Time State
  const [hour, setHour] = useState(() => {
    if (activity?.time) {
      const [h] = activity.time.split(':');
      return h.padStart(2, '0');
    }
    return '09';
  });
  const [minute, setMinute] = useState(() => {
    if (activity?.time) {
      const [, mPart] = activity.time.split(':');
      const [m] = mPart.split(' ');
      return m.padStart(2, '0');
    }
    return '00';
  });
  const [period, setPeriod] = useState(() => {
    if (activity?.time) {
      const [, mPart] = activity.time.split(':');
      const [, p] = mPart.split(' ');
      return p || 'AM';
    }
    return 'AM';
  });
  
  // UI State
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(() => {
    if (activity?.date) {
      const parts = activity.date.split(' ');
      const d = parseInt(parts[1], 10);
      return isNaN(d) ? new Date().getDate() : d;
    }
    return new Date().getDate();
  });

  const isLarge = fontSize === 'large';
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentMonthShort = now.toLocaleString('default', { month: 'short' });

  const ICONS = [
    { id: 'church', label: 'Church' },
    { id: 'cooking', label: 'Cook' },
    { id: 'exercise', label: 'Gym' },
    { id: 'gardening', label: 'Yard' },
    { id: 'swimming', label: 'Pool' },
    { id: 'art', label: 'Art' },
    { id: 'music', label: 'Music' },
    { id: 'dog', label: 'Pets' },
    { id: 'reading', label: 'Read' },
    { id: 'walking', label: 'Walk' },
    { id: 'shopping', label: 'Shop' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'movie', label: 'Movie' },
    { id: 'tv', label: 'TV' },
    { id: 'puzzle', label: 'Game' },
    { id: 'moon', label: 'Nap' },
    { id: 'phone', label: 'Call' },
    { id: 'mail', label: 'Mail' },
  ];

  const handleSave = async () => {
    if (!title || isSaving) return;
    setIsSaving(true);
    
    // Generate a natural sounding description automatically
    const description = (activity?.title === title && activity?.description) 
      ? activity.description 
      : await generateActivityDescription(title);
    
    const newActivity: ActivityItem = {
      ...activity,
      id: activity?.id || Date.now().toString(),
      title,
      icon: selectedIcon,
      time: `${hour}:${minute} ${period}`,
      date: `${currentMonthShort} ${selectedDate}`,
      description: description
    };
    
    onSave(newActivity);
    setIsSaving(false);
  };

  const renderIconPicker = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-fade-in px-6" onClick={() => setShowIconPicker(false)}>
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-pop relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Select Icon</h3>
          <button onClick={() => setShowIconPicker(false)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
            <Icon name="close" size={16} />
          </button>
        </div>
        
        {/* Scrollable Container */}
        <div className="max-h-[320px] overflow-y-auto no-scrollbar pr-1 relative">
          <div className={`grid gap-3 ${isLarge ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {ICONS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIcon(item.id);
                  setShowIconPicker(false);
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  selectedIcon === item.id 
                    ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm' 
                    : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedIcon === item.id ? 'bg-white text-brand-600 shadow-sm' : 'bg-white text-slate-300'}`}>
                  <Icon name={item.id} size={20} />
                </div>
                <span className="font-black text-[10px] uppercase tracking-tighter text-center line-clamp-1">{item.label}</span>
              </button>
            ))}
          </div>
          {/* Bottom shadow fade to indicate scroll */}
          <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>

        <button 
          onClick={() => setShowIconPicker(false)}
          className="w-full mt-6 py-4 bg-slate-100 rounded-2xl font-black text-slate-400 text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
        >
          Close Picker
        </button>
      </div>
    </div>
  );

  const renderTimePicker = () => {
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];
    const periods = ['AM', 'PM'];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowTimePicker(false)}>
        <div className="bg-white text-slate-900 w-full max-w-[320px] rounded-[3rem] p-6 shadow-2xl animate-pop overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="text-center mb-6">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Set Activity Time</h3>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-brand-50 px-4 py-2 rounded-2xl flex items-baseline gap-1 border border-brand-100 shadow-sm">
                <span className="text-4xl font-black text-brand-600 tracking-tighter">{hour}:{minute}</span>
                <span className="text-sm font-black text-brand-400 uppercase">{period}</span>
              </div>
            </div>
          </div>
          
          <div className="relative flex justify-center items-center gap-2 mb-8 bg-slate-50/50 p-4 rounded-[2.5rem] border border-slate-100 h-[160px]">
            {/* Center Highlighting Selection Area */}
            <div className="absolute left-4 right-4 h-10 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-sm border border-slate-100 pointer-events-none z-0"></div>
            
            {/* Hours Drum */}
            <div className="relative z-10 flex flex-col gap-0 h-full overflow-y-auto no-scrollbar snap-y py-[60px] w-16 items-center">
              {hours.map(h => (
                <button 
                  key={h} 
                  onClick={() => setHour(h)} 
                  className={`h-10 w-full flex-shrink-0 flex items-center justify-center rounded-xl text-2xl font-bold transition-all snap-center ${hour === h ? 'text-brand-600 scale-110' : 'text-slate-300 opacity-40'}`}
                >
                  {h}
                </button>
              ))}
            </div>
            
            <span className="relative z-10 text-2xl font-black text-slate-200 self-center flex items-center pb-1">:</span>
            
            {/* Minutes Drum */}
            <div className="relative z-10 flex flex-col gap-0 h-full overflow-y-auto no-scrollbar snap-y py-[60px] w-16 items-center">
              {minutes.map(m => (
                <button 
                  key={m} 
                  onClick={() => setMinute(m)} 
                  className={`h-10 w-full flex-shrink-0 flex items-center justify-center rounded-xl text-2xl font-bold transition-all snap-center ${minute === m ? 'text-brand-600 scale-110' : 'text-slate-300 opacity-40'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* AM/PM Toggle */}
            <div className="relative z-10 flex flex-col gap-2 ml-2">
              {periods.map(p => (
                <button 
                  key={p} 
                  onClick={() => setPeriod(p)} 
                  className={`px-4 py-2.5 rounded-xl text-[11px] font-black transition-all border ${period === p ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-100 scale-105' : 'text-slate-400 bg-white border-slate-100 active:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 px-2">
             <button 
               onClick={() => setShowTimePicker(false)} 
               className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-slate-400 text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
             >
               Cancel
             </button>
             <button 
               onClick={() => setShowTimePicker(false)} 
               className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-100 active:scale-95 transition-transform"
             >
               Confirm
             </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    return (
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mt-2">
        <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-slate-800 text-lg">{currentMonthName}</h3>
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <Icon name="calendar" size={18} />
            </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S','M','T','W','T','F','S'].map((d,i) => (
                <span key={i} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
             <div className="h-8"></div>
             <div className="h-8"></div>
            {days.map(d => (
                <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        selectedDate === d 
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-200 scale-105' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {d}
                </button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in overflow-hidden">
      <div className="bg-white px-6 pt-8 pb-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <button onClick={onCancel} className="p-1 -ml-1 text-slate-400 hover:text-slate-600">
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-lg font-black text-slate-900 uppercase tracking-widest">
          {activity ? 'Edit Activity' : 'New Activity'}
        </h1>
        <div className="w-8" />
      </div>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto no-scrollbar">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Activity Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Walking the dog"
            className="w-full bg-white p-3.5 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:outline-none focus:border-brand-500 transition-all placeholder:text-slate-200 shadow-sm"
          />
        </div>

        <div className={`grid gap-4 ${isLarge ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Icon</label>
                 <button 
                    onClick={() => setShowIconPicker(true)}
                    className="w-full bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:border-brand-300 transition-all shadow-sm active:scale-[0.98]"
                 >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 shadow-sm">
                            <Icon name={selectedIcon} size={20} />
                        </div>
                        <span className="font-bold text-slate-700 capitalize text-sm">{selectedIcon}</span>
                    </div>
                    <Icon name="chevron-down" size={16} className="text-slate-300" />
                 </button>
            </div>

            <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Time</label>
                 <button 
                    onClick={() => setShowTimePicker(true)}
                    className="w-full bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm active:scale-[0.98]"
                 >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 shadow-sm">
                            <Icon name="clock" size={20} />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                             <span className="font-bold text-slate-900 text-sm">{hour}:{minute}</span>
                             <span className="text-[9px] font-black text-slate-400 uppercase mt-0.5">{period}</span>
                        </div>
                    </div>
                    <Icon name="edit" size={14} className="text-slate-300" />
                 </button>
            </div>
        </div>

        <div className="space-y-1.5 pb-20">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Select Date</label>
           {renderCalendar()}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button
            onClick={handleSave}
            disabled={!title || isSaving}
            className={`w-full py-4 rounded-xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${
                title && !isSaving
                ? 'bg-brand-600 text-white shadow-brand-100 active:scale-[0.98]' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
        >
            {isSaving ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Save Activity'
            )}
        </button>
      </div>

      {showIconPicker && renderIconPicker()}
      {showTimePicker && renderTimePicker()}
    </div>
  );
};
