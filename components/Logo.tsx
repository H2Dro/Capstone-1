import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Circle/Shape */}
        <rect width="100" height="100" rx="28" fill="url(#logo-gradient)" />
        
        {/* Stylized 'G' / Heart Shape */}
        <path 
          d="M50 75C65 65 75 52 75 38C75 28 67 20 57 20C51 20 46 23 43 28C40 23 35 20 29 20C19 20 11 28 11 38C11 52 21 65 36 75L50 85L64 75" 
          stroke="white" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="opacity-20"
        />
        
        <path 
          d="M72 45C72 35 65 28 57 28C52 28 48 31 45 35C42 31 38 28 33 28C25 28 18 35 18 45C18 58 35 72 45 80C55 72 72 58 72 45Z" 
          fill="white" 
        />
        
        {/* Inner Detail for 'G' feel */}
        <path 
          d="M45 55H60V45" 
          stroke="#4F46E5" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5D5FEF" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
