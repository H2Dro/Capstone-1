
import React from 'react';
import { Icon } from './Icon';

interface PatientPortalProps {
  onBack: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      {/* Professional Medical Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
          <Icon name="back" size={24} />
        </button>
        <div className="flex flex-col items-center">
             <div className="flex items-center gap-2">
                <Icon name="activity" size={20} className="text-teal-600" />
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">MyHealth+</h1>
             </div>
        </div>
        <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-700 font-bold border border-teal-100">
            EP
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        
        {/* Welcome & Alerts */}
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome, Elanor</h2>
            <div className="mt-4 bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <Icon name="bell" size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-orange-800 text-sm">Action Required</h3>
                    <p className="text-sm text-orange-700 mt-1 leading-snug">It's time for your annual flu shot. Please schedule an appointment.</p>
                    <button className="mt-2 text-xs font-bold text-orange-600 hover:text-orange-800 uppercase tracking-wide">Schedule Now</button>
                </div>
            </div>
        </div>

        {/* Health Snapshot Grid */}
        <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2 text-slate-400 mb-2">
                     <Icon name="heart" size={16} />
                     <span className="text-xs font-bold uppercase">Blood Pressure</span>
                 </div>
                 <div className="flex items-end gap-1">
                     <span className="text-2xl font-bold text-slate-900">120/80</span>
                     <span className="text-xs text-slate-400 font-medium mb-1">mmHg</span>
                 </div>
                 <div className="mt-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit">Normal</div>
             </div>
             
             <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2 text-slate-400 mb-2">
                     <Icon name="activity" size={16} />
                     <span className="text-xs font-bold uppercase">Heart Rate</span>
                 </div>
                 <div className="flex items-end gap-1">
                     <span className="text-2xl font-bold text-slate-900">72</span>
                     <span className="text-xs text-slate-400 font-medium mb-1">bpm</span>
                 </div>
                 <p className="mt-2 text-[10px] text-slate-400">Last checked: Oct 20</p>
             </div>
        </div>

        {/* Quick Actions */}
        <div>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 ml-1">Quick Actions</h3>
             <div className="grid grid-cols-4 gap-2">
                 <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-teal-200 hover:bg-teal-50 transition-all">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                         <Icon name="message-square" size={20} />
                     </div>
                     <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">Message<br/>Doctor</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-teal-200 hover:bg-teal-50 transition-all">
                     <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                         <Icon name="pill" size={20} />
                     </div>
                     <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">Renew<br/>Meds</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-teal-200 hover:bg-teal-50 transition-all">
                     <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                         <Icon name="credit-card" size={20} />
                     </div>
                     <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">Pay<br/>Bill</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-teal-200 hover:bg-teal-50 transition-all">
                     <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                         <Icon name="clipboard" size={20} />
                     </div>
                     <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">View<br/>Records</span>
                 </button>
             </div>
        </div>

        {/* Messages */}
        <section className="space-y-3">
             <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Messages</h3>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">2 New</span>
             </div>
             
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-4 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Icon name="user" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                              <h4 className="font-bold text-slate-900 text-sm truncate">Dr. Andrew Smith</h4>
                              <span className="text-xs text-slate-400">10:30 AM</span>
                          </div>
                          <p className="text-sm font-medium text-slate-800 truncate">RE: Lab Results Question</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">Your lipid panel looks excellent, Elanor. Keep up...</p>
                      </div>
                 </div>
                 <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Icon name="user" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                              <h4 className="font-bold text-slate-900 text-sm truncate">Billing Dept</h4>
                              <span className="text-xs text-slate-400">Oct 22</span>
                          </div>
                          <p className="text-sm font-medium text-slate-800 truncate">Statement Available</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">Your statement for the visit on Oct 15 is read...</p>
                      </div>
                 </div>
             </div>
        </section>

        {/* Test Results */}
        <section className="space-y-3 pb-6">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide ml-1">Recent Test Results</h3>
             
             <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-teal-200 transition-colors">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Icon name="beaker" size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-900">CBC w/ Diff</h4>
                          <p className="text-xs text-slate-500 font-medium">Ordered by Dr. Smith • Oct 15</p>
                      </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Final</span>
                      <Icon name="chevron-right" size={16} className="text-slate-300 group-hover:text-teal-500" />
                  </div>
             </div>

             <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-teal-200 transition-colors">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                          <Icon name="file-chart" size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-900">Lipid Panel</h4>
                          <p className="text-xs text-slate-500 font-medium">Ordered by Dr. Smith • Oct 15</p>
                      </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Final</span>
                      <Icon name="chevron-right" size={16} className="text-slate-300 group-hover:text-teal-500" />
                  </div>
             </div>
        </section>

      </div>
    </div>
  );
};
