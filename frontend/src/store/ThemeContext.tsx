import React, { createContext, useState, useEffect, useContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'contrast';
export type FontSizeMode = 'sm' | 'base' | 'lg';

interface ThemeContextType {
  theme: ThemeMode;
  fontSize: FontSizeMode;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (size: FontSizeMode) => void;
  keyboardNavActive: boolean;
  setKeyboardNavActive: (active: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeMode) || 'light'; // Default is Light Mode!
  });

  const [fontSize, setFontSizeState] = useState<FontSizeMode>(() => {
    const saved = localStorage.getItem('fontSize');
    return (saved as FontSizeMode) || 'base';
  });

  const [keyboardNavActive, setKeyboardNavActive] = useState<boolean>(false);

  useEffect(() => {
    // Apply theme classes to root HTML element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'contrast');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'contrast') {
      root.classList.add('contrast');
    } else {
      root.classList.add('light');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply font size classes to root HTML element
    const root = window.document.documentElement;
    root.classList.remove('text-size-sm', 'text-size-base', 'text-size-lg');
    root.classList.add(`text-size-${fontSize}`);
    
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Monitor keyboard focus usage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardNavActive(true);
        document.body.classList.add('keyboard-navigation');
      }
    };
    const handleMouseDown = () => {
      setKeyboardNavActive(false);
      document.body.classList.remove('keyboard-navigation');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const setTheme = (mode: ThemeMode) => setThemeState(mode);
  const setFontSize = (size: FontSizeMode) => setFontSizeState(size);

  const value = {
    theme,
    fontSize,
    setTheme,
    setFontSize,
    keyboardNavActive,
    setKeyboardNavActive
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
