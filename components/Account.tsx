
import React, { useState } from 'react';
import { Icon } from './Icon';

interface AccountProps {
  onBack: () => void;
  onSettings: () => void;
}

export const Account: React.FC<AccountProps> = ({ onBack, onSettings }) => {
  const [showCaregivers, setShowCaregivers] = useState(false);

  const caregivers = [
    { name: "Sarah P.", relation: "Daughter", isPrimary: true, phone: "(555) 987-6543" },
    { name: "Emily P.", relation: "Daughter", isPrimary: false, phone: "(555) 555-0199" }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-fade-in flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        <div className="w-10" /> {/* Spacer to keep title centered */}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-500 to-purple-500"></div>
          
          <div className="relative z-10 w-24 h-24 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center -mt-2 mb-3">
             <Icon name="user" size={48} className="text-slate-300" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900">Elanor P.</h2>
          <p className="text-slate-500 font-medium">Silver Member</p>
          
          <div className="flex gap-2 mt-4">
             <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold">Age 67</span>
             <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">Type A+</span>
          </div>
        </div>

        {/* Wellness Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2">
             <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                <Icon name="award" size={20} />
             </div>
             <span className="text-3xl font-bold text-slate-900">12</span>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Day Streak</span>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2">
             <div className="w-10 h-10 rounded-full bg-green-100 text-green-500 flex items-center justify-center">
                <Icon name="activity" size={20} />
             </div>
             <span className="text-3xl font-bold text-slate-900">95%</span>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Adherence</span>
          </div>
        </div>

        {/* Contact Info */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Contact Information</h3>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
             <div className="p-4 flex items-center gap-4 border-b border-slate-50">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Icon name="phone" size={20} />
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-bold uppercase">Phone</p>
                   <p className="text-slate-800 font-semibold">(555) 123-4567</p>
                </div>
             </div>
             <div className="p-4 flex items-center gap-4 border-b border-slate-50">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Icon name="mail" size={20} />
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                   <p className="text-slate-800 font-semibold">elanor@example.com</p>
                </div>
             </div>
             <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Icon name="map-pin" size={20} />
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-bold uppercase">Address</p>
                   <p className="text-slate-800 font-semibold">123 Maple Avenue, Apt 4B</p>
                </div>
             </div>
          </div>
        </section>

        {/* Settings / Actions */}
        <section className="space-y-3 pb-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Preferences</h3>
          <div className="space-y-2">
             <button 
               onClick={onSettings}
               className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform"
             >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Icon name="settings" size={20} />
                   </div>
                   <span className="font-bold text-slate-700">App Settings</span>
                </div>
                <Icon name="chevron-right" size={20} className="text-slate-300" />
             </button>

             <button className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Icon name="bell" size={20} />
                   </div>
                   <span className="font-bold text-slate-700">Notifications</span>
                </div>
                <Icon name="chevron-right" size={20} className="text-slate-300" />
             </button>

             {/* Caregivers Expandable Section */}
             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setShowCaregivers(!showCaregivers)}
                  className="w-full p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showCaregivers ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-600'}`}>
                          <Icon name="users" size={20} />
                       </div>
                       <span className="font-bold text-slate-700">Caregivers</span>
                    </div>
                    <Icon 
                        name="chevron-right" 
                        size={20} 
                        className={`text-slate-300 transition-transform duration-300 ${showCaregivers ? 'rotate-90' : ''}`} 
                    />
                </button>
                
                {showCaregivers && (
                    <div className="px-4 pb-4 space-y-3 animate-fade-in">
                         <div className="h-px bg-slate-50 mb-1"></div>
                         {caregivers.map((cg, idx) => (
                             <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-300 border border-slate-100 shadow-sm relative">
                                         <Icon name="user" size={20} />
                                         {cg.isPrimary && <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 border-2 border-white rounded-full"></div>}
                                     </div>
                                     <div>
                                         <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-800 text-sm leading-none">{cg.name}</p>
                                            {cg.isPrimary && (
                                                <span className="bg-teal-100 text-teal-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Primary</span>
                                            )}
                                         </div>
                                         <p className="text-xs text-slate-500 font-medium mt-1">{cg.relation}</p>
                                     </div>
                                 </div>
                                 <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-teal-600 hover:bg-teal-50 shadow-sm transition-colors">
                                    <Icon name="phone" size={18} />
                                 </button>
                             </div>
                         ))}
                         <button className="w-full py-3 mt-2 border border-dashed border-slate-300 rounded-xl text-slate-400 font-bold text-sm hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2">
                             <Icon name="plus" size={16} />
                             <span>Add Caregiver</span>
                         </button>
                    </div>
                )}
             </div>

             <button className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <Icon name="shield" size={20} />
                   </div>
                   <span className="font-bold text-slate-700">Privacy & Security</span>
                </div>
                <Icon name="chevron-right" size={20} className="text-slate-300" />
             </button>
          </div>
        </section>

        {/* Version Info */}
        <div className="text-center pb-8">
            <p className="text-xs font-medium text-slate-400">Version 2.4.0 (Build 342)</p>
            <button className="mt-2 text-sm font-bold text-rose-500 py-2 px-4 rounded-xl hover:bg-rose-50 transition-colors">
                Log Out
            </button>
        </div>

      </div>
    </div>
  );
};
