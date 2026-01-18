
import React, { useState } from 'react';
import { Icon } from './Icon';

interface Life360Props {
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

export const Life360: React.FC<Life360Props> = ({ onBack }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('1');
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const members: FamilyMember[] = [
    {
      id: '1',
      name: 'Elanor',
      relation: 'You',
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
      name: 'Sarah',
      relation: 'Daughter',
      location: 'Near State St & 400 S',
      status: 'driving',
      speed: 42,
      battery: 88,
      isCharging: true,
      coordinates: { x: 65, y: 35 },
      lastUpdate: '2 mins ago',
      avatarColor: 'bg-teal-500'
    },
    {
      id: '3',
      name: 'Emily',
      relation: 'Daughter',
      location: 'University Hospital',
      status: 'work',
      battery: 32,
      isCharging: false,
      coordinates: { x: 80, y: 20 },
      lastUpdate: '15 mins ago',
      avatarColor: 'bg-purple-500'
    }
  ];

  const selectedMember = members.find(m => m.id === selectedMemberId) || members[0];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col animate-fade-in relative overflow-hidden">
      
      {/* Map Layer (Simulation) */}
      <div className="absolute inset-0 z-0 bg-[#E5E7EB]" onClick={() => setIsMenuOpen(false)}>
         {/* Map Grid Simulation for SLC */}
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

             {/* Temple Square Landmark */}
             <div className="absolute top-[35%] left-[45%] w-24 h-24 bg-slate-300/50 rounded-lg flex items-center justify-center">
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Temple Sq</span>
             </div>
             
             {/* Capitol Landmark */}
             <div className="absolute top-[10%] left-[50%] -translate-x-1/2 flex flex-col items-center">
                 <div className="w-12 h-8 bg-slate-300/50 rounded-t-full"></div>
                 <div className="w-16 h-4 bg-slate-300/50"></div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Capitol</span>
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
                    selectedMemberId === member.id ? 'scale-110 z-20' : 'scale-100 opacity-90'
                }`}
                style={{ left: `${member.coordinates.x}%`, top: `${member.coordinates.y}%` }}
             >
                 <div className={`w-12 h-12 rounded-full border-4 border-white shadow-lg ${member.avatarColor} flex items-center justify-center text-white relative`}>
                     {member.status === 'driving' ? (
                         <Icon name="car" size={20} />
                     ) : (
                         <span className="font-bold text-lg">{member.name[0]}</span>
                     )}
                     
                     {/* Pulse effect for selected */}
                     {selectedMemberId === member.id && (
                         <div className={`absolute inset-0 rounded-full ${member.avatarColor} animate-ping opacity-20`}></div>
                     )}
                 </div>
                 <div className="bg-white px-2 py-1 rounded-full shadow-md mt-1 scale-0 group-hover:scale-100 transition-transform origin-top">
                     <span className="text-xs font-bold text-slate-800 whitespace-nowrap">{member.name}</span>
                 </div>
             </button>
         ))}
      </div>

      {/* Header Overlay */}
      <div className="relative z-10 px-6 pt-12 pb-4 flex items-center justify-between pointer-events-none">
         <button onClick={onBack} className="pointer-events-auto p-2 -ml-2 bg-white rounded-full shadow-md text-slate-700 hover:bg-slate-50">
           <Icon name="back" size={24} />
         </button>
         <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/50">
             <span className="font-bold text-slate-800 text-sm">Family Safety</span>
         </div>
         <button className="pointer-events-auto p-2 -mr-2 bg-white rounded-full shadow-md text-slate-700 hover:bg-slate-50">
           <Icon name="settings" size={24} />
         </button>
      </div>

      {/* Bottom Sheet Card */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'
        }`}
      >
          {/* Handle / Toggle Area */}
          <div 
            className="w-full flex justify-center pt-3 pb-3 cursor-pointer hover:bg-slate-50 rounded-t-[2rem] active:bg-slate-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
              <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                  {!isMenuOpen && <Icon name="chevron-up" size={16} className="text-slate-400 mt-1 animate-bounce" />}
              </div>
          </div>

          <div className="bg-white">
            {/* Member Selector Row */}
            <div className="flex justify-center gap-4 py-2 border-b border-slate-100 px-6 overflow-x-auto no-scrollbar">
                {members.map(member => (
                    <button
                        key={member.id}
                        onClick={() => setSelectedMemberId(member.id)}
                        className={`flex flex-col items-center gap-1 transition-all ${selectedMemberId === member.id ? 'opacity-100 scale-105' : 'opacity-50'}`}
                    >
                        <div className={`w-14 h-14 rounded-full ${member.avatarColor} flex items-center justify-center text-white shadow-sm border-2 ${selectedMemberId === member.id ? 'border-brand-600' : 'border-transparent'}`}>
                            <span className="font-bold text-xl">{member.name[0]}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{member.name}</span>
                    </button>
                ))}
                <button className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                        <Icon name="plus" size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Add</span>
                </button>
            </div>

            {/* Selected Member Details */}
            <div className="p-6 pb-8 space-y-4 safe-area-bottom">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{selectedMember.name}</h2>
                        <p className="text-slate-500 font-medium">{selectedMember.location}</p>
                        <p className="text-xs text-slate-400 mt-1">Updated {selectedMember.lastUpdate}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        {selectedMember.status === 'driving' && (
                            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center gap-1.5 mb-1">
                                <Icon name="car" size={14} />
                                <span className="text-xs font-bold">{selectedMember.speed} mph</span>
                            </div>
                        )}
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${selectedMember.battery < 20 ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-600'}`}>
                            {selectedMember.isCharging ? <Icon name="zap" size={14} className="fill-current" /> : <Icon name="battery" size={14} />}
                            <span className="text-xs font-bold">{selectedMember.battery}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="flex items-center justify-center gap-2 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-200 active:scale-95 transition-transform">
                        <Icon name="navigation" size={18} />
                        <span>Navigate</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 active:scale-95 transition-transform">
                        <Icon name="phone" size={18} />
                        <span>Call</span>
                    </button>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};
