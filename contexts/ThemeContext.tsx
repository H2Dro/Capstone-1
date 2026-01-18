
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSize = 'small' | 'medium' | 'large';
export type AccentColor = 'indigo' | 'rose' | 'teal' | 'orange' | 'blue';

interface ThemeContextType {
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
  accentColor: AccentColor;
  setAccentColor: (c: AccentColor) => void;
  boldText: boolean;
  setBoldText: (b: boolean) => void;
  highContrast: boolean;
  setHighContrast: (b: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (b: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const COLOR_PALETTES: Record<AccentColor, Record<number, string>> = {
  indigo: {
    50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 
    400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 
    800: '#3730a3', 900: '#312e81', 950: '#1e1b4b'
  },
  rose: {
    50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 
    400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 
    800: '#9f1239', 900: '#881337', 950: '#4c0519'
  },
  teal: {
    50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 
    400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 
    800: '#115e59', 900: '#134e4a', 950: '#042f2e'
  },
  orange: {
    50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 
    400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 
    800: '#9a3412', 900: '#7c2d12', 950: '#431407'
  },
  blue: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 
    400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 
    800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
  }
};

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
  const [fontSize, setFontSize] = useState<FontSize>(() => 
    (localStorage.getItem('gs-fontSize') as FontSize) || 'medium'
  );
  const [accentColor, setAccentColor] = useState<AccentColor>(() => 
    (localStorage.getItem('gs-accentColor') as AccentColor) || 'indigo'
  );
  const [boldText, setBoldText] = useState(() => 
    localStorage.getItem('gs-boldText') === 'true'
  );
  const [highContrast, setHighContrast] = useState(() => 
    localStorage.getItem('gs-highContrast') === 'true'
  );
  const [reducedMotion, setReducedMotion] = useState(() => 
    localStorage.getItem('gs-reducedMotion') === 'true'
  );

  // Apply Font Size Scaling to Root
  useEffect(() => { 
    localStorage.setItem('gs-fontSize', fontSize);
    document.documentElement.setAttribute('data-size', fontSize);
  }, [fontSize]);

  useEffect(() => { localStorage.setItem('gs-accentColor', accentColor); }, [accentColor]);
  useEffect(() => { localStorage.setItem('gs-boldText', boldText.toString()); }, [boldText]);
  useEffect(() => { localStorage.setItem('gs-highContrast', highContrast.toString()); }, [highContrast]);
  
  // Apply Reduced Motion to Root
  useEffect(() => { 
    localStorage.setItem('gs-reducedMotion', reducedMotion.toString());
    if (reducedMotion) document.documentElement.classList.add('reduce-motion');
    else document.documentElement.classList.remove('reduce-motion');
  }, [reducedMotion]);

  useEffect(() => {
    if (boldText) {
      document.body.classList.add('font-semibold');
      document.documentElement.style.setProperty('--font-weight-normal', '600');
    } else {
      document.body.classList.remove('font-semibold');
      document.documentElement.style.setProperty('--font-weight-normal', '400');
    }
  }, [boldText]);

  useEffect(() => {
    const palette = COLOR_PALETTES[accentColor];
    const root = document.documentElement;
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--brand-${key}`, value as string);
    });
  }, [accentColor]);

  useEffect(() => {
    if (highContrast) document.documentElement.classList.add('high-contrast');
    else document.documentElement.classList.remove('high-contrast');
  }, [highContrast]);

  return (
    <ThemeContext.Provider value={{
      fontSize, setFontSize, accentColor, setAccentColor, boldText, setBoldText, highContrast, setHighContrast, reducedMotion, setReducedMotion
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
