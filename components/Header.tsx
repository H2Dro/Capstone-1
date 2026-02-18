
import React from 'react';
import { Icon } from './Icon';
import { ViewState } from '../types';

interface HeaderProps {
  view: ViewState;
  onMenuOpen: () => void;
  onProfileOpen: () => void;
  onBack?: () => void;
  title?: string;
  onTitleClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ view, onMenuOpen, onProfileOpen, onBack, title, onTitleClick }) => {
  const isHubView = [ViewState.DASHBOARD, ViewState.MEDICATIONS, ViewState.APPOINTMENTS, ViewState.LIFE_360].includes(view);

  const getHeaderTitle = () => {
    if (title) return title;
    switch (view) {
      case ViewState.DASHBOARD: return 'Dashboard';
      case ViewState.MEDICATIONS: return 'Meds';
      case ViewState.APPOINTMENTS: return 'Visits';
      case ViewState.LIFE_360: return 'Family';
      case ViewState.ACTIVITIES: return 'Activities';
      case ViewState.ACCOUNT: return 'My Profile';
      case ViewState.SETTINGS: return 'Settings';
      case ViewState.GAMES: return 'Brain Training';
      case ViewState.PATIENT_PORTAL: return 'MyHealth+';
      case ViewState.INJURY_LOG: return 'Safety Log';
      default: return 'GoodSense';
    }
  };

  const currentDateLabel = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <header className="flex justify-between items-center h-20 px-6 bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-stone-100 shadow-sm shrink-0">
      <div className="flex items-center gap-2.5 w-14">
        {isHubView ? (
          <button 
            onClick={onMenuOpen} 
            className="w-12 h-12 rounded-xl glass-panel shadow-soft flex items-center justify-center group active:scale-95 transition-all"
            aria-label="Open Navigation Menu"
          >
            <Icon name="menu" size={24} className="text-stone-600 group-hover:text-brand-600 transition-colors" />
          </button>
        ) : (
          <button 
            onClick={onBack} 
            className="w-12 h-12 rounded-xl glass-panel shadow-soft flex items-center justify-center text-stone-400 active:scale-95 transition-all"
            aria-label="Go Back"
          >
            <Icon name="back" size={24} />
          </button>
        )}
      </div>
      
      <button 
        onClick={onTitleClick}
        disabled={!onTitleClick}
        className={`text-center flex-1 min-w-0 flex flex-col items-center justify-center active:scale-95 transition-transform ${onTitleClick ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {view === ViewState.DASHBOARD && <h2 className="text-stone-400 font-black uppercase tracking-[0.2em] text-[9px] mb-0.5">{currentDateLabel}</h2>}
        <div className="flex items-center gap-1.5 justify-center">
          {view === ViewState.DASHBOARD && <div className="w-1 h-1 rounded-full bg-brand-500"></div>}
          <h1 className="text-xs font-black text-stone-900 leading-none uppercase tracking-widest truncate">{getHeaderTitle()}</h1>
        </div>
      </button>

      <div className="flex items-center gap-2.5 w-14 justify-end">
        {view !== ViewState.ACCOUNT && (
          <button 
            onClick={onProfileOpen} 
            className="w-12 h-12 rounded-xl glass-panel shadow-soft flex items-center justify-center group active:scale-95 transition-all overflow-hidden"
            aria-label="View My Account"
          >
            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:text-brand-600 border border-indigo-100/30 transition-colors">
              <Icon name="user" size={24} />
            </div>
          </button>
        )}
      </div>
    </header>
  );
};
