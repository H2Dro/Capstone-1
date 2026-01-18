
import React, { useState } from 'react';
import { Icon } from './Icon';
import { AppointmentItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';

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

interface DoctorProfile {
    id: string;
    name: string;
    specialtyId: string;
    hospital: string;
    rating: number;
    reviews: number;
    distance: string;
    availability: string;
    gender: 'male' | 'female';
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

const MOCK_DOCTORS: DoctorProfile[] = [
    { id: 'gp1', name: 'Dr. Sarah Connor', specialtyId: 'gp', hospital: 'City Clinic', rating: 4.9, reviews: 124, distance: '1.2 mi', availability: 'Available Today', gender: 'female', favorite: true },
    { id: 'gp2', name: 'Dr. Mark Sloan', specialtyId: 'gp', hospital: 'City Clinic', rating: 4.7, reviews: 89, distance: '1.2 mi', availability: 'Next: Mon', gender: 'male' },
    { id: 'cd1', name: 'Dr. Andrew Smith', specialtyId: 'cardio', hospital: 'ABC Hospital', rating: 4.8, reviews: 210, distance: '3.5 mi', availability: 'Available Tomorrow', gender: 'male', favorite: true },
    { id: 'nr1', name: 'Dr. Jennifer Miller', specialtyId: 'neuro', hospital: 'Mercy Hospital', rating: 4.9, reviews: 156, distance: '5.0 mi', availability: 'Next: Wed', gender: 'female', favorite: true },
    { id: 'dn1', name: 'Dr. Michael Ross', specialtyId: 'dentist', hospital: 'Bright Smiles', rating: 4.9, reviews: 231, distance: '1.8 mi', availability: 'Available Today', gender: 'male', favorite: true },
];

export const AddAppointment: React.FC<AddAppointmentProps> = ({ onSave, onCancel }) => {
  const { fontSize } = useTheme();
  const [step, setStep] = useState<'SPECIALTY' | 'DOCTOR_SELECTION' | 'DETAILS'>('SPECIALTY');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  const [doctorList, setDoctorList] = useState<DoctorProfile[]>(MOCK_DOCTORS);
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const isLarge = fontSize === 'large';
  const MORNING_SLOTS = ['09:00 AM', '10:00 AM', '11:15 AM'];
  const AFTERNOON_SLOTS = ['01:00 PM', '02:30 PM', '04:00 PM'];

  const handleSpecialtySelect = (spec: SpecialtyType) => {
    setSelectedSpecialtyId(spec.id);
    setSpecialty(spec.label);
    setHospital(spec.hospital);
    setStep('DOCTOR_SELECTION');
  };

  const handleDoctorSelect = (doc: DoctorProfile) => {
      setSelectedDoctor(doc);
      setDoctorName(doc.name);
      setHospital(doc.hospital);
      setStep('DETAILS');
  };

  const toggleFavorite = (e: React.MouseEvent, docId: string) => {
      e.stopPropagation();
      const updatedList = doctorList.map(doc => doc.id === docId ? { ...doc, favorite: !doc.favorite } : doc);
      setDoctorList(updatedList);
      if (selectedDoctor && selectedDoctor.id === docId) setSelectedDoctor({ ...selectedDoctor, favorite: !selectedDoctor.favorite });
  };

  const handleBack = () => {
      if (step === 'DETAILS') setStep('DOCTOR_SELECTION');
      else if (step === 'DOCTOR_SELECTION') { setStep('SPECIALTY'); setSelectedSpecialtyId(null); }
      else onCancel();
  };

  const handleSave = () => {
    if (!doctorName || !selectedSlot) return;
    onSave({ id: Date.now().toString(), doctorName, specialty, hospital, date: `Oct ${selectedDate}`, time: selectedSlot, rating: selectedDoctor?.rating || 4.8, favorite: selectedDoctor?.favorite || false });
  };

  const renderCalendar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return (
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-slate-800 text-lg">October</h3>
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Who do you need to see?</h2>
        <p className="text-slate-500 mb-6">Select a specialty.</p>
        <div className={`grid gap-4 ${isLarge ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {SPECIALTIES.map((spec) => (
                <button
                    key={spec.id}
                    onClick={() => handleSpecialtySelect(spec)}
                    className={`flex items-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all gap-5 text-left ${isLarge ? 'w-full' : 'flex-col items-center text-center'}`}
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${spec.colorClass} ${spec.textClass}`}>
                         <Icon name={spec.icon} size={32} />
                    </div>
                    <span className="font-bold text-slate-700 text-sm leading-tight">{spec.label}</span>
                </button>
            ))}
        </div>
    </div>
  );

  const renderDoctorSelection = () => {
      const filteredDoctors = doctorList.filter(doc => doc.specialtyId === selectedSpecialtyId);
      return (
        <div className="p-6 space-y-4 animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-900">Choose a Doctor</h2>
            <div className="space-y-4 pt-2">
                {filteredDoctors.map(doc => (
                    <button key={doc.id} onClick={() => handleDoctorSelect(doc)} className="w-full bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-4 shadow-sm hover:border-brand-200 transition-all text-left relative">
                        <button onClick={(e) => toggleFavorite(e, doc.id)} className="absolute top-4 right-4 p-2 rounded-full z-10"><Icon name="heart" size={20} className={doc.favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'} /></button>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${doc.gender === 'female' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}><Icon name="user" size={32} /></div>
                        <div className="flex-1 min-w-0 pr-6">
                            <h3 className="font-bold text-slate-900 text-lg truncate">{doc.name}</h3>
                            <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-md w-fit mb-1">
                                <Icon name="star" size={12} className="fill-yellow-400 text-yellow-400" /><span className="text-xs font-bold">{doc.rating}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{doc.hospital}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      );
  };

  const renderBookingForm = () => (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 flex items-start gap-4 shadow-sm relative">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 ${selectedDoctor?.gender === 'female' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}><Icon name="user" size={32} /></div>
             <div className="flex-1">
                <h2 className="font-bold text-lg text-slate-900">{doctorName}</h2>
                <p className="text-brand-600 font-medium">{specialty}</p>
                <p className="text-xs text-slate-400 mt-0.5">{hospital}</p>
             </div>
        </div>
        <div className="space-y-2"><span className="text-xs font-bold text-slate-500 uppercase">Select Date</span>{renderCalendar()}</div>
        <div className="space-y-4">
             <label className="text-xs font-bold text-slate-500 uppercase">Times</label>
             <div className="grid grid-cols-2 gap-3">
                 {[...MORNING_SLOTS, ...AFTERNOON_SLOTS].map(slot => (
                     <button key={slot} onClick={() => setSelectedSlot(slot)} className={`py-4 px-2 rounded-2xl text-base font-bold border transition-all ${selectedSlot === slot ? 'bg-brand-600 text-white border-brand-600 shadow-md' : 'bg-white text-slate-600 border-slate-200'}`}>{slot}</button>
                 ))}
             </div>
        </div>
        <div className="pt-4 safe-area-bottom">
            <button onClick={handleSave} disabled={!selectedSlot} className={`w-full py-5 rounded-3xl font-bold text-xl shadow-xl transition-all ${selectedSlot ? 'bg-brand-600 text-white shadow-brand-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>Confirm</button>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-400"><Icon name="back" size={24} /></button>
        <h1 className="text-xl font-bold text-slate-900">{step === 'SPECIALTY' ? 'New Visit' : step === 'DOCTOR_SELECTION' ? 'Choose Doctor' : 'Details'}</h1>
        <div className="w-10" /> 
      </div>
      <div className="flex-1 overflow-y-auto">{step === 'SPECIALTY' && renderSpecialtySelection()}{step === 'DOCTOR_SELECTION' && renderDoctorSelection()}{step === 'DETAILS' && renderBookingForm()}</div>
    </div>
  );
};
