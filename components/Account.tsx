
import React, { useState } from 'react';
import { Icon } from './Icon';
import { User } from '../types';

interface AccountProps {
  user: User | null;
  onBack: () => void;
  onSettings: () => void;
  onPrivacy: () => void;
  onLogout: () => void;
}

interface CaregiverEntry {
  name: string;
  relation: string;
  isPrimary: boolean;
  phone: string;
}

export const Account: React.FC<AccountProps> = ({ user, onBack, onSettings, onPrivacy, onLogout }) => {
  const [showCaregivers, setShowCaregivers] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [caregivers, setCaregivers] = useState<CaregiverEntry[]>([
    { name: "Sarah P.", relation: "Daughter", isPrimary: true, phone: "(555) 987-6543" },
    { name: "Emily P.", relation: "Daughter", isPrimary: false, phone: "(555) 555-0199" }
  ]);

  // Form State for new caregiver
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Family');
  const [newPhone, setNewPhone] = useState('');

  if (!user) return null;

  const isCaregiver = user.role === 'CAREGIVER';

  const handleAddCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newEntry: CaregiverEntry = {
      name: newName,
      relation: newRelation,
      isPrimary: false,
      phone: newPhone
    };

    setCaregivers([...caregivers, newEntry]);
    setNewName('');
    setNewPhone('');
    setNewRelation('Family');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-fade-in flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-r ${isCaregiver ? 'from-teal-500 to-blue-500' : 'from-brand-500 to-purple-500'}`}></div>
          
          <div className="relative z-10 w-24 h-24 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center -mt-2 mb-3">
             <Icon name="user" size={48} className="text-slate-300" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900">{user.firstName} {user.lastName}</h2>
          <p className="text-slate-500 font-medium">{isCaregiver ? 'Primary Caregiver' : 'Silver Member'}</p>
          
          <div className="flex gap-2 mt-4">
             {isCaregiver ? (
               <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold">Authorized Assistant</span>
             ) : (
               <>
                 <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold">Age 67</span>
                 <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">Type A+</span>
               </>
             )}
          </div>
        </div>

        {/* Wellness Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2">
             <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                <Icon name="award" size={20} />
             </div>
             <span className="text-3xl font-bold text-slate-900">{isCaregiver ? '24' : '12'}</span>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{isCaregiver ? 'Help Actions' : 'Day Streak'}</span>
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
                   <p className="text-slate-800 font-semibold">{isCaregiver ? '(555) 987-6543' : '(555) 123-4567'}</p>
                </div>
             </div>
             <div className="p-4 flex items-center gap-4 border-b border-slate-50">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Icon name="mail" size={20} />
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                   <p className="text-slate-800 font-semibold">{user.firstName.toLowerCase()}@example.com</p>
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

             {!isCaregiver && (
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
                           <button 
                             onClick={() => setShowAddModal(true)}
                             className="w-full py-4 mt-2 bg-white border-2 border-dashed border-teal-200 rounded-xl text-teal-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-teal-50 transition-colors active:scale-[0.98]"
                           >
                             <Icon name="plus" size={18} />
                             Add New Caregiver
                           </button>
                      </div>
                  )}
               </div>
             )}

             <button 
               onClick={onPrivacy}
               className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform"
             >
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
            <button 
              onClick={onLogout}
              className="mt-2 text-sm font-bold text-rose-500 py-2 px-4 rounded-xl hover:bg-rose-50 transition-colors"
            >
                Log Out
            </button>
        </div>

      </div>

      {/* Add Caregiver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-6 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Add Caregiver</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCaregiver} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:border-brand-500 focus:bg-white outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Relationship</label>
                <select 
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:border-brand-500 focus:bg-white outline-none transition-all appearance-none"
                >
                  <option value="Daughter">Daughter</option>
                  <option value="Son">Son</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:border-brand-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-slate-500 uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newName || !newPhone}
                  className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-100 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
