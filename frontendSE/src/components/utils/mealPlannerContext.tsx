import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../api';

export interface PlannedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  date: string; // YYYY-MM-DD format
  recipeUrl?: string;
  image?: string;
  prepTime?: number;
}

interface MealPlannerContextType {
  plannedMeals: PlannedMeal[];
  addPlannedMeal: (meal: Omit<PlannedMeal, 'id'>) => void;
  removePlannedMeal: (id: string) => void;
  getMealsForDate: (date: string) => PlannedMeal[];
  getMealsForWeek: (startDate: string) => PlannedMeal[];
  getMealsForMonth: (year: number, month: number) => PlannedMeal[];
  clearPlannedMeals: () => void;
}

const MealPlannerContext = createContext<MealPlannerContextType | undefined>(undefined);

export const MealPlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [storageKey, setStorageKey] = useState<string | null>(null);

  // resolve per-user key and migrate legacy data
  useEffect(() => {
    let mounted = true;
    async function resolveKey() {
      const token = localStorage.getItem('token');
      let key = 'plannedMeals:anon';
      if (token) {
        try {
          const res = await api.me(token);
          const userObj = res?.user ?? res;
          const id = userObj?._id ?? userObj?.id ?? userObj?.userId;
          if (id) key = `plannedMeals:${id}`;
        } catch (e) {
          // ignore
        }
      }
      if (!mounted) return;
      setStorageKey(key);

      // migrate legacy global key into user-scoped key if present
      try {
        const legacy = localStorage.getItem('plannedMeals');
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

  // load from resolved key
  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try { setPlannedMeals(JSON.parse(stored)); }
      catch { setPlannedMeals([]); }
    } else {
      setPlannedMeals([]);
    }
  }, [storageKey]);

  // persist into resolved key
  useEffect(() => {
    if (!storageKey) return;
    try { localStorage.setItem(storageKey, JSON.stringify(plannedMeals)); }
    catch { /* ignore */ }
  }, [plannedMeals, storageKey]);

  const addPlannedMeal = (meal: Omit<PlannedMeal, 'id'>) => {
    const newMeal: PlannedMeal = {
      ...meal,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setPlannedMeals(prev => [...prev, newMeal]);
  };

  const removePlannedMeal = (id: string) => {
    setPlannedMeals(prev => prev.filter(meal => meal.id !== id));
  };

  const getMealsForDate = (date: string) => {
    return plannedMeals.filter(meal => meal.date === date);
  };

  const getMealsForWeek = (startDate: string) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return plannedMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate <= end;
    });
  };

  const getMealsForMonth = (year: number, month: number) => {
    return plannedMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.getFullYear() === year && mealDate.getMonth() === month;
    });
  };

  const clearPlannedMeals = () => {
    setPlannedMeals([]);
  };

  return (
    <MealPlannerContext.Provider value={{
      plannedMeals,
      addPlannedMeal,
      removePlannedMeal,
      getMealsForDate,
      getMealsForWeek,
      getMealsForMonth,
      clearPlannedMeals,
    }}>
      {children}
    </MealPlannerContext.Provider>
  );
};

export const useMealPlannerContext = () => {
  const context = useContext(MealPlannerContext);
  if (!context) {
    throw new Error('useMealPlannerContext must be used within a MealPlannerProvider');
  }
  return context;
};
