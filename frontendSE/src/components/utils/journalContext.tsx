import React, { createContext, useContext, useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  prompt?: string;
  timestamp: number;
}

interface JournalContextType {
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  getRecentEntries: (count: number) => JournalEntry[];
  getTotalEntries: () => number;
  getStreak: () => number;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const stored = localStorage.getItem('journalEntries');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const getRecentEntries = (count: number) => {
    return journalEntries.slice(0, count);
  };

  const getTotalEntries = () => {
    return journalEntries.length;
  };

  const getStreak = () => {
    if (journalEntries.length === 0) return 0;
    
    const sortedEntries = [...journalEntries].sort((a, b) => b.timestamp - a.timestamp);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  };

  return (
    <JournalContext.Provider value={{
      journalEntries,
      addJournalEntry,
      getRecentEntries,
      getTotalEntries,
      getStreak,
    }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournalContext = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournalContext must be used within a JournalProvider');
  }
  return context;
};
