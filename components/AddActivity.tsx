
import React, { useState } from 'react';
import { Icon } from './Icon';
import { ActivityItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface AddActivityProps {
  onSave: (activity: ActivityItem) => void;
  onCancel: () => void;
}

export const AddActivity: React.FC<AddActivityProps> = ({ onSave, onCancel }) => {
  const { fontSize } = useTheme();
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('church');
  
  // Time State
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  
  // UI State
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());

  const isLarge = fontSize === 'large';

  const ICONS = [
    { id: 'church', label: 'Church' },
    { id: 'cooking', label: 'Cooking' },
    { id: 'exercise', label: 'Exercise' },
    { id: 'gardening', label: 'Gardening' },
    { id: 'swimming', label: 'Swimming' },
    { id: 'art', label: 'Art' },
    { id: 'music', label: 'Music' },
  ];

  const handleSave = () => {
    if (!title) return;
    
    const activity: ActivityItem = {
      id: Date.now().toString(),
      title,
      icon: selectedIcon,
      time: `${hour}:${minute} ${period}`,
      date: `Oct ${selectedDate}`
    };
    
    onSave(activity);
  };

  const renderIconPicker = () => (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowIconPicker(false)}>
      <div className="bg-white w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900">Choose Icon</h3>
          <button onClick={() => setShowIconPicker(false)} className="p-2 bg-slate-100 rounded-full">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className={`grid gap-3 ${isLarge ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {ICONS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedIcon(item.id);
                setShowIconPicker(false);
              }}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                selectedIcon === item.id 
                  ? 'border-brand-500 bg-brand-50 text-brand-700' 
                  : 'border-slate-200 hover:border-brand-200'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-sm">
                <Icon name={item.id} size={24} />
              </div>
              <span className="font-bold text-lg">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimePicker = () => {
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];
    const periods = ['AM', 'PM'];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowTimePicker(false)}>
        <div className="bg-[#1E1E2E] text-white w-full max-w-xs rounded-[2rem] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
          <h3 className="text-xl font-bold mb-8 text-center text-slate-200">Set Time</h3>
          
          <div className="flex justify-center items-center gap-6 mb-10">
            <div className="flex flex-col gap-3 h-40 overflow-y-auto no-scrollbar snap-y py-16">
              {hours.map(h => (
                <button key={h} onClick={() => setHour(h)} className={`p-2 rounded-xl text-3xl font-bold transition-all snap-center ${hour === h ? 'text-brand-400 scale-125' : 'text-slate-600 opacity-40'}`}>{h}</button>
              ))}
            </div>
            <span className="text-3xl font-bold text-slate-700">:</span>
            <div className="flex flex-col gap-3 h-40 overflow-y-auto no-scrollbar snap-y py-16">
              {minutes.map(m => (
                <button key={m} onClick={() => setMinute(m)} className={`p-2 rounded-xl text-3xl font-bold transition-all snap-center ${minute === m ? 'text-brand-400 scale-125' : 'text-slate-600 opacity-40'}`}>{m}</button>
              ))}
            </div>
             <div className="flex flex-col gap-3">
              {periods.map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-xl text-lg font-bold transition-all ${period === p ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 bg-slate-800'}`}>{p}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
             <button onClick={() => setShowTimePicker(false)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold text-slate-300">Cancel</button>
             <button onClick={() => setShowTimePicker(false)} className="flex-1 py-4 bg-brand-600 rounded-2xl font-bold shadow-lg">Save</button>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    return (
      <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm mt-4">
        <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="font-bold text-slate-800 text-xl">October</h3>
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <Icon name="calendar" size={24} />
            </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {['S','M','T','W','T','F','S'].map((d,i) => (
                <span key={i} className="text-xs font-bold text-slate-400 uppercase">{d}</span>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
             <div className="h-10"></div>
             <div className="h-10"></div>
            {days.map(d => (
                <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`h-11 w-11 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                        selectedDate === d 
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-200 scale-110' 
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
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <button onClick={onCancel} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Add Activity</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Activity Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Walking the dog"
            className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-lg font-semibold text-slate-900 focus:outline-none focus:border-brand-500 transition-all placeholder:text-slate-200 shadow-sm"
          />
        </div>

        <div className={`grid gap-6 ${isLarge ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Choose Icon</label>
                 <button 
                    onClick={() => setShowIconPicker(true)}
                    className="w-full bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-brand-300 transition-all shadow-sm active:scale-[0.98]"
                 >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                            <Icon name={selectedIcon} size={24} />
                        </div>
                        <span className="font-bold text-slate-700 capitalize text-lg">{selectedIcon}</span>
                    </div>
                    <Icon name="chevron-down" size={20} className="text-slate-300" />
                 </button>
            </div>

            <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Set Time</label>
                 <button 
                    onClick={() => setShowTimePicker(true)}
                    className="w-full bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm active:scale-[0.98]"
                 >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                            <Icon name="clock" size={24} />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                             <span className="font-bold text-slate-900 text-lg">{hour}:{minute}</span>
                             <span className="text-xs font-bold text-slate-400 uppercase">{period}</span>
                        </div>
                    </div>
                    <Icon name="edit" size={16} className="text-slate-300" />
                 </button>
            </div>
        </div>

        <div className="space-y-2 pb-6">
           <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Select Date</label>
           {renderCalendar()}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 safe-area-bottom">
        <button
            onClick={handleSave}
            disabled={!title}
            className={`w-full py-5 rounded-2xl font-bold text-xl shadow-xl transition-all ${
                title 
                ? 'bg-brand-600 text-white shadow-brand-200 active:scale-[0.98]' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
        >
            Save Activity
        </button>
      </div>

      {showIconPicker && renderIconPicker()}
      {showTimePicker && renderTimePicker()}
    </div>
  );
};
