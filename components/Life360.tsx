
import React, { useState } from 'react';
import { Icon } from './Icon';
import { User } from '../types';

interface Life360Props {
  user: User | null;
  onBack: () => void;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  location: string;
  status: 'home' | 'driving' | 'work' | 'out';
  battery: number;
  isCharging: boolean;
  speed?: number; // mph
  coordinates: { x: number; y: number }; // Percentage 0-100
  lastUpdate: string;
  avatarColor: string;
}

export const Life360: React.FC<Life360Props> = ({ user, onBack }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('1');
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // Accurately represent the core users from the app logic
  const members: FamilyMember[] = [
    {
      id: '1',
      name: 'Elanor P.',
      relation: user?.role === 'PATIENT' ? 'You' : 'Mother',
      location: 'Home - 123 Maple Ave',
      status: 'home',
      battery: 68,
      isCharging: false,
      coordinates: { x: 50, y: 50 },
      lastUpdate: 'Now',
      avatarColor: 'bg-brand-500'
    },
    {
      id: '2',
      name: 'Sarah P.',
      relation: user?.role === 'CAREGIVER' ? 'You' : 'Daughter',
      location: 'Near State St & 400 S',
      status: 'driving',
      speed: 35,
      battery: 92,
      isCharging: true,
      coordinates: { x: 65, y: 35 },
      lastUpdate: '1 min ago',
      avatarColor: 'bg-teal-500'
    },
    {
      id: '3',
      name: 'Jack P.',
      relation: 'Grandson',
      location: 'West High School',
      status: 'work',
      battery: 45,
      isCharging: false,
      coordinates: { x: 30, y: 25 },
      lastUpdate: '12 mins ago',
      avatarColor: 'bg-blue-500'
    }
  ];

  const selectedMember = members.find(m => m.id === selectedMemberId) || members[0];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col animate-fade-in relative overflow-hidden">
      
      {/* Map Layer (Simulation) */}
      <div className="absolute inset-0 z-0 bg-[#E5E7EB]" onClick={() => setIsMenuOpen(false)}>
         {/* Map Grid Simulation */}
         <div className="w-full h-full opacity-30 relative overflow-hidden">
             {/* Vertical Streets */}
             <div className="absolute left-[20%] top-0 bottom-0 w-2 bg-white"></div>
             <div className="absolute left-[40%] top-0 bottom-0 w-2 bg-white"></div>
             <div className="absolute left-[60%] top-0 bottom-0 w-2 bg-white"></div>
             <div className="absolute left-[80%] top-0 bottom-0 w-2 bg-white"></div>
             
             {/* Horizontal Streets */}
             <div className="absolute top-[20%] left-0 right-0 h-2 bg-white"></div>
             <div className="absolute top-[40%] left-0 right-0 h-2 bg-white"></div>
             <div className="absolute top-[60%] left-0 right-0 h-2 bg-white"></div>
             <div className="absolute top-[80%] left-0 right-0 h-2 bg-white"></div>

             {/* Neighborhood Landmarks */}
             <div className="absolute top-[35%] left-[45%] w-24 h-24 bg-slate-300/50 rounded-lg flex items-center justify-center">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">City Center</span>
             </div>
             
             <div className="absolute top-[10%] left-[50%] -translate-x-1/2 flex flex-col items-center">
                 <div className="w-12 h-8 bg-slate-300/50 rounded-t-full"></div>
                 <div className="w-16 h-4 bg-slate-300/50"></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase mt-1">Park Area</span>
             </div>
         </div>

         {/* Member Pins */}
         {members.map(member => (
             <button
                key={member.id}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMemberId(member.id);
                    setIsMenuOpen(true);
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 flex flex-col items-center group z-10 ${
                    selectedMemberId === member.id ? 'scale-110 z-20' : 'scale-100 opacity-90 hover:opacity-100'
                }`}
                style={{ left: `${member.coordinates.x}%`, top: `${member.coordinates.y}%` }}
             >
                 <div className={`w-14 h-14 rounded-full border-[4px] border-white shadow-xl ${member.avatarColor} flex items-center justify-center text-white relative transition-transform group-active:scale-90`}>
                     {member.status === 'driving' ? (
                         <Icon name="car" size={24} />
                     ) : (
                         <span className="font-black text-xl">{member.name[0]}</span>
                     )}
                     
                     {/* Pulse effect for selected or active status */}
                     {selectedMemberId === member.id && (
                         <div className={`absolute inset-[-6px] rounded-full border-2 ${member.avatarColor.replace('bg-', 'border-')} animate-ping opacity-30`}></div>
                     )}
                 </div>
                 <div className={`bg-white px-3 py-1 rounded-full shadow-lg mt-2 transition-all duration-200 border border-slate-100 ${selectedMemberId === member.id ? 'scale-100 opacity-100' : 'scale-75 opacity-0 group-hover:scale-90 group-hover:opacity-100'}`}>
                     <span className="text-[10px] font-black text-slate-800 whitespace-nowrap uppercase tracking-widest">{member.name.split(' ')[0]}</span>
                 </div>
             </button>
         ))}
      </div>

      {/* Header Overlay */}
      <div className="relative z-10 px-6 pt-12 pb-4 flex items-center justify-between pointer-events-none">
         <button onClick={onBack} className="pointer-events-auto w-12 h-12 bg-white rounded-2xl shadow-xl text-slate-700 hover:bg-slate-50 flex items-center justify-center active:scale-90 transition-all">
           <Icon name="back" size={24} />
         </button>
         <div className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-full shadow-xl border border-white/50 flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="font-black text-slate-900 text-xs uppercase tracking-[0.15em]">Family Life Map</span>
         </div>
         <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      {/* Bottom Sheet Card */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMenuOpen ? 'translate-y-0' : 'translate-y-[calc(100%-4rem)]'
        }`}
      >
          {/* Handle / Toggle Area */}
          <div 
            className="w-full flex justify-center pt-4 pb-4 cursor-pointer hover:bg-slate-50 rounded-t-[3rem] active:bg-slate-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
              <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-1.5 bg-slate-200 rounded-full"></div>
                  {!isMenuOpen && <Icon name="chevron-up" size={18} className="text-slate-400 mt-1 animate-bounce" />}
              </div>
          </div>

          <div className="bg-white pb-safe">
            {/* Member Selector Row */}
            <div className="flex justify-start gap-6 py-4 border-b border-slate-50 px-8 overflow-x-auto no-scrollbar">
                {members.map(member => (
                    <button
                        key={member.id}
                        onClick={() => {
                            setSelectedMemberId(member.id);
                            setIsMenuOpen(true);
                        }}
                        className={`flex flex-col items-center gap-2 transition-all shrink-0 ${selectedMemberId === member.id ? 'opacity-100 scale-105' : 'opacity-40 grayscale hover:grayscale-0'}`}
                    >
                        <div className={`w-16 h-16 rounded-[1.5rem] ${member.avatarColor} flex items-center justify-center text-white shadow-lg border-[3px] ${selectedMemberId === member.id ? 'border-brand-500' : 'border-transparent'}`}>
                            <span className="font-black text-2xl">{member.name[0]}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{member.name.split(' ')[0]}</span>
                    </button>
                ))}
            </div>

            {/* Selected Member Details */}
            <div className="p-8 pb-12 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-black text-slate-900">{selectedMember.name}</h2>
                            <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{selectedMember.relation}</span>
                        </div>
                        <p className="text-slate-500 font-bold text-sm leading-snug">{selectedMember.location}</p>
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-2 flex items-center gap-1">
                            <Icon name="clock" size={10} />
                            Updated {selectedMember.lastUpdate}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {selectedMember.status === 'driving' && (
                            <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-blue-100">
                                <Icon name="car" size={16} />
                                <span className="text-xs font-black">{selectedMember.speed} MPH</span>
                            </div>
                        )}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${selectedMember.battery < 20 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                            {selectedMember.isCharging ? <Icon name="zap" size={14} className="fill-current" /> : <Icon name="battery" size={16} />}
                            <span className="text-xs font-black">{selectedMember.battery}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 py-5 bg-brand-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-100 active:scale-95 transition-all">
                        <Icon name="navigation" size={20} />
                        <span>Route</span>
                    </button>
                    <button className="flex items-center justify-center gap-3 py-5 bg-white border-2 border-slate-100 text-slate-700 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all">
                        <Icon name="phone" size={20} />
                        <span>Call</span>
                    </button>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};
