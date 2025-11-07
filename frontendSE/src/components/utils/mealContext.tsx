import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(() => {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('loggedMeals');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  // Save to localStorage whenever meals change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('loggedMeals', JSON.stringify(loggedMeals));
    }
  }, [loggedMeals]);

  const addMeal = (meal: Omit<LoggedMeal, 'id' | 'timestamp' | 'date'>) => {
    const now = Date.now();
    const date = new Date(now).toISOString().split('T')[0]; // YYYY-MM-DD
    const newMeal: LoggedMeal = {
      ...meal,
      id: now.toString() + Math.random().toString(36).substr(2, 9),
      timestamp: now,
      date: date,
    };
    setLoggedMeals((prev) => [...prev, newMeal]);
  };

  const removeMeal = (id: string) => {
    setLoggedMeals((prev) => prev.filter((meal) => meal.id !== id));
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
