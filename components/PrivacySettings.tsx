
import React, { useState } from 'react';
import { Icon } from './Icon';

interface PrivacySettingsProps {
  onBack: () => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ onBack }) => {
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [shareHealth, setShareHealth] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <button 
      onClick={() => onChange(!checked)}
      aria-label={label}
      className={`w-14 h-8 rounded-full transition-colors relative focus:outline-none focus:ring-4 focus:ring-brand-100/50 ${checked ? 'bg-brand-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-fade-in flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Privacy & Security</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Security Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
             <Icon name="lock" size={18} className="text-slate-400" />
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Security Access</h2>
          </div>
          
          <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
             <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                      <Icon name="fingerprint" size={20} />
                   </div>
                   <div>
                      <p className="font-bold text-slate-800">Biometric Login</p>
                      <p className="text-xs text-slate-400">FaceID or TouchID</p>
                   </div>
                </div>
                <Toggle checked={biometrics} onChange={setBiometrics} label="Biometric Login" />
             </div>

             <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                      <Icon name="key" size={20} />
                   </div>
                   <div>
                      <p className="font-bold text-slate-800">Two-Factor Auth</p>
                      <p className="text-xs text-slate-400">Extra layer of protection</p>
                   </div>
                </div>
                <Toggle checked={twoFactor} onChange={setTwoFactor} label="Two Factor Auth" />
             </div>

             <button className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                      <Icon name="shield" size={20} />
                   </div>
                   <div>
                      <p className="font-bold text-slate-800">Change Password</p>
                      <p className="text-xs text-slate-400">Last changed 4 months ago</p>
                   </div>
                </div>
                <Icon name="chevron-right" size={20} className="text-slate-300" />
             </button>
          </div>
        </section>

        {/* Data & Privacy Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
             <Icon name="eye" size={18} className="text-slate-400" />
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Data & Sharing</h2>
          </div>
          
          <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
             <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div>
                   <p className="font-bold text-slate-800">Share Health Data</p>
                   <p className="text-xs text-slate-400 max-w-[200px]">Allows Sarah P. to view medication adherence</p>
                </div>
                <Toggle checked={shareHealth} onChange={setShareHealth} label="Share Health Data" />
             </div>

             <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div>
                   <p className="font-bold text-slate-800">Share Location</p>
                   <p className="text-xs text-slate-400 max-w-[200px]">Enable GPS sharing for Family Locator</p>
                </div>
                <Toggle checked={shareLocation} onChange={setShareLocation} label="Share Location" />
             </div>

             <button className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                      <Icon name="file-text" size={20} />
                   </div>
                   <div>
                      <p className="font-bold text-slate-800">Download My Data</p>
                      <p className="text-xs text-slate-400">Get a copy of all recorded logs</p>
                   </div>
                </div>
                <Icon name="download" size={20} className="text-slate-300" />
             </button>
          </div>
        </section>

        {/* Account Management */}
        <section className="pt-4 space-y-4">
           <button 
             onClick={() => setShowDeleteModal(true)}
             className="w-full p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
           >
              <Icon name="trash" size={18} />
              Delete Account
           </button>
           <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] px-8">
              Data is encrypted with industry standard AES-256 protocols
           </p>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-6 animate-fade-in" onClick={() => setShowDeleteModal(false)}>
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs text-center space-y-6 shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                  <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="alert" size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900">Wait!</h3>
                    <p className="text-slate-400 font-bold text-sm leading-tight">This will permanently erase all your health logs, activity history, and caregiver connections.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                      <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-slate-100 rounded-xl font-black text-slate-500 uppercase text-[10px] tracking-widest active:scale-95">Cancel</button>
                      <button 
                        className="w-full py-4 bg-rose-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-100 active:scale-95"
                      >
                        Yes, Delete All Data
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
