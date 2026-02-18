
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { AppointmentItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { generateDoctorsForSpecialty, GeneratedDoctor } from '../services/geminiService';

interface AddAppointmentProps {
  onSave: (appointment: AppointmentItem) => void;
  onCancel: () => void;
}

interface SpecialtyType {
    id: string;
    label: string;
    icon: string;
    colorClass: string;
    textClass: string;
    hospital: string;
}

interface DoctorProfile extends GeneratedDoctor {
    id: string;
    specialtyId: string;
    favorite?: boolean;
}

const SPECIALTIES: SpecialtyType[] = [
    { id: 'gp', label: 'General Doctor', icon: 'stethoscope', colorClass: 'bg-blue-100', textClass: 'text-blue-600', hospital: 'City Clinic' },
    { id: 'cardio', label: 'Cardiologist', icon: 'heart', colorClass: 'bg-rose-100', textClass: 'text-rose-600', hospital: 'ABC Hospital' },
    { id: 'neuro', label: 'Neurologist', icon: 'brain', colorClass: 'bg-indigo-100', textClass: 'text-indigo-600', hospital: 'Mercy Hospital' },
    { id: 'ortho', label: 'Orthopedist', icon: 'bone', colorClass: 'bg-orange-100', textClass: 'text-orange-600', hospital: 'U of U Hospital' },
    { id: 'eye', label: 'Eye Specialist', icon: 'eye', colorClass: 'bg-emerald-100', textClass: 'text-emerald-600', hospital: 'Vision Center' },
    { id: 'dentist', label: 'Dentist', icon: 'smile', colorClass: 'bg-cyan-100', textClass: 'text-cyan-600', hospital: 'Bright Smiles' },
];

export const AddAppointment: React.FC<AddAppointmentProps> = ({ onSave, onCancel }) => {
  const { fontSize } = useTheme();
  const [step, setStep] = useState<'SPECIALTY' | 'DOCTOR_SELECTION' | 'DETAILS'>('SPECIALTY');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  const [doctorList, setDoctorList] = useState<DoctorProfile[]>([]);
  
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const isLarge = fontSize === 'large';
  const MORNING_SLOTS = ['09:00 AM', '10:00 AM', '11:15 AM'];
  const AFTERNOON_SLOTS = ['01:00 PM', '02:30 PM', '04:00 PM'];
  
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentMonthShort = now.toLocaleString('default', { month: 'short' });

  // Memoize sorted list to put favorites at the top
  const sortedDoctorList = useMemo(() => {
    return [...doctorList].sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });
  }, [doctorList]);

  const handleSpecialtySelect = async (spec: SpecialtyType) => {
    setSelectedSpecialtyId(spec.id);
    setSpecialty(spec.label);
    setHospital(spec.hospital);
    
    setIsGenerating(true);
    setStep('DOCTOR_SELECTION');
    
    let location = undefined;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
            timeout: 5000,
            enableHighAccuracy: false
        });
      });
      location = { lat: position.coords.latitude, lng: position.coords.longitude };
    } catch (e) {
      console.warn("Location retrieval failed or timed out. Falling back to general generation.");
    }

    try {
      const generated = await generateDoctorsForSpecialty(spec.label, location);
      const profiles: DoctorProfile[] = generated.map((doc, idx) => ({
        ...doc,
        id: `${spec.id}-${idx}`,
        specialtyId: spec.id,
        favorite: false
      }));
      setDoctorList(profiles);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDoctorSelect = (doc: DoctorProfile) => {
      setSelectedDoctor(doc);
      setDoctorName(doc.name);
      setHospital(doc.hospital);
      setStep('DETAILS');
  };

  const toggleFavorite = (e: React.MouseEvent, docId: string) => {
      e.stopPropagation();
      setDoctorList(prev => prev.map(doc => doc.id === docId ? { ...doc, favorite: !doc.favorite } : doc));
  };

  const handleBack = () => {
      if (step === 'DETAILS') setStep('DOCTOR_SELECTION');
      else if (step === 'DOCTOR_SELECTION') { 
        setStep('SPECIALTY'); 
        setSelectedSpecialtyId(null); 
        setDoctorList([]);
      }
      else onCancel();
  };

  const handleSave = () => {
    if (!doctorName || !selectedSlot) return;
    onSave({ 
      id: Date.now().toString(), 
      doctorName, 
      specialty, 
      hospital, 
      date: `${currentMonthShort} ${selectedDate}`, 
      time: selectedSlot, 
      rating: selectedDoctor?.rating || 4.8, 
      favorite: selectedDoctor?.favorite || false,
      status: 'PENDING'
    });
  };

  const renderCalendar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return (
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-slate-800 text-lg">{currentMonthName}</h3>
            <div className="flex gap-2">
                <button className="p-1 text-slate-400"><Icon name="chevron-left" size={20} /></button>
                <button className="p-1 text-slate-400"><Icon name="chevron-right" size={20} /></button>
            </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S','M','T','W','T','F','S'].map((d,i) => (<span key={i} className="text-xs font-bold text-slate-400">{d}</span>))}
        </div>
        <div className="grid grid-cols-7 gap-1">
             <div className="h-8"></div><div className="h-8"></div>
            {days.map(d => (
                <button key={d} onClick={() => { setSelectedDate(d); setSelectedSlot(null); }} className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${selectedDate === d ? 'bg-brand-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>{d}</button>
            ))}
        </div>
      </div>
    );
  }

  const renderSpecialtySelection = () => (
    <div className="p-6">
        <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">Who do you need to see?</h2>
        <p className="text-slate-500 font-bold mb-6">Select a specialty to find the best available providers nearby.</p>
        <div className={`grid gap-4 ${isLarge ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {SPECIALTIES.map((spec) => (
                <button
                    key={spec.id}
                    onClick={() => handleSpecialtySelect(spec)}
                    className={`flex items-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all gap-5 text-left active:scale-95 ${isLarge ? 'w-full' : 'flex-col items-center text-center'}`}
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${spec.colorClass} ${spec.textClass} shadow-sm border border-white/50`}>
                         <Icon name={spec.icon} size={32} />
                    </div>
                    <span className="font-black text-slate-700 text-sm leading-tight">{spec.label}</span>
                </button>
            ))}
        </div>
    </div>
  );

  const renderDoctorSelection = () => {
      return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Available Professionals</h2>
            <div className="space-y-4 pt-2">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div>
                      <p className="text-slate-400 font-bold">Matching you with local providers...</p>
                  </div>
                ) : sortedDoctorList.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-slate-400 font-bold">No providers found. Please try again.</p>
                  </div>
                ) : (
                  sortedDoctorList.map(doc => (
                      <button key={doc.id} onClick={() => handleDoctorSelect(doc)} className="w-full bg-white border border-slate-100 rounded-3xl p-5 flex items-start gap-4 shadow-sm hover:border-brand-200 transition-all text-left relative group animate-fade-in">
                          <button onClick={(e) => toggleFavorite(e, doc.id)} className="absolute top-4 right-4 p-2 rounded-full z-10 transition-transform active:scale-125"><Icon name="heart" size={24} className={doc.favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-200'} /></button>
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white/50 ${doc.gender === 'female' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}><Icon name="user" size={36} /></div>
                          <div className="flex-1 min-w-0 pr-6">
                              <h3 className="font-black text-slate-900 text-lg truncate mb-1">{doc.name}</h3>
                              <div className="flex items-center gap-1.5 mb-2">
                                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg w-fit border border-yellow-100">
                                      <Icon name="star" size={12} className="fill-yellow-400 text-yellow-400" />
                                      <span className="text-[10px] font-black text-yellow-700">{doc.rating}</span>
                                  </div>
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{doc.reviews} Reviews</span>
                              </div>
                              <p className="text-xs text-slate-500 font-bold leading-relaxed line-clamp-2">{doc.bio}</p>
                              <div className="mt-3 flex items-center gap-1.5 text-brand-600">
                                  <Icon name="map-pin" size={12} />
                                  <span className="text-[10px] font-black uppercase tracking-tight truncate">{doc.hospital}</span>
                              </div>
                          </div>
                      </button>
                  ))
                )}
            </div>
        </div>
      );
  };

  const renderBookingForm = () => (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-32">
        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 flex items-start gap-5 shadow-soft relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-full blur-2xl -mr-6 -mt-6"></div>
             <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center overflow-hidden shrink-0 shadow-inner ${selectedDoctor?.gender === 'female' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}><Icon name="user" size={44} /></div>
             <div className="flex-1 relative z-10 pt-1">
                <h2 className="font-black text-2xl text-slate-900 leading-none mb-1">{doctorName}</h2>
                <p className="text-brand-600 font-black text-sm uppercase tracking-widest">{specialty}</p>
                <p className="text-xs text-slate-400 font-bold mt-2">{hospital}</p>
             </div>
        </div>
        <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Date</h4>
            {renderCalendar()}
        </div>
        <div className="space-y-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Available Times</h4>
             <div className="grid grid-cols-2 gap-3">
                 {[...MORNING_SLOTS, ...AFTERNOON_SLOTS].map(slot => (
                     <button key={slot} onClick={() => setSelectedSlot(slot)} className={`py-5 px-2 rounded-2xl text-lg font-black border-2 transition-all ${selectedSlot === slot ? 'bg-brand-600 text-white border-brand-600 shadow-xl shadow-brand-100' : 'bg-white text-slate-600 border-slate-100'}`}>{slot}</button>
                 ))}
             </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 safe-area-bottom z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            <button onClick={handleSave} disabled={!selectedSlot} className={`w-full py-5 rounded-[1.5rem] font-black text-xl shadow-2xl transition-all ${selectedSlot ? 'bg-brand-600 text-white shadow-brand-200 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>Book Visit Now</button>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in relative overflow-hidden">
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors"><Icon name="back" size={24} /></button>
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest">{step === 'SPECIALTY' ? 'New Visit' : step === 'DOCTOR_SELECTION' ? 'Choose Doctor' : 'Details'}</h1>
        <div className="w-10" /> 
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">{step === 'SPECIALTY' && renderSpecialtySelection()}{step === 'DOCTOR_SELECTION' && renderDoctorSelection()}{step === 'DETAILS' && renderBookingForm()}</div>
    </div>
  );
};
