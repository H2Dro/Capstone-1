
import React from 'react';
import { Icon } from './Icon';

interface InjuryLogProps {
  onBack: () => void;
}

export const InjuryLog: React.FC<InjuryLogProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Safety & Injury Log</h1>
        <button className="p-2 -mr-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors">
          <Icon name="phone-call" size={24} />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        
        {/* Monitoring Status Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            
            <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-pulse">
                    <Icon name="shield" size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Monitoring Active</h2>
                    <p className="text-slate-500 text-sm font-medium">Smart Watch & Sensors Online</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wide">
                <span>Last Sync: Just Now</span>
                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                    <Icon name="check" size={12} />
                    System OK
                </span>
            </div>
        </div>

        {/* Fall Detection Log */}
        <section>
            <div className="flex items-center gap-2 mb-3 px-1">
                <Icon name="alert" size={20} className="text-orange-500" />
                <h3 className="text-lg font-bold text-slate-800">Fall Detection Events</h3>
            </div>
            
            <div className="space-y-3">
                {/* Event 1 */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                    <div className="flex flex-col items-center justify-center w-14 bg-slate-50 rounded-xl text-slate-500">
                        <span className="text-xs font-bold uppercase">Oct</span>
                        <span className="text-xl font-bold">12</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900">Hard Fall Detected</h4>
                            <span className="text-xs font-bold text-slate-400">2:45 PM</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Living Room • Smart Camera</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                            <Icon name="check-plain" size={12} />
                            Resolved - Helper Notified
                        </div>
                    </div>
                </div>

                {/* Event 2 */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 opacity-70">
                    <div className="flex flex-col items-center justify-center w-14 bg-slate-50 rounded-xl text-slate-500">
                        <span className="text-xs font-bold uppercase">Sep</span>
                        <span className="text-xl font-bold">04</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900">Trip / Stumble</h4>
                            <span className="text-xs font-bold text-slate-400">10:15 AM</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Garden • Smart Watch</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-xs font-bold">
                            No Injury Reported
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Injury Journal */}
        <section>
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <Icon name="clipboard" size={20} className="text-brand-500" />
                    <h3 className="text-lg font-bold text-slate-800">Injury Journal</h3>
                </div>
                <button className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors">
                    + Log New
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Icon name="activity" size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">Bruised Knee</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Left knee, mild swelling. Applying ice.</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Recorded Oct 12</p>
                     </div>
                </div>
                <div className="p-4 flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Icon name="alert" size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">Dizziness</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Felt lightheaded after standing up too fast.</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Recorded Sep 28</p>
                     </div>
                </div>
            </div>
        </section>

        {/* Share Button */}
        <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2">
            <Icon name="download" size={20} />
            Download Report for Doctor
        </button>

      </div>
    </div>
  );
};
