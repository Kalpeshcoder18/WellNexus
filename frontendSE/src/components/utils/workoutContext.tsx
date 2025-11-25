import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../../api';

interface Workout {
  id: number;
  title: string;
  instructor: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  category: string;
  thumbnail: string;
  equipment: string;
  calories: number;
  videoUrl: string;
}

interface ScheduledWorkout {
  id: string;
  workoutId: number;
  date: string;
  time: string;
  completed: boolean;
  caloriesBurned?: number;
  actualDuration?: number;
}

interface WorkoutProgress {
  date: string;
  workouts: number;
  duration: number;
  calories: number;
}

interface WorkoutContextType {
  scheduledWorkouts: ScheduledWorkout[];
  addScheduledWorkout: (workout: Omit<ScheduledWorkout, 'id'>) => void;
  completeWorkout: (id: string, caloriesBurned: number, actualDuration: number) => void;
  deleteScheduledWorkout: (id: string) => void;
  getWeeklyProgress: () => WorkoutProgress[];
  getTotalStats: () => { totalWorkouts: number; totalDuration: number; totalCalories: number };
  getScheduledWorkoutsForToday: () => ScheduledWorkout[];
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const [storageKey, setStorageKey] = useState<string | null>(null);

  // Resolve per-user storage key (tries token -> api.me), migrate legacy key
  useEffect(() => {
    let mounted = true;

    async function resolveKey() {
      const token = localStorage.getItem('token');
      let key = 'scheduledWorkouts:anon';

      if (token) {
        try {
          const res = await api.me(token);
          const userObj = res?.user ?? res;
          const id = userObj?._id ?? userObj?.id ?? userObj?.userId;
          if (id) key = `scheduledWorkouts:${id}`;
        } catch (err) {
          // ignore and fallback to anon
        }
      }

      if (!mounted) return;
      setStorageKey(key);

      // migrate legacy global key into user-scoped key if present
      try {
        const legacy = localStorage.getItem('scheduledWorkouts');
        if (legacy) {
          const existing = localStorage.getItem(key);
          if (!existing) {
            localStorage.setItem(key, legacy);
          }
        }
      } catch (e) {
        // noop
      }
    }

    resolveKey();
    return () => {
      mounted = false;
    };
  }, []);

  // Load data from the resolved storage key
  useEffect(() => {
    if (!storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setScheduledWorkouts(JSON.parse(saved));
      } catch (e) {
        setScheduledWorkouts([]);
      }
    } else {
      setScheduledWorkouts([]);
    }
  }, [storageKey]);

  // Persist into the resolved storage key whenever data changes
  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(scheduledWorkouts));
    } catch (e) {
      // ignore quota errors
    }
  }, [scheduledWorkouts, storageKey]);

  const addScheduledWorkout = (workout: Omit<ScheduledWorkout, 'id'>) => {
    const newWorkout: ScheduledWorkout = {
      ...workout,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setScheduledWorkouts(prev => [...prev, newWorkout]);
  };

  const completeWorkout = (id: string, caloriesBurned: number, actualDuration: number) => {
    setScheduledWorkouts(prev =>
      prev.map(workout =>
        workout.id === id
          ? { ...workout, completed: true, caloriesBurned, actualDuration }
          : workout
      )
    );
  };

  const deleteScheduledWorkout = (id: string) => {
    setScheduledWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  const getWeeklyProgress = (): WorkoutProgress[] => {
    const today = new Date();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const progress: WorkoutProgress[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayWorkouts = scheduledWorkouts.filter(
        w => w.completed && w.date === dateStr
      );

      progress.push({
        date: weekDays[date.getDay()],
        workouts: dayWorkouts.length,
        duration: dayWorkouts.reduce((sum, w) => sum + (w.actualDuration || 0), 0),
        calories: dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
      });
    }

    return progress;
  };

  const getTotalStats = () => {
    const completedWorkouts = scheduledWorkouts.filter(w => w.completed);
    return {
      totalWorkouts: completedWorkouts.length,
      totalDuration: completedWorkouts.reduce((sum, w) => sum + (w.actualDuration || 0), 0),
      totalCalories: completedWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
    };
  };

  const getScheduledWorkoutsForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return scheduledWorkouts.filter(w => w.date === today);
  };

  return (
    <WorkoutContext.Provider
      value={{
        scheduledWorkouts,
        addScheduledWorkout,
        completeWorkout,
        deleteScheduledWorkout,
        getWeeklyProgress,
        getTotalStats,
        getScheduledWorkoutsForToday,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
