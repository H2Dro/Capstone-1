import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`${className} flex items-center justify-center overflow-hidden`}>
      <img 
        src="https://ais-dev-2egyc4ufz667bqygwedace-113063421561.us-east1.run.app/logo.png" 
        alt="GoodSense Logo" 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
