import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WaterEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  glasses: number;
  timestamp: number;
}

interface WaterIntakeContextType {
  waterEntries: WaterEntry[];
  addGlass: (date?: string) => void;
  removeGlass: (date?: string) => void;
  setGlasses: (glasses: number, date?: string) => void;
  getGlassesForDate: (date: string) => number;
  getGlassesToday: () => number;
  getWeeklyAverage: () => number;
}

const WaterIntakeContext = createContext<WaterIntakeContextType | undefined>(undefined);

export const WaterIntakeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>(() => {
    const stored = localStorage.getItem('waterEntries');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('waterEntries', JSON.stringify(waterEntries));
  }, [waterEntries]);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const addGlass = (date?: string) => {
    const targetDate = date || getTodayDate();
    const existingEntry = waterEntries.find(entry => entry.date === targetDate);
    
    if (existingEntry) {
      setWaterEntries(prev => 
        prev.map(entry => 
          entry.date === targetDate 
            ? { ...entry, glasses: entry.glasses + 1, timestamp: Date.now() }
            : entry
        )
      );
    } else {
      const newEntry: WaterEntry = {
        id: Date.now().toString(),
        date: targetDate,
        glasses: 1,
        timestamp: Date.now(),
      };
      setWaterEntries(prev => [...prev, newEntry]);
    }
  };

  const removeGlass = (date?: string) => {
    const targetDate = date || getTodayDate();
    setWaterEntries(prev => 
      prev.map(entry => 
        entry.date === targetDate && entry.glasses > 0
          ? { ...entry, glasses: entry.glasses - 1, timestamp: Date.now() }
          : entry
      )
    );
  };

  const setGlasses = (glasses: number, date?: string) => {
    const targetDate = date || getTodayDate();
    const existingEntry = waterEntries.find(entry => entry.date === targetDate);
    
    if (existingEntry) {
      setWaterEntries(prev => 
        prev.map(entry => 
          entry.date === targetDate 
            ? { ...entry, glasses, timestamp: Date.now() }
            : entry
        )
      );
    } else {
      const newEntry: WaterEntry = {
        id: Date.now().toString(),
        date: targetDate,
        glasses,
        timestamp: Date.now(),
      };
      setWaterEntries(prev => [...prev, newEntry]);
    }
  };

  const getGlassesForDate = (date: string): number => {
    const entry = waterEntries.find(entry => entry.date === date);
    return entry ? entry.glasses : 0;
  };

  const getGlassesToday = (): number => {
    return getGlassesForDate(getTodayDate());
  };

  const getWeeklyAverage = (): number => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    
    const weekEntries = waterEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekAgo && entryDate <= today;
    });
    
    if (weekEntries.length === 0) return 0;
    
    const totalGlasses = weekEntries.reduce((sum, entry) => sum + entry.glasses, 0);
    return parseFloat((totalGlasses / 7).toFixed(1));
  };

  return (
    <WaterIntakeContext.Provider value={{
      waterEntries,
      addGlass,
      removeGlass,
      setGlasses,
      getGlassesForDate,
      getGlassesToday,
      getWeeklyAverage,
    }}>
      {children}
    </WaterIntakeContext.Provider>
  );
};

export const useWaterIntakeContext = () => {
  const context = useContext(WaterIntakeContext);
  if (!context) {
    throw new Error('useWaterIntakeContext must be used within a WaterIntakeProvider');
  }
  return context;
};
