import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../../api';

export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  timestamp: number;
  date: string; // YYYY-MM-DD format
}

interface MealContextType {
  loggedMeals: LoggedMeal[];
  addMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp' | 'date'>) => void;
  removeMeal: (id: string) => void;
  getTotalCalories: () => number;
  getTotalMacros: () => { protein: number; carbs: number; fat: number };
  getMealsForToday: () => LoggedMeal[];
  getAllMeals: () => LoggedMeal[];
  clearMeals: () => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export function MealProvider({ children }: { children: React.ReactNode }) {
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const storageKeyRef = useRef<string>('loggedMeals:anon');

  // On mount determine storage key (scoped to current user) and load persisted meals
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        let key = 'loggedMeals:anon';

        if (token) {
          const res = await api.me(token).catch(() => null);
          const userId = res?.user?._id || res?.user?.id || null;
          if (userId) key = `loggedMeals:${userId}`;
          else key = `loggedMeals:token:${token}`;
        }

        storageKeyRef.current = key;

        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (mounted) setLoggedMeals(parsed);
              return;
            } catch (e) {
              // ignore
            }
          }

          // fallback: migrate legacy global key
          const legacy = localStorage.getItem('loggedMeals');
          if (legacy) {
            try {
              const parsed = JSON.parse(legacy);
              localStorage.setItem(key, JSON.stringify(parsed));
              if (mounted) setLoggedMeals(parsed);
              return;
            } catch (e) {
              // ignore
            }
          }
        }

        if (mounted) setLoggedMeals([]);
      } catch (err) {
        console.error('Failed to initialize MealProvider:', err);
        if (mounted) setLoggedMeals([]);
      }
    }

    init();
    return () => { mounted = false; };
  }, []);

  // Persist per-user meals
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const key = storageKeyRef.current || 'loggedMeals:anon';
      localStorage.setItem(key, JSON.stringify(loggedMeals));
    } catch (err) {
      console.error('Failed to persist loggedMeals:', err);
    }
  }, [loggedMeals]);

  const addMeal = async (meal: Omit<LoggedMeal, 'id' | 'timestamp' | 'date'>) => {
    const now = Date.now();
    const date = new Date(now).toISOString().split('T')[0]; // YYYY-MM-DD
    const localId = now.toString() + Math.random().toString(36).substr(2, 9);
    const newMeal: LoggedMeal & { serverId?: string } = {
      ...meal,
      id: localId,
      timestamp: now,
      date: date,
    } as any;

    // Optimistically add to local state for instant UI update
    setLoggedMeals((prev) => [...prev, newMeal]);

    // If user is authenticated, try to persist to backend and attach server id
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        const payload = {
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          mealType: meal.mealType,
          timestamp: now,
          date,
        };

        const res = await api.addMeal(payload, token);
        // if backend returned created meal _id, attach it to local item
        if (res && res._id) {
          setLoggedMeals((prev) => prev.map(m => (m.id === localId ? { ...m, serverId: res._id } : m)));
        }

        // notify other parts of app (Dashboard) that backend data changed
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('meals:updated', { detail: { date } }));
        }
      }
    } catch (err) {
      console.error('Failed to persist meal to backend:', err);
    }
  };

  const removeMeal = async (id: string) => {
    const meal = loggedMeals.find(m => m.id === id);
    // Optimistically remove locally
    setLoggedMeals((prev) => prev.filter((meal) => meal.id !== id));

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const serverId = (meal as any)?.serverId;
      if (token && serverId) {
        await api.deleteMeal(serverId, token).catch(() => null);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('meals:updated', { detail: { date: meal?.date } }));
        }
      }
    } catch (err) {
      console.error('Failed to delete meal on backend:', err);
    }
  };

  const getMealsForToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    return loggedMeals.filter((meal) => meal.timestamp >= todayTimestamp);
  };

  const getTotalCalories = () => {
    const todayMeals = getMealsForToday();
    return todayMeals.reduce((total, meal) => total + meal.calories, 0);
  };

  const getTotalMacros = () => {
    const todayMeals = getMealsForToday();
    return todayMeals.reduce(
      (totals, meal) => ({
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  };

  const getAllMeals = () => {
    return loggedMeals;
  };

  const clearMeals = () => {
    setLoggedMeals([]);
  };

  return (
    <MealContext.Provider
      value={{
        loggedMeals,
        addMeal,
        removeMeal,
        getTotalCalories,
        getTotalMacros,
        getMealsForToday,
        getAllMeals,
        clearMeals,
      }}
    >
      {children}
    </MealContext.Provider>
  );
}

export function useMealContext() {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error('useMealContext must be used within a MealProvider');
  }
  return context;
}
