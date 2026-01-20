
import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { ViewState, User } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  onLogout: () => void;
  user: User | null;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate, currentView, onLogout, user }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { fontSize } = useTheme();

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleLinkClick = (view: ViewState) => {
    onNavigate(view);
    onClose();
  };

  const isCaregiver = user.role === 'CAREGIVER';

  // Role-specific menu items
  const menuItems = isCaregiver ? [
    { id: ViewState.DASHBOARD, label: 'Safety Hub', icon: 'shield' },
    { id: ViewState.TODAY_DETAIL, label: "Elanor's Timeline", icon: 'clock' },
    { id: ViewState.ACTIVITIES, label: 'Activities', icon: 'sun' },
    { id: ViewState.MEDICATIONS, label: 'Medications', icon: 'pill' },
    { id: ViewState.APPOINTMENTS, label: 'Medical Visits', icon: 'calendar' },
    { id: ViewState.LIFE_360, label: 'Family Locator', icon: 'map' },
    { id: ViewState.INJURY_LOG, label: 'Safety & Injury Log', icon: 'alert' },
    { id: ViewState.PATIENT_PORTAL, label: 'Health Records', icon: 'globe' },
  ] : [
    { id: ViewState.DASHBOARD, label: 'My Home', icon: 'home' },
    { id: ViewState.TODAY_DETAIL, label: 'Daily Schedule', icon: 'clock' },
    { id: ViewState.ACTIVITIES, label: 'Activities', icon: 'sun' },
    { id: ViewState.MEDICATIONS, label: 'Medication', icon: 'pill' },
    { id: ViewState.APPOINTMENTS, label: 'Appointments', icon: 'calendar' },
    { id: ViewState.LIFE_360, label: 'Life 360', icon: 'map' },
    { id: ViewState.GAMES, label: 'Brain Games', icon: 'gamepad' },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-out ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Slide Drawer */}
      <div 
        className={`relative w-[75%] max-w-sm bg-[#1A163C] h-full shadow-2xl flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform ${isAnimating ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Menu Header: Profile & Close */}
        <div className="px-6 pt-12 pb-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full ${isCaregiver ? 'bg-teal-600/20 border-teal-500 ring-teal-500/20' : 'bg-brand-600/20 border-brand-500 ring-brand-500/20'} border-2 flex items-center justify-center text-white ring-2`}>
               <Icon name="user" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-none">{user.firstName} {user.lastName[0]}.</h2>
              <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">{isCaregiver ? 'Caregiver Mode' : 'Patient Access'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close Menu"
            className="p-2 text-slate-300 hover:text-white transition-colors"
          >
            <Icon name="close" size={28} />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`w-full flex items-center gap-6 p-5 rounded-2xl transition-all active:scale-[0.98] text-left group ${
                currentView === item.id 
                ? 'bg-white/10 text-white' 
                : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className={`transition-all duration-300 ${currentView === item.id ? (isCaregiver ? 'text-teal-400' : 'text-brand-400') + ' scale-110' : 'text-slate-400 group-hover:text-slate-200'}`}>
                <Icon name={item.icon} size={28} />
              </div>
              <span className="text-xl font-bold">
                {item.label}
              </span>
            </button>
          ))}

          <div className="h-px bg-slate-700/50 my-6 mx-2"></div>

          <button
            onClick={() => handleLinkClick(ViewState.ACCOUNT)}
            className={`w-full flex items-center gap-6 p-5 rounded-2xl transition-all active:scale-[0.98] text-left group ${
              currentView === ViewState.ACCOUNT 
              ? 'bg-white/10 text-white' 
              : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className={`transition-all duration-300 ${currentView === ViewState.ACCOUNT ? (isCaregiver ? 'text-teal-400' : 'text-brand-400') : 'text-slate-400 group-hover:text-slate-200'}`}>
              <Icon name="user" size={28} />
            </div>
            <span className="text-xl font-bold">My Profile</span>
          </button>

          <button
            onClick={() => handleLinkClick(ViewState.SETTINGS)}
            className={`w-full flex items-center gap-6 p-5 rounded-2xl transition-all active:scale-[0.98] text-left group ${
              currentView === ViewState.SETTINGS 
              ? 'bg-white/10 text-white' 
              : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className={`transition-all duration-300 ${currentView === ViewState.SETTINGS ? (isCaregiver ? 'text-teal-400' : 'text-brand-400') : 'text-slate-400 group-hover:text-slate-200'}`}>
              <Icon name="settings" size={28} />
            </div>
            <span className="text-xl font-bold">Settings</span>
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-6 shrink-0 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-6 p-5 rounded-2xl text-[#FF8597] hover:bg-rose-500/10 active:scale-95 transition-all group"
          >
            <Icon name="log-out" size={28} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-xl font-bold">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
