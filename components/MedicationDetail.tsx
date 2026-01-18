
import React, { useState } from 'react';
import { Icon } from './Icon';
import { MedicationItem } from '../types';

interface MedicationDetailProps {
  medication: MedicationItem;
  onSave: (updatedMed: MedicationItem) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onToggleTaken: (id: string) => void;
}

type MenuType = 'DOSE' | 'FREQUENCY' | null;

export const MedicationDetail: React.FC<MedicationDetailProps> = ({ 
  medication, 
  onSave, 
  onDelete, 
  onBack,
  onToggleTaken
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  
  const stockPercent = (medication.stockQuantity / medication.maxQuantity) * 100;
  const isLowStock = medication.stockQuantity <= medication.refillThreshold;
  const unit = medication.type === 'Liquid' ? 'ml' : 'pills';

  const handleRefill = () => {
    onSave({
        ...medication,
        stockQuantity: medication.maxQuantity
    });
  };

  const getMedIcon = (type?: string) => {
    switch(type) {
      case 'Liquid': return 'droplet';
      case 'Tablet': return 'circle';
      case 'Capsule': return 'pill';
      case 'Cream': return 'beaker';
      default: return 'pill';
    }
  };

  const doseOptions = medication.type === 'Liquid' 
    ? [5, 10, 15, 20, 30] 
    : [1, 2, 3, 4];

  const frequencyOptions = [
    'Daily',
    'Twice Daily',
    'Three Times Daily',
    'Every 4 Hours',
    'As Needed',
    'Weekly'
  ];

  const handleUpdateDose = (amount: number) => {
    onSave({ ...medication, doseAmount: amount });
    setActiveMenu(null);
  };

  const handleUpdateFrequency = (freq: string) => {
    onSave({ ...medication, frequency: freq });
    setActiveMenu(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col animate-fade-in relative">
      {/* Top Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-20 bg-stone-50/80 backdrop-blur-md">
        <button onClick={onBack} className="p-3 -ml-3 text-stone-400 hover:text-stone-900 transition-colors">
          <Icon name="back" size={28} />
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="p-3 -mr-3 text-stone-300 hover:text-rose-500 transition-colors">
          <Icon name="trash" size={24} />
        </button>
      </div>

      <div className="flex-1 px-6 pb-12 space-y-6">
        {/* Medication Identity Header */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200/50 rounded-full text-stone-500 text-[10px] font-black uppercase tracking-widest">
            <Icon name={getMedIcon(medication.type)} size={12} />
            {medication.type}
          </div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight leading-none">{medication.name}</h1>
          <p className="text-stone-400 font-bold text-lg">{medication.dosage} • {medication.purpose}</p>
        </div>

        {/* Primary Action Card - Log Dose */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-stone-100 flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className={`w-12 h-12 ${medication.color || 'bg-brand-500'} rounded-2xl flex items-center justify-center text-white shadow-sm`}>
                    <Icon name="clock" size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Schedule</p>
                    <p className="text-xl font-black text-stone-900 leading-none">{medication.time}</p>
                 </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${medication.taken ? 'bg-green-100 text-green-700' : 'bg-brand-50 text-brand-700'}`}>
                {medication.taken ? 'Completed' : 'Upcoming'}
              </div>
           </div>

           <button 
                onClick={() => onToggleTaken(medication.id)}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                    medication.taken 
                    ? 'bg-stone-100 text-stone-400 border-stone-200' 
                    : `${medication.color || 'bg-brand-600'} text-white shadow-lg shadow-brand-100`
                }`}
            >
                {medication.taken ? (
                  <>
                    <Icon name="check" size={22} />
                    Logged for Today
                  </>
                ) : (
                  <>
                    <Icon name="plus" size={22} />
                    Log Dose Now
                  </>
                )}
            </button>
        </div>

        {/* Information Grid - Now Interactive */}
        <div className="grid grid-cols-2 gap-4">
            <button 
               onClick={() => setActiveMenu('DOSE')}
               className="bg-stone-200/30 p-5 rounded-3xl flex flex-col gap-1 text-left group active:scale-95 transition-all border border-transparent hover:border-stone-200"
            >
               <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Dose Amount</span>
                  <Icon name="edit" size={12} className="text-stone-300 group-hover:text-stone-500" />
               </div>
               <span className="text-lg font-black text-stone-700">{medication.doseAmount} {unit}</span>
            </button>
            <button 
               onClick={() => setActiveMenu('FREQUENCY')}
               className="bg-stone-200/30 p-5 rounded-3xl flex flex-col gap-1 text-left group active:scale-95 transition-all border border-transparent hover:border-stone-200"
            >
               <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Frequency</span>
                  <Icon name="edit" size={12} className="text-stone-300 group-hover:text-stone-500" />
               </div>
               <span className="text-lg font-black text-stone-700">{medication.frequency || 'Daily'}</span>
            </button>
        </div>

        {/* Inventory Visual Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100 relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-stone-900">Bottle Supply</h3>
              <p className="text-stone-400 font-bold text-sm">{medication.stockQuantity} {unit} remaining</p>
            </div>
            
            <div className="w-14 h-24 bg-stone-50 rounded-full border-2 border-stone-100 overflow-hidden relative shadow-inner">
               <div 
                 className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${medication.color || 'bg-brand-500'} opacity-80`}
                 style={{ height: `${stockPercent}%` }}
               >
                 <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 blur-[2px]"></div>
               </div>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <Icon name={getMedIcon(medication.type)} size={32} />
               </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
             <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 rounded-full ${isLowStock ? 'bg-orange-500' : (medication.color || 'bg-brand-600')}`}
                    style={{ width: `${stockPercent}%` }}
                />
             </div>
             
             {isLowStock ? (
               <div className="flex items-center gap-2 text-orange-600 font-bold text-xs animate-pulse">
                  <Icon name="alert" size={14} />
                  Running low - Refill soon
               </div>
             ) : (
               <div className="text-stone-300 font-bold text-[10px] uppercase tracking-widest">
                  Good supply until next week
               </div>
             )}
          </div>

          <button 
              onClick={handleRefill}
              className="mt-6 w-full py-4 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 font-black text-xs uppercase tracking-widest hover:bg-stone-50 transition-colors active:scale-[0.98]"
          >
              Refill Bottle
          </button>
        </div>
      </div>

      {/* Interactive Selection Menus (Bottom Sheet Style) */}
      {activeMenu && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-stone-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setActiveMenu(null)}>
          <div className="bg-white w-full max-w-md rounded-t-[3rem] p-8 space-y-6 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-stone-900 uppercase tracking-widest">
                   {activeMenu === 'DOSE' ? 'Dose Amount' : 'Frequency'}
                </h3>
                <button onClick={() => setActiveMenu(null)} className="p-2 bg-stone-100 rounded-full">
                   <Icon name="close" size={20} />
                </button>
             </div>
             
             <div className="space-y-3">
                {activeMenu === 'DOSE' ? (
                  doseOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleUpdateDose(option)}
                      className={`w-full py-5 px-6 rounded-2xl font-black text-xl flex items-center justify-between transition-all ${
                        medication.doseAmount === option 
                        ? 'bg-brand-50 text-brand-600 ring-2 ring-brand-100' 
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>{option} {unit}</span>
                      {medication.doseAmount === option && <Icon name="check" size={20} />}
                    </button>
                  ))
                ) : (
                  frequencyOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleUpdateFrequency(option)}
                      className={`w-full py-5 px-6 rounded-2xl font-black text-xl flex items-center justify-between transition-all ${
                        medication.frequency === option 
                        ? 'bg-brand-50 text-brand-600 ring-2 ring-brand-100' 
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>{option}</span>
                      {medication.frequency === option && <Icon name="check" size={20} />}
                    </button>
                  ))
                )}
             </div>
             
             <div className="pt-4 text-center">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">Changes update automatically</p>
             </div>
          </div>
        </div>
      )}

      {/* Simplified Delete Confirm */}
      {showDeleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/40 backdrop-blur-md px-6 animate-fade-in" onClick={() => setShowDeleteConfirm(false)}>
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs text-center space-y-6 shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="trash" size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-stone-900">Remove Medication?</h3>
                    <p className="text-stone-400 font-bold text-sm leading-tight">This will stop all reminders for {medication.name}.</p>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 bg-stone-100 rounded-xl font-black text-stone-500 uppercase text-[10px] tracking-widest">Keep</button>
                      <button onClick={() => onDelete(medication.id)} className="flex-1 py-4 bg-rose-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-100">Delete</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
