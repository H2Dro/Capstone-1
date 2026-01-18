import React from 'react';
import { Icon } from './Icon';

interface SuccessViewProps {
  message: string;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] p-8 flex flex-col items-center shadow-2xl animate-scale-up max-w-xs w-full mx-6 text-center border border-white/50">
        
        {/* Animated Icon Circle */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 relative">
           {/* Pulsing ring */}
           <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20 duration-1000"></div>
           
           {/* Inner circle with pop animation */}
           <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pop">
             <div className="bg-green-500 rounded-full p-4 shadow-lg shadow-green-200">
                <Icon name="check-plain" size={40} className="text-white stroke-[4px]" />
             </div>
           </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Great Job!</h2>
        <p className="text-slate-500 font-medium text-lg leading-tight">{message}</p>
        
        {/* Decorative Confetti Dots (CSS only) */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-100 opacity-80"></div>
        <div className="absolute top-12 right-12 w-3 h-3 bg-brand-400 rounded-full animate-bounce delay-200 opacity-60"></div>
        <div className="absolute bottom-16 left-8 w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-300 opacity-70"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75 opacity-80"></div>
      </div>
    </div>
  );
};