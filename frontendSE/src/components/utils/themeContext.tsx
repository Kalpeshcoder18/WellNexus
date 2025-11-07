import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('wellnesshub-theme');
    return (stored as Theme) || 'light';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('wellnesshub-theme', theme);

    // Calculate actual theme
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActualTheme(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) => {
        setActualTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setActualTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (actualTheme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--gradient-from', '#1e293b');
      root.style.setProperty('--gradient-via', '#334155');
      root.style.setProperty('--gradient-to', '#0f172a');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--gradient-from', '#dbeafe');
      root.style.setProperty('--gradient-via', '#ffffff');
      root.style.setProperty('--gradient-to', '#d1fae5');
    }
  }, [actualTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
