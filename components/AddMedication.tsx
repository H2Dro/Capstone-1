
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { MedicationItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface AddMedicationProps {
  onSave: (medication: MedicationItem) => void;
  onCancel: () => void;
}

type Step = 'MENU' | 'TYPE' | 'SCHEDULE' | 'INVENTORY';

const OTC_OPTIONS = [
    { name: 'Tylenol', purpose: 'Pain / Fever', dosage: '500mg' },
    { name: 'Advil', purpose: 'Inflammation', dosage: '200mg' },
    { name: 'Aspirin', purpose: 'Heart Health', dosage: '81mg' },
    { name: 'Aleve', purpose: 'Joint Pain', dosage: '220mg' },
    { name: 'Benadryl', purpose: 'Allergies', dosage: '25mg' },
    { name: 'Claritin', purpose: 'Allergies', dosage: '10mg' },
    { name: 'Zyrtec', purpose: 'Allergies', dosage: '10mg' },
    { name: 'Prilosec', purpose: 'Heartburn', dosage: '20mg' },
    { name: 'Vitamin D3', purpose: 'Supplement', dosage: '2000 IU' },
    { name: 'Multivitamin', purpose: 'General Health', dosage: '1 Daily' },
];

const POPULAR_MEDS_LIST = [
    { name: 'Advil', purpose: 'Inflammation', dosage: '200mg' },
    { name: 'Aleve', purpose: 'Joint Pain', dosage: '220mg' },
    { name: 'Amlodipine', purpose: 'Blood Pressure', dosage: '5mg' },
    { name: 'Aspirin', purpose: 'Heart Health', dosage: '81mg' },
    { name: 'Atorvastatin', purpose: 'Cholesterol', dosage: '20mg' },
    { name: 'Benadryl', purpose: 'Allergies', dosage: '25mg' },
    { name: 'Claritin', purpose: 'Allergies', dosage: '10mg' },
    { name: 'Cozaar', purpose: 'Blood Pressure', dosage: '50mg' },
    { name: 'Crestor', purpose: 'Cholesterol', dosage: '10mg' },
    { name: 'Gabapentin', jokeName: 'Gaba Gaba', purpose: 'Nerve Pain', dosage: '300mg' },
    { name: 'Glucophage', purpose: 'Diabetes', dosage: '500mg' },
    { name: 'Hydrochlorothiazide', purpose: 'Water Pill', dosage: '25mg' },
    { name: 'Ibuprofen', purpose: 'Pain Relief', dosage: '400mg' },
    { name: 'Levothyroxine', purpose: 'Thyroid', dosage: '50mcg' },
    { name: 'Lipitor', purpose: 'Cholesterol', dosage: '20mg' },
    { name: 'Lisinopril', purpose: 'Blood Pressure', dosage: '10mg' },
    { name: 'Metformin', purpose: 'Diabetes', dosage: '500mg' },
    { name: 'Metoprolol', purpose: 'Blood Pressure', dosage: '25mg' },
    { name: 'Nexium', purpose: 'Acid Reflux', dosage: '20mg' },
    { name: 'Norvasc', purpose: 'Blood Pressure', dosage: '5mg' },
    { name: 'Omeprazole', purpose: 'Heartburn', dosage: '20mg' },
    { name: 'Prilosec', purpose: 'Heartburn', dosage: '20mg' },
    { name: 'Synthroid', purpose: 'Thyroid', dosage: '75mcg' },
    { name: 'Tylenol', purpose: 'Pain / Fever', dosage: '500mg' },
    { name: 'Ventolin', purpose: 'Asthma', dosage: '100mcg' },
    { name: 'Vitamin D3', purpose: 'Supplement', dosage: '2000 IU' },
    { name: 'Xanax', purpose: 'Anxiety', dosage: '0.25mg' },
    { name: 'Zoloft', purpose: 'Depression', dosage: '50mg' },
    { name: 'Zyrtec', purpose: 'Allergies', dosage: '10mg' },
].sort((a, b) => a.name.localeCompare(b.name));

export const AddMedication: React.FC<AddMedicationProps> = ({ onSave, onCancel }) => {
  const { fontSize } = useTheme();
  const [currentStep, setCurrentStep] = useState<Step>('MENU');
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Medication State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [purpose, setPurpose] = useState('');
  const [type, setType] = useState<'Tablet' | 'Capsule' | 'Liquid' | 'Cream'>('Tablet');
  const [selectedColor, setSelectedColor] = useState('bg-[#FF5C73]');
  
  // Schedule State
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  const [frequency, setFrequency] = useState('Daily');
  
  // Inventory State
  const [stockQuantity, setStockQuantity] = useState(30);
  const [refillThreshold, setRefillThreshold] = useState(5);
  const [doseAmount, setDoseAmount] = useState(1);

  const steps: Step[] = ['MENU', 'TYPE', 'SCHEDULE', 'INVENTORY'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const filteredMeds = useMemo(() => {
    return POPULAR_MEDS_LIST.filter(med => 
      med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    } else {
      handleFinalSave();
    }
  };

  const handleBack = () => {
    if (isManualEntry && currentStep === 'MENU') {
        setIsManualEntry(false);
        setIsDropdownOpen(false);
        setName('');
        setPurpose('');
        setDosage('');
        setSearchTerm('');
    } else if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    } else {
      onCancel();
    }
  };

  const handleSelectOTC = (med: typeof OTC_OPTIONS[0]) => {
    setName(med.name);
    setPurpose(med.purpose);
    setDosage(med.dosage);
    setIsManualEntry(false);
    setTimeout(() => setCurrentStep('TYPE'), 100);
  };

  const handleSelectFromDropdown = (med: typeof POPULAR_MEDS_LIST[0]) => {
    setName(med.name);
    setPurpose(med.purpose);
    setDosage(med.dosage);
    setIsDropdownOpen(false);
    setSearchTerm(med.name);
  };

  const handleSelectCustom = () => {
    setName(searchTerm);
    setIsDropdownOpen(false);
  };

  const handleFinalSave = () => {
    onSave({
      id: Date.now().toString(),
      name,
      dosage,
      purpose,
      type,
      time: `${hour}:${minute} ${period}`,
      frequency,
      taken: false,
      color: selectedColor,
      stockQuantity,
      maxQuantity: stockQuantity,
      refillThreshold,
      doseAmount
    });
  };

  const renderMenuStep = () => (
    <div className="space-y-6 animate-fade-in">
      {!isManualEntry ? (
        <>
          <div className="text-center space-y-1 mb-4">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest">Common Medications</h3>
            <p className="text-stone-500 font-bold">Pick one to start</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {OTC_OPTIONS.map((med) => (
              <button
                key={med.name}
                onClick={() => handleSelectOTC(med)}
                className={`p-4 rounded-[1.5rem] border-2 shadow-sm text-left transition-all active:scale-95 bg-white border-stone-100 hover:border-brand-200 hover:bg-brand-50/50`}
              >
                <span className="block font-black text-base leading-tight mb-0.5 text-stone-800">
                  {med.name}
                </span>
                <span className="block text-stone-400 font-bold text-[9px] uppercase tracking-wider">
                  {med.purpose}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setIsManualEntry(true);
              setName('');
              setPurpose('');
              setDosage('');
              setSearchTerm('');
            }}
            className="w-full mt-4 bg-stone-100 p-5 rounded-[1.5rem] border-2 border-dashed border-stone-200 text-center flex items-center justify-center gap-3 group active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-400 group-hover:text-brand-600 shadow-sm transition-colors">
              <Icon name="plus" size={24} />
            </div>
            <span className="font-black text-stone-600 text-sm uppercase tracking-widest">Add Something Else</span>
          </button>
        </>
      ) : (
        <div className="space-y-6 animate-scale-up pt-4 relative">
           <div className="space-y-2 relative">
             <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Medication Name</label>
             <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  value={searchTerm} 
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setName(e.target.value);
                    setIsDropdownOpen(true);
                  }} 
                  placeholder="Type to search..." 
                  className="w-full bg-white p-5 rounded-[1.5rem] border-2 border-brand-100 text-xl font-black text-stone-900 focus:outline-none focus:border-brand-500 transition-all shadow-soft pr-12" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300">
                    <Icon name={isDropdownOpen ? 'chevron-up' : 'chevron-down'} size={24} />
                </div>
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[1.5rem] border border-stone-100 shadow-2xl z-50 max-h-60 overflow-y-auto no-scrollbar animate-slide-up">
                        {searchTerm.trim().length > 0 && (
                            <button
                                onClick={handleSelectCustom}
                                className="w-full text-left p-5 bg-brand-50/30 hover:bg-brand-50 border-b-2 border-brand-100 transition-colors flex items-center justify-between group"
                            >
                                <div>
                                    <span className="block font-black text-brand-700">Add "{searchTerm}"</span>
                                    <span className="block text-[10px] font-bold text-brand-400 uppercase tracking-widest">Not in list? Use this name</span>
                                </div>
                                <Icon name="plus" size={20} className="text-brand-600" />
                            </button>
                        )}
                        {filteredMeds.length > 0 ? (
                            filteredMeds.map((med) => (
                                <button
                                    key={med.name}
                                    onClick={() => handleSelectFromDropdown(med)}
                                    className="w-full text-left p-5 hover:bg-stone-50 border-b border-stone-50 last:border-0 transition-colors flex items-center justify-between group"
                                >
                                    <div>
                                        <span className="block font-black text-stone-800">{med.name}</span>
                                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">{med.purpose}</span>
                                    </div>
                                    <Icon name="chevron-right" size={16} className="text-stone-200 group-hover:text-brand-400" />
                                </button>
                            ))
                        ) : (
                            searchTerm.trim().length === 0 && (
                                <div className="p-10 text-center">
                                    <p className="text-stone-400 font-bold text-sm">Start typing to see popular medications</p>
                                </div>
                            )
                        )}
                    </div>
                )}
             </div>
           </div>

           <div className="space-y-2 animate-fade-in" style={{ opacity: name ? 1 : 0.5 }}>
             <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">What is it for?</label>
             <input 
               type="text" 
               value={purpose} 
               onChange={(e) => setPurpose(e.target.value)} 
               placeholder="e.g. Heart Health" 
               className="w-full bg-white p-5 rounded-2xl border-2 border-stone-100 text-lg font-bold text-stone-700 focus:outline-none focus:border-brand-500 transition-all shadow-sm" 
             />
           </div>

           <div className="space-y-2 animate-fade-in" style={{ opacity: name ? 1 : 0.5 }}>
             <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Dosage</label>
             <input 
               type="text" 
               value={dosage} 
               onChange={(e) => setDosage(e.target.value)} 
               placeholder="e.g. 10mg" 
               className="w-full bg-white p-5 rounded-2xl border-2 border-stone-100 text-lg font-bold text-stone-700 focus:outline-none focus:border-brand-500 transition-all shadow-sm" 
             />
           </div>

           {name && (
             <button
               onClick={handleNext}
               className="w-full py-5 mt-4 bg-brand-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-brand-100 animate-pop flex items-center justify-center gap-3 active:scale-95 transition-all"
             >
                Continue to Style
                <Icon name="chevron-right" size={20} />
             </button>
           )}

           <button 
             onClick={() => {
                setIsManualEntry(false);
                setName('');
                setSearchTerm('');
             }}
             className="w-full py-2 text-stone-400 font-bold text-xs uppercase tracking-widest hover:text-stone-600"
           >
             ← Back to common list
           </button>
        </div>
      )}
    </div>
  );

  const renderTypeStep = () => (
    <div className="space-y-8 animate-fade-in pt-4">
      <div className="space-y-4">
        <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1 text-center">Medication Form</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'Tablet', icon: 'circle', label: 'Tablet' },
            { id: 'Capsule', icon: 'pill', label: 'Capsule' },
            { id: 'Liquid', icon: 'droplet', label: 'Liquid' },
            { id: 'Cream', icon: 'beaker', label: 'Cream' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setType(item.id as any)}
              className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-4 transition-all ${
                type === item.id 
                ? 'border-brand-500 bg-brand-50 shadow-lg' 
                : 'border-white bg-white shadow-soft opacity-60 grayscale hover:grayscale-0'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${type === item.id ? 'text-brand-600' : 'text-stone-300'}`}>
                <Icon name={item.icon} size={48} />
              </div>
              <span className="font-black text-stone-800 uppercase tracking-widest text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1 text-center">Visual Label</h3>
        <div className="flex justify-between px-2 bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm">
          {['bg-[#FF5C73]', 'bg-[#5B95F9]', 'bg-[#4ADE80]', 'bg-[#FBBF24]', 'bg-[#A855F7]'].map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full transition-all ring-offset-4 ${color} ${selectedColor === color ? 'ring-4 ring-brand-100 scale-110 shadow-lg' : 'opacity-30'}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full py-5 mt-4 bg-brand-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-brand-100 animate-pop flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
          Continue to Schedule
          <Icon name="chevron-right" size={20} />
      </button>
    </div>
  );

  const renderScheduleStep = () => (
    <div className="space-y-4 animate-fade-in pt-2 flex flex-col items-center">
       <div className="space-y-3 w-full">
          <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1 text-center">Daily Reminder Time</h3>
          <div className="flex justify-center items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-soft border border-stone-100">
             <div className="flex flex-col items-center gap-1.5">
                <input 
                   type="text" 
                   inputMode="numeric"
                   value={hour} 
                   onChange={(e) => setHour(e.target.value.padStart(2, '0').slice(-2))}
                   className="w-20 text-center text-4xl font-black text-stone-900 bg-stone-50 rounded-2xl p-4 focus:ring-4 ring-brand-100 focus:outline-none border-none shadow-inner" 
                />
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Hour</span>
             </div>
             <span className="text-4xl font-black text-stone-300 pb-8">:</span>
             <div className="flex flex-col items-center gap-1.5">
                <input 
                   type="text" 
                   inputMode="numeric"
                   value={minute} 
                   onChange={(e) => setMinute(e.target.value.padStart(2, '0').slice(-2))}
                   className="w-20 text-center text-4xl font-black text-stone-900 bg-stone-50 rounded-2xl p-4 focus:ring-4 ring-brand-100 focus:outline-none border-none shadow-inner" 
                />
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Min</span>
             </div>
             <div className="flex flex-col gap-2 ml-4">
                {['AM', 'PM'].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-xl font-black text-sm transition-all shadow-sm ${period === p ? 'bg-brand-600 text-white shadow-brand-100' : 'bg-stone-100 text-stone-400'}`}
                  >
                    {p}
                  </button>
                ))}
             </div>
          </div>
       </div>

       <div className="space-y-3 w-full">
          <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1 text-center">Frequency</h3>
          <div className="grid grid-cols-2 gap-3">
             {['Daily', 'Twice Daily', 'Weekly', 'As Needed'].map(freq => (
                <button
                   key={freq}
                   onClick={() => setFrequency(freq)}
                   className={`p-5 rounded-2xl font-black text-xs transition-all border-2 ${
                     frequency === freq 
                     ? 'border-brand-500 bg-brand-50 text-brand-600 shadow-sm' 
                     : 'border-stone-100 bg-white text-stone-400'
                   }`}
                >
                   {freq}
                </button>
             ))}
          </div>
       </div>

       <button
        onClick={handleNext}
        className="w-full py-5 mt-4 bg-brand-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-brand-100 animate-pop flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
          Continue to Inventory
          <Icon name="chevron-right" size={20} />
      </button>
    </div>
  );

  const renderInventoryStep = () => {
    const unit = type === 'Liquid' ? 'ml' : 'pills';
    return (
      <div className="space-y-8 animate-fade-in pt-4">
        <div className="bg-white p-8 rounded-[3rem] shadow-soft border border-stone-100 space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-black text-stone-900">Bottle Supply</h3>
              <p className="text-stone-400 font-bold text-sm leading-tight mt-1">Starting count for tracking</p>
            </div>
            <div className="flex items-center justify-between gap-6">
                <button 
                  onClick={() => setStockQuantity(Math.max(0, stockQuantity - (type === 'Liquid' ? 10 : 1)))} 
                  className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 active:scale-90 transition-transform"
                >
                  <Icon name="minus" size={28} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-5xl font-black text-stone-900">{stockQuantity}</span>
                    <span className="text-xs font-black text-stone-400 uppercase tracking-widest mt-1">{unit}</span>
                </div>
                <button 
                  onClick={() => setStockQuantity(stockQuantity + (type === 'Liquid' ? 10 : 1))} 
                  className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 active:scale-90 transition-transform"
                >
                  <Icon name="plus" size={28} />
                </button>
            </div>
            <div className="h-px bg-stone-100"></div>
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                   <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Low Stock Alert</h4>
                   <span className="text-brand-600 font-black text-xs">{refillThreshold} {unit}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={type === 'Liquid' ? 200 : 30} 
                  value={refillThreshold} 
                  onChange={(e) => setRefillThreshold(parseInt(e.target.value))} 
                  className="w-full h-3 bg-stone-100 rounded-full appearance-none accent-brand-600 cursor-pointer" 
                />
            </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-5 mt-4 bg-brand-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-brand-100 animate-pop flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
            Add to Dashboard
            <Icon name="check" size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col animate-fade-in overflow-hidden">
      <div className="bg-white px-6 pt-12 pb-2 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="p-3 -ml-3 text-stone-400 hover:text-stone-900 transition-colors">
            <Icon name="back" size={28} />
          </button>
          <div className="text-center">
             <h1 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Step {currentStepIndex + 1} of 4</h1>
             <h2 className="text-lg font-black text-stone-900 leading-tight">
                {currentStep === 'MENU' ? 'Medication' : 
                 currentStep === 'TYPE' ? 'Form & Style' :
                 currentStep === 'SCHEDULE' ? 'Set Reminder' : 'Inventory'}
             </h2>
          </div>
          <button onClick={onCancel} className="p-3 -mr-3 text-stone-300 hover:text-stone-600">
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-brand-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto no-scrollbar pb-32">
        <div className="max-w-sm mx-auto h-full">
          {currentStep === 'MENU' && renderMenuStep()}
          {currentStep === 'TYPE' && renderTypeStep()}
          {currentStep === 'SCHEDULE' && renderScheduleStep()}
          {currentStep === 'INVENTORY' && renderInventoryStep()}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100 safe-area-bottom z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-sm mx-auto flex gap-4">
           {currentStepIndex > 0 && (
             <button 
                onClick={handleBack}
                className="flex-1 py-5 rounded-2xl bg-stone-100 text-stone-400 font-black text-lg active:scale-95 transition-all"
             >
                Back
             </button>
           )}
           <button 
              onClick={handleNext}
              disabled={!name}
              className={`flex-[2] py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                  !name
                  ? 'bg-stone-100 text-stone-300 shadow-none cursor-not-allowed'
                  : 'bg-brand-600 text-white shadow-brand-100'
              }`}
           >
              {currentStepIndex === steps.length - 1 ? 'Finish & Save' : 'Next'}
           </button>
        </div>
      </div>
    </div>
  );
};
