
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ViewState, ActivityItem, AppointmentItem, MedicationItem, User } from './types';
import { MOCK_ACTIVITIES, MOCK_MEDICATIONS, MOCK_APPOINTMENTS } from './constants';
import { Icon } from './components/Icon';
import { Assistant } from './components/Assistant';
import { AddActivity } from './components/AddActivity';
import { ActivityDetail } from './components/ActivityDetail';
import { AddAppointment } from './components/AddAppointment';
import { RescheduleAppointment } from './components/RescheduleAppointment';
import { AddMedication } from './components/AddMedication';
import { MedicationDetail } from './components/MedicationDetail';
import { Account } from './components/Account';
import { Settings } from './components/Settings';
import { Life360 } from './components/Life360';
import { SuccessView } from './components/SuccessView';
import { TodayDetail } from './components/TodayDetail';
import { GamesHub } from './components/GamesHub';
import { PatientPortal } from './components/PatientPortal';
import { InjuryLog } from './components/InjuryLog';
import { Appointments } from './components/Appointments';
import { Activities } from './components/Activities';
import { MobileMenu } from './components/MobileMenu';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { useTheme } from './contexts/ThemeContext';

const App: React.FC = () => {
  const { fontSize } = useTheme();
  
  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gs-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<ViewState>(() => {
    const saved = localStorage.getItem('gs-user');
    return saved ? ViewState.DASHBOARD : ViewState.LOGIN;
  });

  const [history, setHistory] = useState<ViewState[]>([view]);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const mainScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo(0, 0);
    }
  }, [view]);

  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [appointments, setAppointments] = useState<AppointmentItem[]>(MOCK_APPOINTMENTS);
  
  const [medications, setMedications] = useState<MedicationItem[]>(() => {
    try {
      const saved = localStorage.getItem('gs-medications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Failed to parse medications", e);
    }
    return MOCK_MEDICATIONS.map((m, i) => ({ 
        ...m, 
        color: i % 2 === 0 ? 'bg-[#FF5C73]' : 'bg-[#5B95F9]',
        frequency: 'Daily'
    }));
  });

  useEffect(() => {
    localStorage.setItem('gs-medications', JSON.stringify(medications));
  }, [medications]);

  const [selectedMedication, setSelectedMedication] = useState<MedicationItem | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const parseTimeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(' ');
    if (parts.length < 2) return 0;
    const [time, period] = parts;
    const timeParts = time.split(':');
    let hours = Number(timeParts[0]);
    let minutes = timeParts.length > 1 ? Number(timeParts[1]) : 0;
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const sortedMedications = useMemo(() => {
    return [...medications].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
  }, [medications]);

  const medsRemaining = medications.filter(m => !m.taken).length;

  const handleLogin = (user: User) => {
    localStorage.setItem('gs-user', JSON.stringify(user));
    setCurrentUser(user);
    navigateTo(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('gs-user');
    setCurrentUser(null);
    setView(ViewState.LOGIN);
    setHistory([ViewState.LOGIN]);
    setShowMobileMenu(false);
  };

  const navigateTo = (nextView: ViewState) => {
    if (nextView === view) return;
    setHistory(prev => [...prev, nextView]);
    setView(nextView);
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevView = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setView(prevView);
    } else {
      const defaultView = currentUser ? ViewState.DASHBOARD : ViewState.LOGIN;
      setView(defaultView);
      setHistory([defaultView]);
    }
  };

  const showSuccess = (msg: string, nextView?: ViewState) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
      // Change: Default back to Dashboard (Home) after a success action
      if (nextView) {
          navigateTo(ViewState.DASHBOARD);
      }
    }, 1200);
  };

  const handleToggleTaken = (id: string) => {
    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        const isNowTaken = !m.taken;
        const newStock = isNowTaken 
          ? Math.max(0, m.stockQuantity - m.doseAmount) 
          : m.stockQuantity + m.doseAmount;
        const updated = { ...m, taken: isNowTaken, stockQuantity: newStock };
        if (isNowTaken) showSuccess(`${m.name} taken!`);
        return updated;
      }
      return m;
    }));
  };

  const getMedIcon = (type?: string) => {
    switch(type) {
      case 'Liquid': return 'droplet';
      case 'Tablet': return 'circle';
      case 'Capsule': return 'pill';
      case 'Cream': return 'beaker';
      default: return 'pill';
    }
  };

  const renderCurrentView = () => {
    if (!currentUser) return <Login onLogin={handleLogin} />;

    switch (view) {
      case ViewState.DASHBOARD:
        if (currentUser.role === 'CAREGIVER') {
          return (
            <CaregiverDashboard 
              user={currentUser}
              activities={activities}
              medications={medications}
              appointments={appointments}
              onNavigate={navigateTo}
            />
          );
        }
        return (
          <div className="space-y-10 pb-20 animate-fade-in transform-gpu">
            {/* Interactive Header Greeting Section */}
            <button 
              onClick={() => navigateTo(ViewState.TODAY_DETAIL)}
              className="w-full text-left px-1 mt-2 active:scale-[0.98] transition-all group"
            >
              <h1 className="text-[2.6rem] font-bold text-[#111827] leading-[1.1] tracking-tight">
                Good Morning,<br />
                <span className="text-brand-600 font-bold">{currentUser.firstName}</span>
              </h1>
              <p className="text-slate-400 font-bold mt-2 flex items-center gap-1.5 group-hover:text-brand-500 transition-colors">
                View your schedule <Icon name="chevron-right" size={16} />
              </p>
            </button>

            {/* Daily Summary Hero Card */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-2xl font-bold text-[#111827]">Today at a Glance</h3>
              </div>
              
              <button 
                onClick={() => navigateTo(ViewState.TODAY_DETAIL)}
                className="w-full bg-gradient-to-br from-brand-950 to-brand-900 rounded-[2.5rem] p-8 text-left shadow-2xl shadow-brand-900/20 relative overflow-hidden active:scale-[0.98] transition-all group border border-white/5"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col gap-6">
                  <div>
                    <h3 className="text-[2rem] font-black text-white leading-none tracking-tight mb-2">
                      Ready to start?
                    </h3>
                    <p className="text-white/60 font-bold text-lg">
                      {medsRemaining > 0 ? `There are ${medsRemaining} medications remaining.` : "All caught up on meds!"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/10">
                       <Icon name="sun" size={24} className="text-orange-400" />
                       <div className="text-center">
                          <span className="block text-white font-black text-lg leading-none">{activities.length}</span>
                          <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Acts</span>
                       </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/10">
                       <Icon name="pill" size={24} className="text-brand-400" />
                       <div className="text-center">
                          <span className="block text-white font-black text-lg leading-none">{medsRemaining}</span>
                          <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Meds</span>
                       </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/10">
                       <Icon name="stethoscope" size={24} className="text-blue-400" />
                       <div className="text-center">
                          <span className="block text-white font-black text-lg leading-none">{appointments.length}</span>
                          <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Visits</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/80 font-black text-[10px] uppercase tracking-[0.2em] mt-2">
                     <Icon name="sparkles" size={14} className="text-yellow-400" />
                     <span>Tap to view timeline</span>
                  </div>
                </div>
              </button>
            </section>

            {/* Quick Links Categories */}
            <section className="space-y-5">
              <h3 className="text-2xl font-bold text-[#111827] ml-1">Explore</h3>
              <div className="grid grid-cols-2 gap-4">
                <DashboardCategoryButton onClick={() => navigateTo(ViewState.ACTIVITIES)} icon="sun" label="Activities" />
                <DashboardCategoryButton onClick={() => navigateTo(ViewState.MEDICATIONS)} icon="pill" label="Medication" />
                <DashboardCategoryButton onClick={() => navigateTo(ViewState.APPOINTMENTS)} icon="calendar" label="Visits" />
                <DashboardCategoryButton onClick={() => navigateTo(ViewState.GAMES)} icon="gamepad" label="Training" />
              </div>
            </section>
          </div>
        );

      case ViewState.ACTIVITIES:
        return (
          <Activities 
            activities={activities} 
            onAdd={() => navigateTo(ViewState.ADD_ACTIVITY)} 
            onDelete={(id) => setActivities(prev => prev.filter(a => a.id !== id))} 
            onSelect={(activity) => {
               setSelectedActivity(activity);
               navigateTo(ViewState.ACTIVITY_DETAIL);
            }}
            onBack={handleBack} 
          />
        );

      case ViewState.ACTIVITY_DETAIL:
        return selectedActivity ? (
          <ActivityDetail 
            activity={selectedActivity} 
            onBack={handleBack} 
            onDelete={(id) => setActivities(prev => prev.filter(a => a.id !== id))}
          />
        ) : null;

      case ViewState.MEDICATIONS:
        return (
          <section className="animate-fade-in pt-6 pb-20 max-w-sm mx-auto transform-gpu">
            <h2 className="text-center text-3xl font-black text-[#1F2B4D] mb-8 leading-tight">Daily Medications</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-1">
              {sortedMedications.map(med => (
                <button 
                  key={med.id}
                  onClick={() => { setSelectedMedication(med); navigateTo(ViewState.UPDATE_MEDICATION); }}
                  className={`flex flex-col items-center bg-white p-4 sm:p-5 rounded-[2.5rem] shadow-soft hover:shadow-card transition-all relative group border-2 ${med.taken ? 'border-brand-50 opacity-90' : 'border-transparent'}`}
                >
                  <div className={`w-full aspect-square ${med.color || 'bg-brand-500'} rounded-[2.2rem] flex items-center justify-center relative mb-4 transition-transform group-hover:scale-[1.03]`}>
                    <div className="w-2/5 h-[58%] bg-white/95 rounded-[1.25rem] flex items-center justify-center text-stone-800 shadow-sm">
                      <Icon name={getMedIcon(med.type)} size={fontSize === 'large' ? 36 : 28} />
                    </div>
                    {med.taken && (
                      <div className="absolute -top-1.5 -right-1.5 bg-green-500 text-white p-1 rounded-full shadow-lg border-2 border-white z-10">
                        <Icon name="check" size={14} />
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full">
                    <h3 className="font-black text-lg sm:text-xl text-[#1F2B4D] leading-none mb-1.5 line-clamp-2">{med.name}</h3>
                    <p className="text-[#A1A9C1] font-bold text-xs sm:text-sm mb-3">{med.dosage}</p>
                    <div className="inline-flex items-center gap-1.5 bg-[#F1F3FF] px-3 py-1.5 rounded-full text-[#6A7BFF] font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
                      <Icon name="clock" size={12} />
                      <span className="whitespace-nowrap">{med.time}</span>
                    </div>
                  </div>
                </button>
              ))}
              <button onClick={() => navigateTo(ViewState.ADD_MEDICATION)} className="flex flex-col items-center justify-center bg-[#F9FAFF] min-h-[14rem] rounded-[2.5rem] border-2 border-dashed border-[#CED8FF] transition-all hover:bg-[#F1F4FF] group active:scale-95">
                <div className="w-[4.5rem] h-[4.5rem] bg-[#E6EBFF] rounded-full flex items-center justify-center text-[#6A7BFF] mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <Icon name="plus" size={32} />
                </div>
                <span className="font-black text-[#8EA0FF] text-base sm:text-lg uppercase tracking-wider">Add New</span>
              </button>
            </div>
          </section>
        );

      case ViewState.APPOINTMENTS:
        return <Appointments appointments={appointments} onAdd={() => navigateTo(ViewState.ADD_APPOINTMENT)} onReschedule={(appt) => { setSelectedAppointment(appt); navigateTo(ViewState.RESCHEDULE_APPOINTMENT); }} />;
      case ViewState.LIFE_360:
        return <Life360 onBack={handleBack} />;
      case ViewState.ACCOUNT:
        return <Account user={currentUser} onBack={handleBack} onSettings={() => navigateTo(ViewState.SETTINGS)} onLogout={handleLogout} />;
      case ViewState.SETTINGS:
        return <Settings onBack={handleBack} />;
      case ViewState.UPDATE_MEDICATION:
        return selectedMedication ? <MedicationDetail medication={selectedMedication} onSave={(updated) => { setMedications(prev => prev.map(m => m.id === updated.id ? updated : m)); showSuccess('Updated successfully!', ViewState.DASHBOARD); }} onDelete={(id) => { setMedications(prev => prev.filter(m => m.id !== id)); showSuccess('Deleted successfully!', ViewState.DASHBOARD); }} onBack={handleBack} onToggleTaken={handleToggleTaken} /> : null;
      case ViewState.ADD_ACTIVITY:
        return <AddActivity onSave={(a) => { setActivities(prev => [...prev, a]); showSuccess('Activity scheduled!', ViewState.DASHBOARD); }} onCancel={handleBack} />;
      case ViewState.ADD_MEDICATION:
        return <AddMedication onSave={(m) => { setMedications(prev => [...prev, m]); showSuccess('Medication added!', ViewState.DASHBOARD); }} onCancel={handleBack} />;
      case ViewState.ADD_APPOINTMENT:
        return <AddAppointment onSave={(a) => { setAppointments(prev => [...prev, a]); showSuccess('Visit booked!', ViewState.DASHBOARD); }} onCancel={handleBack} />;
      case ViewState.RESCHEDULE_APPOINTMENT:
        return selectedAppointment ? <RescheduleAppointment appointment={selectedAppointment} onSave={(a) => { setAppointments(prev => prev.map(old => old.id === a.id ? a : old)); showSuccess('Visit rescheduled!', ViewState.DASHBOARD); }} onCancel={handleBack} /> : null;
      case ViewState.TODAY_DETAIL: return <TodayDetail activities={activities} medications={sortedMedications} appointments={appointments} onBack={handleBack} onToggleMedication={handleToggleTaken} />;
      case ViewState.GAMES: return <GamesHub onBack={handleBack} />;
      case ViewState.PATIENT_PORTAL: return <PatientPortal onBack={handleBack} />;
      case ViewState.INJURY_LOG: return <InjuryLog onBack={handleBack} />;
      default: return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FAFBFF] overflow-hidden text-stone-900 selection:bg-brand-100">
      {currentUser && (
        <Header 
          view={view} 
          onMenuOpen={() => setShowMobileMenu(true)} 
          onProfileOpen={() => navigateTo(ViewState.ACCOUNT)} 
          onBack={handleBack}
          onTitleClick={() => view === ViewState.DASHBOARD && navigateTo(ViewState.TODAY_DETAIL)}
        />
      )}

      <main 
        ref={mainScrollRef}
        className={`flex-1 overflow-y-auto no-scrollbar relative w-full max-w-md mx-auto overflow-x-hidden ${currentUser ? 'px-6' : ''}`}
      >
        {renderCurrentView()}
      </main>

      {currentUser && (
        <nav className="w-full max-w-md mx-auto bg-white border-t border-slate-100 px-6 pt-3 pb-8 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]" aria-label="Main Navigation">
          <div className="flex justify-between items-center relative gap-2">
            <NavButton active={view === ViewState.DASHBOARD} onClick={() => navigateTo(ViewState.DASHBOARD)} icon="home" label="Home" />
            <NavButton active={view === ViewState.ACTIVITIES} onClick={() => navigateTo(ViewState.ACTIVITIES)} icon="sun" label="Activities" />
            <div className="relative">
              <button 
                onClick={() => setShowAssistant(true)}
                aria-label="Open AI Voice Assistant"
                className="w-18 h-18 -mt-16 bg-brand-950 rounded-full flex items-center justify-center text-white shadow-2xl shadow-brand-200/40 border-4 border-[#FAFBFF] group active:scale-90 transition-all z-20"
              >
                <Icon name="sparkles" size={32} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
            <NavButton active={view === ViewState.MEDICATIONS} onClick={() => navigateTo(ViewState.MEDICATIONS)} icon="pill" label="Meds" />
            <NavButton active={view === ViewState.APPOINTMENTS} onClick={() => navigateTo(ViewState.APPOINTMENTS)} icon="calendar" label="Visits" />
          </div>
        </nav>
      )}

      {showMobileMenu && <MobileMenu isOpen={showMobileMenu} user={currentUser} onClose={() => setShowMobileMenu(false)} onNavigate={navigateTo} currentView={view} onLogout={handleLogout} />}
      {showAssistant && (
        <Assistant 
          contextData={`User: ${currentUser?.firstName}, Role: ${currentUser?.role}, View: ${view}`} 
          onClose={() => setShowAssistant(false)} 
          onNavigate={(v) => navigateTo(v as ViewState)}
        />
      )}
      {successMessage && <SuccessView message={successMessage} />}
    </div>
  );
};

const DashboardCategoryButton: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="aspect-square bg-white rounded-[3rem] flex flex-col items-center justify-center gap-3 shadow-soft border border-slate-100 active:scale-95 transition-all group p-4 transform-gpu"
  >
    <div className="text-brand-600 group-hover:scale-110 transition-transform">
      <Icon name={icon} size={36} />
    </div>
    <span className="text-sm font-bold text-slate-700 tracking-tight leading-none">{label}</span>
  </button>
);

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    aria-current={active ? 'page' : undefined}
    className={`flex flex-col items-center justify-center gap-1.5 flex-1 transition-all group p-2 rounded-2xl ${active ? 'bg-slate-50/50' : ''}`}
  >
    <div className={`transition-all relative ${active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
      <Icon name={icon} size={28} className={active ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
    </div>
    <span className={`text-[11px] font-bold tracking-tight ${active ? 'text-brand-600' : 'text-slate-400'}`}>{label}</span>
  </button>
);

export default App;
