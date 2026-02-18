
import React from 'react';
import { Icon } from './Icon';
import { ViewState, ActivityItem, MedicationItem, AppointmentItem, User } from '../types';

interface CaregiverDashboardProps {
  user: User;
  activities: ActivityItem[];
  medications: MedicationItem[];
  appointments: AppointmentItem[];
  onNavigate: (view: ViewState) => void;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  onApproveMed: (id: string) => void;
  onDeclineMed: (id: string) => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({ 
  user, 
  activities, 
  medications, 
  appointments, 
  onNavigate,
  onApprove,
  onDecline,
  onApproveMed,
  onDeclineMed
}) => {
  const medsTaken = medications.filter(m => m.taken && m.status === 'CONFIRMED').length;
  const medsTotal = medications.filter(m => m.status === 'CONFIRMED').length;
  const adherenceRate = Math.round((medsTaken / (medsTotal || 1)) * 100);
  
  const confirmedAppts = appointments.filter(a => a.status === 'CONFIRMED');
  const pendingAppts = appointments.filter(a => a.status === 'PENDING');
  const pendingMeds = medications.filter(m => m.status === 'PENDING');
  const nextAppt = confirmedAppts[0];

  const getTimeOfDayGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in transform-gpu">
      {/* Header Greeting */}
      <div className="px-1 mt-2">
        <h1 className="text-[2.2rem] font-black text-slate-900 leading-[1.1] tracking-tight">
          {getTimeOfDayGreeting()}, <span className="text-teal-600">{user.firstName}</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
           <div className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-teal-100">
             Primary Caregiver
           </div>
           <p className="text-slate-400 font-bold text-sm">Monitoring Elanor P.</p>
        </div>
      </div>

      {/* Well-being Hero Card */}
      <section>
        <div className="bg-gradient-to-br from-teal-950 to-slate-900 rounded-[2.5rem] p-8 text-left shadow-2xl shadow-teal-900/10 relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-2">Overall Well-being</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">{adherenceRate}%</span>
                    <span className="text-teal-400 font-bold">Stable</span>
                  </div>
               </div>
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-teal-400 border border-white/10 backdrop-blur-md">
                  <Icon name="activity" size={32} />
               </div>
            </div>

            <p className="text-white/60 font-bold text-sm leading-relaxed">
              Elanor has taken {medsTaken} of {medsTotal} medications today. One activity is currently in progress.
            </p>

            <button 
              onClick={() => onNavigate(ViewState.TODAY_DETAIL)}
              className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              View Full Schedule
              <Icon name="chevron-right" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Combined Pending Approvals Section */}
      {(pendingAppts.length > 0 || pendingMeds.length > 0) && (
        <section className="space-y-4 animate-pop">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest">Awaiting Approval</h3>
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {pendingAppts.length + pendingMeds.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {/* Pending Appointments */}
            {pendingAppts.map(appt => (
              <div key={appt.id} className="bg-white border-2 border-orange-100 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Icon name="calendar-clock" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 leading-tight">Visit: Dr. {appt.doctorName}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{appt.specialty} • {appt.date} @ {appt.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onDecline(appt.id)} className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Decline</button>
                  <button onClick={() => onApprove(appt.id)} className="flex-[2] py-3 bg-teal-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-100 active:scale-95 transition-all">Approve Visit</button>
                </div>
              </div>
            ))}

            {/* Pending Medications */}
            {pendingMeds.map(med => (
              <div key={med.id} className="bg-white border-2 border-orange-100 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Icon name="pill" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 leading-tight">Med: {med.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{med.dosage} • {med.frequency} for {med.purpose}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onDeclineMed(med.id)} className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Decline</button>
                  <button onClick={() => onApproveMed(med.id)} className="flex-[2] py-3 bg-teal-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-100 active:scale-95 transition-all">Approve Med</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Safety Status Monitor */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Safety Monitor</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatusCard icon="shield" label="Fall Status" value="Normal" color="text-green-500" bg="bg-green-50" />
          <StatusCard icon="battery-charging" label="Wearable" value="88%" color="text-teal-600" bg="bg-teal-50" />
          <StatusCard icon="map-pin" label="Location" value="At Home" color="text-blue-500" bg="bg-blue-50" />
          <StatusCard icon="bell" label="Alerts" value="None" color="text-slate-400" bg="bg-slate-50" />
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Tools</h3>
        <div className="grid grid-cols-2 gap-4">
          <ToolButton onClick={() => onNavigate(ViewState.LIFE_360)} icon="map" label="Live Map" color="teal" />
          <ToolButton onClick={() => onNavigate(ViewState.PATIENT_PORTAL)} icon="globe" label="MyHealth+" color="blue" />
          <ToolButton onClick={() => onNavigate(ViewState.ADD_MEDICATION)} icon="plus" label="Add Med" color="purple" />
          <ToolButton onClick={() => onNavigate(ViewState.APPOINTMENTS)} icon="calendar" label="Appointments" color="orange" />
        </div>
      </section>
    </div>
  );
};

const StatusCard: React.FC<{ icon: string; label: string; value: string; color: string; bg: string }> = ({ icon, label, value, color, bg }) => (
  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
    <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center`}>
       <Icon name={icon} size={20} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className={`text-lg font-black ${color} leading-none`}>{value}</p>
    </div>
  </div>
);

const ToolButton: React.FC<{ onClick: () => void; icon: string; label: string; color: string }> = ({ onClick, icon, label, color }) => {
  const colors: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100'
  };
  return (
    <button 
      onClick={onClick}
      className={`w-full p-5 rounded-[2rem] border-2 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group bg-white hover:border-teal-200`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color] || 'bg-slate-50 text-slate-400'}`}>
        <Icon name={icon} size={24} />
      </div>
      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{label}</span>
    </button>
  );
};
