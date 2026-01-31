
import React, { useState } from 'react';
import { Icon } from './Icon';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const lowerUsername = username.toLowerCase();
    const lowerPassword = password.toLowerCase();

    // Artificial delay for realistic feel
    setTimeout(() => {
      if (lowerUsername === 'elanor123' && lowerPassword === 'password123') {
        onLogin({
          username: 'Elanor123',
          firstName: 'Elanor',
          lastName: 'P.',
          role: 'PATIENT'
        });
      } else if (lowerUsername === 'sarah123' && lowerPassword === 'password123') {
        onLogin({
          username: 'sarah123',
          firstName: 'Sarah',
          lastName: 'P.',
          role: 'CAREGIVER'
        });
      } else {
        setError('Incorrect User ID or Password. Please try again.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8 animate-fade-in overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-10">
        
        {/* Logo & Welcome */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-brand-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-brand-100 mb-6">
            <Icon name="shield" size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            GoodSense
          </h1>
          <p className="text-slate-500 font-bold text-lg">
            Your daily companion for a healthy, active life.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              User ID
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors">
                <Icon name="user" size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Elanor123 or sarah123"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors">
                <Icon name="shield" size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-rose-100 animate-pop">
              <Icon name="alert" size={18} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!username || !password || isLoading}
            className="w-full py-5 bg-brand-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-brand-200 active:scale-95 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In
                <Icon name="chevron-right" size={24} />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <button className="text-slate-400 font-bold text-sm hover:text-brand-600 transition-colors">
            Forgot Password?
          </button>
          <div className="mt-8 pt-8 border-t border-slate-100 text-xs text-slate-300 font-bold uppercase tracking-widest">
            Secure Entry System v2.4
          </div>
        </div>
      </div>
    </div>
  );
};
