import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../api';

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  weather?: string;
  stressLevel: number;
  energyLevel: number;
  notes?: string;
  timestamp: number;
}

interface MoodContextType {
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  getAverageMood: () => number;
  getRecentEntries: (days: number) => MoodEntry[];
  getMoodTrends: () => { day: string; mood: number; stress: number; energy: number }[];
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [storageKey, setStorageKey] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function resolveKey() {
      const token = localStorage.getItem('token');
      let key = 'moodEntries:anon';
      if (token) {
        try {
          const res = await api.me(token);
          const userObj = res?.user ?? res;
          const id = userObj?._id ?? userObj?.id ?? userObj?.userId;
          if (id) key = `moodEntries:${id}`;
        } catch (e) {
          // ignore
        }
      }
      if (!mounted) return;
      setStorageKey(key);

      // migrate legacy global key into user-scoped key if present
      try {
        const legacy = localStorage.getItem('moodEntries');
        if (legacy) {
          const existing = localStorage.getItem(key);
          if (!existing) localStorage.setItem(key, legacy);
        }
      } catch (e) {
        // noop
      }
    }
    resolveKey();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try { setMoodEntries(JSON.parse(stored)); }
      catch { setMoodEntries([]); }
    } else {
      setMoodEntries([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    try { localStorage.setItem(storageKey, JSON.stringify(moodEntries)); }
    catch { /* ignore */ }
  }, [moodEntries, storageKey]);

  const addMoodEntry = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setMoodEntries(prev => [newEntry, ...prev]);
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return parseFloat((sum / moodEntries.length).toFixed(1));
  };

  const getRecentEntries = (days: number) => {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    return moodEntries.filter(entry => entry.timestamp >= cutoffTime);
  };

  const getMoodTrends = () => {
    const last7Days = getRecentEntries(7);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();
      
      const dayEntries = last7Days.filter(entry => {
        const entryDate = new Date(entry.timestamp).toDateString();
        return entryDate === dayStr;
      });
      
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length 
        : 0;
      const avgStress = dayEntries.length > 0 
        ? dayEntries.reduce((sum, e) => sum + e.stressLevel, 0) / dayEntries.length 
        : 0;
      const avgEnergy = dayEntries.length > 0 
        ? dayEntries.reduce((sum, e) => sum + e.energyLevel, 0) / dayEntries.length 
        : 0;
      
      trends.push({
        day: daysOfWeek[date.getDay()],
        mood: parseFloat(avgMood.toFixed(1)),
        stress: parseFloat(avgStress.toFixed(1)),
        energy: parseFloat(avgEnergy.toFixed(1)),
      });
    }
    
    return trends;
  };

  return (
    <MoodContext.Provider value={{
      moodEntries,
      addMoodEntry,
      getAverageMood,
      getRecentEntries,
      getMoodTrends,
    }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMoodContext = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMoodContext must be used within a MoodProvider');
  }
  return context;
};
