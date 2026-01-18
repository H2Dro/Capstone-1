
import React, { useState } from 'react';
import { Icon } from './Icon';
import { useTheme, AccentColor, FontSize } from '../contexts/ThemeContext';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { 
    fontSize, setFontSize, 
    accentColor, setAccentColor, 
    boldText, setBoldText,
    highContrast, setHighContrast,
    reducedMotion, setReducedMotion
  } = useTheme();

  const [volume, setVolume] = useState(80);
  const [vibration, setVibration] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [activityReminders, setActivityReminders] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  const ACCENTS: { id: AccentColor; color: string }[] = [
    { id: 'indigo', color: 'bg-indigo-600' },
    { id: 'rose', color: 'bg-rose-600' },
    { id: 'teal', color: 'bg-teal-600' },
    { id: 'orange', color: 'bg-orange-600' },
    { id: 'blue', color: 'bg-blue-600' },
  ];

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val < 33) setFontSize('small');
    else if (val < 66) setFontSize('medium');
    else setFontSize('large');
  };

  const getFontSizeValue = () => {
    if (fontSize === 'small') return 0;
    if (fontSize === 'medium') return 50;
    return 100;
  };

  const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <button 
      onClick={() => onChange(!checked)}
      aria-label={label}
      aria-pressed={checked}
      className={`w-14 h-8 rounded-full transition-colors relative focus:outline-none focus:ring-4 focus:ring-brand-100 ${checked ? 'bg-brand-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-fade-in flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors" aria-label="Go Back">
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Accessibility Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <Icon name="accessibility" size={24} className="text-brand-600" />
             <h2 className="text-lg font-bold text-slate-800">Accessibility</h2>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-6">
            
            {/* Font Size Selector (Reverted to Range Slider) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="font-bold text-slate-700">Display Size</span>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{fontSize}</span>
              </div>
              
              <div className="px-2 pt-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="50"
                  value={getFontSizeValue()} 
                  onChange={handleFontSizeChange} 
                  className="w-full h-3 bg-slate-100 rounded-full appearance-none accent-brand-600 cursor-pointer" 
                />
                <div className="flex justify-between mt-2 px-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Small</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Normal</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Large</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-50"></div>

            {/* Bold Text */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                       <Icon name="type" size={16} />
                   </div>
                   <span className="font-bold text-slate-700">Extra Bold Text</span>
               </div>
               <Toggle checked={boldText} onChange={setBoldText} label="Toggle Bold Text" />
            </div>

            <div className="w-full h-px bg-slate-50"></div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                       <Icon name="eye" size={16} />
                   </div>
                   <div>
                       <span className="font-bold text-slate-700 block">High Contrast</span>
                       <span className="text-xs text-slate-400">Pure colors for legibility</span>
                   </div>
               </div>
               <Toggle checked={highContrast} onChange={setHighContrast} label="Toggle High Contrast" />
            </div>

            <div className="w-full h-px bg-slate-50"></div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                       <Icon name="zap-off" size={16} />
                   </div>
                   <div>
                       <span className="font-bold text-slate-700 block">Reduced Motion</span>
                       <span className="text-xs text-slate-400">Faster, static interface</span>
                   </div>
               </div>
               <Toggle checked={reducedMotion} onChange={setReducedMotion} label="Toggle Reduced Motion" />
            </div>
          </div>
        </section>

        {/* Theme Color */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <Icon name="palette" size={20} className="text-slate-400" />
             <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Theme Accent</h2>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
             <div className="flex gap-4 justify-between">
                {ACCENTS.map(acc => (
                   <button
                     key={acc.id}
                     onClick={() => setAccentColor(acc.id)}
                     aria-label={`Select ${acc.id} color theme`}
                     className={`w-12 h-12 rounded-full ${acc.color} flex items-center justify-center transition-transform active:scale-90 ring-offset-4 ${
                         accentColor === acc.id ? 'ring-4 ring-brand-600 scale-110 shadow-lg shadow-brand-200' : ''
                     }`}
                   >
                      {accentColor === acc.id && <Icon name="check-plain" size={20} className="text-white" />}
                   </button>
                ))}
             </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <Icon name="bell" size={20} className="text-slate-400" />
             <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Reminders</h2>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
             <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Medications</span>
                <Toggle checked={medicationReminders} onChange={setMedicationReminders} label="Toggle Medication Reminders" />
             </div>
             <div className="w-full h-px bg-slate-50"></div>
             <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Activities</span>
                <Toggle checked={activityReminders} onChange={setActivityReminders} label="Toggle Activity Reminders" />
             </div>
             <div className="w-full h-px bg-slate-50"></div>
             <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Appointments</span>
                <Toggle checked={appointmentReminders} onChange={setAppointmentReminders} label="Toggle Appointment Alerts" />
             </div>
          </div>
        </section>

        <div className="p-8 text-center">
             <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.2em]">Settings saved to device</p>
        </div>

      </div>
    </div>
  );
};
