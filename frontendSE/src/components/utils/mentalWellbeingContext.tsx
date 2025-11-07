import React, { createContext, useContext, useState, useEffect } from 'react';

interface MeditationSession {
  id: string;
  sessionId?: number;
  session?: any;
  date: string;
  duration?: number;
  completed?: boolean;
}

interface TherapySession {
  id: string;
  date: string;
  time: string;
  therapist?: string;
  type: string;
  notes?: string;
  completed: boolean;
}

interface MentalWellbeingContextType {
  meditationSessions: MeditationSession[];
  therapySessions: TherapySession[];
  addMeditationSession: (session: any) => void;
  addTherapySession: (session: Omit<TherapySession, 'id'>) => void;
  completeTherapySession: (id: string, notes: string) => void;
  deleteTherapySession: (id: string) => void;
  getMeditationStreak: () => number;
  getTotalMeditationMinutes: () => number;
  getTherapySessionsThisMonth: () => number;
  getMeditationStats: () => { daysStreak: number; totalTime: number; sessions: number; avgSession: string };
}

const MentalWellbeingContext = createContext<MentalWellbeingContextType | undefined>(undefined);

export function MentalWellbeingProvider({ children }: { children: React.ReactNode }) {
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [therapySessions, setTherapySessions] = useState<TherapySession[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMeditation = localStorage.getItem('meditationSessions');
    const savedTherapy = localStorage.getItem('therapySessions');
    
    if (savedMeditation) {
      setMeditationSessions(JSON.parse(savedMeditation));
    }
    if (savedTherapy) {
      setTherapySessions(JSON.parse(savedTherapy));
    }
  }, []);

  // Save to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('meditationSessions', JSON.stringify(meditationSessions));
  }, [meditationSessions]);

  useEffect(() => {
    localStorage.setItem('therapySessions', JSON.stringify(therapySessions));
  }, [therapySessions]);

  const addMeditationSession = (session: any) => {
    const newSession: MeditationSession = {
      id: Date.now().toString(),
      ...session,
    };
    setMeditationSessions((prev) => [...prev, newSession]);
  };

  const addTherapySession = (session: Omit<TherapySession, 'id'>) => {
    const newSession: TherapySession = {
      id: Date.now().toString(),
      ...session,
    };
    setTherapySessions((prev) => [...prev, newSession]);
  };

  const completeTherapySession = (id: string, notes: string) => {
    setTherapySessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, completed: true, notes } : session
      )
    );
  };

  const deleteTherapySession = (id: string) => {
    setTherapySessions((prev) => prev.filter((session) => session.id !== id));
  };

  const getMeditationStreak = () => {
    if (meditationSessions.length === 0) return 0;
    
    const sortedSessions = [...meditationSessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = sessionDate;
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  };

  const getTotalMeditationMinutes = () => {
    return meditationSessions.reduce((total, session) => total + (session.duration || 0), 0);
  };

  const getTherapySessionsThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return therapySessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
    }).length;
  };

  const getMeditationStats = () => {
    const daysStreak = getMeditationStreak();
    const totalTime = getTotalMeditationMinutes();
    const sessions = meditationSessions.length;
    const avgSession = sessions > 0 ? (totalTime / sessions).toFixed(2) : '0.00';
    
    return { daysStreak, totalTime, sessions, avgSession };
  };

  return (
    <MentalWellbeingContext.Provider
      value={{
        meditationSessions,
        therapySessions,
        addMeditationSession,
        addTherapySession,
        completeTherapySession,
        deleteTherapySession,
        getMeditationStreak,
        getTotalMeditationMinutes,
        getTherapySessionsThisMonth,
        getMeditationStats,
      }}
    >
      {children}
    </MentalWellbeingContext.Provider>
  );
}

export function useMentalWellbeing() {
  const context = useContext(MentalWellbeingContext);
  if (!context) {
    throw new Error('useMentalWellbeing must be used within a MentalWellbeingProvider');
  }
  return context;
}