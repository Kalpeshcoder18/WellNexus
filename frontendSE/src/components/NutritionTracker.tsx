import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Scan, Mic, Plus, Coffee, Sun, Sunset, Moon,
  ChefHat, Clock, Flame, Scale, Droplets, Zap, Heart,
  TrendingUp, Calendar, Filter, Star, BookOpen, X, Check,
  ExternalLink, ChevronLeft, ChevronRight, Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip, Legend } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useMealContext } from './utils/mealContext';
import { useMealPlannerContext } from './utils/mealPlannerContext';
import { useWaterIntakeContext } from './utils/waterIntakeContext';
import { calculateAllHealthMetrics } from './utils/healthCalculations';
import { foodDatabase, searchFoods, type FoodItem } from './utils/foodDatabase';
import { recipeDatabase, searchRecipes, type Recipe } from './utils/recipeDatabase';

interface NutritionTrackerProps {
  userProfile: any;
}

const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'from-yellow-400 to-orange-500', time: '7:00 AM' },
  { id: 'lunch', label: 'Lunch', icon: Sun, color: 'from-green-400 to-blue-500', time: '12:30 PM' },
  { id: 'dinner', label: 'Dinner', icon: Sunset, color: 'from-purple-400 to-pink-500', time: '7:00 PM' },
  { id: 'snacks', label: 'Snacks', icon: Moon, color: 'from-indigo-400 to-purple-500', time: 'Anytime' },
];

export default function NutritionTracker({ userProfile }: NutritionTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [showAddFood, setShowAddFood] = useState(false);
  const [customMealName, setCustomMealName] = useState('');
  const [customMealCalories, setCustomMealCalories] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
  const [plannerView, setPlannerView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddToPlannerDialog, setShowAddToPlannerDialog] = useState(false);
  const [plannerDate, setPlannerDate] = useState('');
  const [plannerMealType, setPlannerMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  
  const { addMeal, getMealsForToday, getTotalCalories, getTotalMacros, removeMeal, getAllMeals } = useMealContext();
  const { addPlannedMeal, getMealsForDate, getMealsForWeek, removePlannedMeal } = useMealPlannerContext();
  const { getGlassesToday, addGlass, removeGlass, getWeeklyAverage } = useWaterIntakeContext();

  // Calculate user's calorie target
  const { targetCalories, macros: targetMacros } = calculateAllHealthMetrics(
    userProfile.height,
    userProfile.weight,
    userProfile.age,
    userProfile.gender,
    userProfile.goals || []
  );

  const totalCalories = getTotalCalories();
  const totalMacros = getTotalMacros();
  const calorieProgress = (totalCalories / targetCalories) * 100;
  const todayMeals = getMealsForToday();
  const glassesToday = getGlassesToday();
  const waterGoal = 8;
  const waterProgress = (glassesToday / waterGoal) * 100;

  // Group meals by type
  const groupedMeals = {
    breakfast: todayMeals.filter(m => m.mealType === 'breakfast'),
    lunch: todayMeals.filter(m => m.mealType === 'lunch'),
    dinner: todayMeals.filter(m => m.mealType === 'dinner'),
    snacks: todayMeals.filter(m => m.mealType === 'snacks'),
  };

  // Search results
  const searchResults = searchQuery ? searchFoods(searchQuery) : [];
  const recipeResults = recipeSearchQuery ? searchRecipes(recipeSearchQuery) : recipeDatabase;

  const handleAddFood = (food: FoodItem) => {
    addMeal({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      mealType: selectedMealType,
    });
    setShowAddFood(false);
    setSearchQuery('');
  };

  const handleAddCustomMeal = () => {
    if (!customMealName.trim() || !customMealCalories || parseInt(customMealCalories) <= 0) {
      return;
    }

    const calories = parseInt(customMealCalories);
    const protein = Math.round((calories * 0.3) / 4);
    const carbs = Math.round((calories * 0.4) / 4);
    const fat = Math.round((calories * 0.3) / 9);

    addMeal({
      name: customMealName.trim(),
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      mealType: selectedMealType,
    });

    setCustomMealName('');
    setCustomMealCalories('');
  };

  const handleAddRecipeToPlanner = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setPlannerDate(new Date().toISOString().split('T')[0]);
    setPlannerMealType(recipe.mealType || 'lunch');
    setShowAddToPlannerDialog(true);
  };

  const confirmAddToPlanner = () => {
    if (selectedRecipe && plannerDate) {
      addPlannedMeal({
        name: selectedRecipe.title,
        calories: selectedRecipe.calories,
        protein: selectedRecipe.protein,
        carbs: selectedRecipe.carbs,
        fat: selectedRecipe.fat,
        mealType: plannerMealType,
        date: plannerDate,
        recipeUrl: selectedRecipe.recipeUrl,
        image: selectedRecipe.image,
        prepTime: selectedRecipe.prepTime,
      });
      setShowAddToPlannerDialog(false);
      setSelectedRecipe(null);
    }
  };

  // Calculate macro percentages
  const macroData = [
    { 
      name: 'Carbs', 
      value: totalMacros.carbs, 
      target: targetMacros.carbs.grams, 
      color: '#3B82F6', 
      consumed: totalMacros.carbs, 
      unit: 'g' 
    },
    { 
      name: 'Protein', 
      value: totalMacros.protein, 
      target: targetMacros.protein.grams, 
      color: '#10B981', 
      consumed: totalMacros.protein, 
      unit: 'g' 
    },
    { 
      name: 'Fat', 
      value: totalMacros.fat, 
      target: targetMacros.fat.grams, 
      color: '#F59E0B', 
      consumed: totalMacros.fat, 
      unit: 'g' 
    },
  ];

  // Get week dates for planner
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Analytics data - last 7 days
  const getAnalyticsData = () => {
    const allMeals = getAllMeals();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMeals = allMeals.filter(meal => meal.date === dateStr);
      const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const dayProtein = dayMeals.reduce((sum, meal) => sum + meal.protein, 0);
      const dayCarbs = dayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
      const dayFat = dayMeals.reduce((sum, meal) => sum + meal.fat, 0);
      
      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: dayCalories,
        protein: dayProtein,
        carbs: dayCarbs,
        fat: dayFat,
      });
    }
    
    return data;
  };

  const analyticsData = getAnalyticsData();

  return (
    <div className="p-6 space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracker</h1>
          <p className="text-gray-600">Track your daily nutrition and reach your goals</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddFood(true)}>
          <Plus className="w-4 h-4" />
          Log Meal
        </Button>
      </motion.div>

      {/* Daily Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Daily Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold">{totalCalories}</div>
                <div className="text-sm text-gray-600">of {targetCalories} goal</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">
                  {Math.max(0, targetCalories - totalCalories)} left
                </div>
                <div className="text-sm text-gray-600">to reach goal</div>
              </div>
            </div>
            <Progress value={calorieProgress} className="mb-2" />
            <div className="text-xs text-gray-500 text-center">
              {calorieProgress.toFixed(1)}% of daily goal
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Droplets className="w-4 h-4 text-blue-500" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{glassesToday}/{waterGoal}</div>
            <div className="text-sm text-gray-600 mb-3">glasses today</div>
            <Progress value={waterProgress} className="mb-2" />
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => removeGlass()}
                disabled={glassesToday === 0}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => addGlass()}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Glass
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="w-4 h-4 text-purple-500" />
              Weight Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">-0.5kg</div>
            <div className="text-sm text-gray-600 mb-3">this week</div>
            <div className="text-xs text-green-600 font-medium">On track</div>
            <div className="text-xs text-gray-500">Goal: -2kg/month</div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Macronutrients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Macronutrients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {macroData.map((macro, index) => (
                      <div key={macro.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{macro.name}</span>
                          <div className="text-right">
                            <span className="font-semibold">{macro.consumed}{macro.unit}</span>
                            <span className="text-gray-500 text-sm ml-1">
                              /{Math.round(macro.target)}{macro.unit}
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={(macro.consumed / macro.target) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <div className="w-48 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={macroData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {macroData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meal Logging */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-blue-500" />
                  Today's Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mealTypes.map((meal) => {
                    const MealIcon = meal.icon;
                    const mealItems = groupedMeals[meal.id as keyof typeof groupedMeals];
                    const mealCalories = mealItems.reduce((sum, item) => sum + item.calories, 0);

                    return (
                      <div key={meal.id} className="border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${meal.color} flex items-center justify-center`}>
                              <MealIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold">{meal.label}</div>
                              <div className="text-xs text-gray-500">{meal.time}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{mealCalories} cal</div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedMealType(meal.id as any);
                                setShowAddFood(true);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {mealItems.map((item) => (
                            <div 
                              key={item.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-gray-500">
                                  P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-sm">{item.calories} cal</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMeal(item.id)}
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          {mealItems.length === 0 && (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              No items logged for {meal.label.toLowerCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Calories Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Total Calories Logged Today</div>
                  <div className="text-5xl font-bold text-blue-600 mb-2">{totalCalories}</div>
                  <div className="text-sm text-gray-500">kcal / {targetCalories} kcal goal</div>
                  <div className="mt-4 p-3 bg-white/60 rounded-lg">
                    <p className="text-xs text-gray-600">
                      ✓ This value auto-updates in the main dashboard summary
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="planner" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Meal Planner
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={plannerView === 'day' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPlannerView('day')}
                    >
                      Day
                    </Button>
                    <Button
                      variant={plannerView === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPlannerView('week')}
                    >
                      Week
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {plannerView === 'week' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() - 7);
                          setSelectedDate(newDate);
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="font-medium">
                        {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() + 7);
                          setSelectedDate(newDate);
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                      {weekDates.map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const dayMeals = getMealsForDate(dateStr);
                        const isToday = dateStr === new Date().toISOString().split('T')[0];
                        
                        return (
                          <div
                            key={index}
                            className={`border rounded-lg p-2 ${isToday ? 'border-blue-500 bg-blue-50' : ''}`}
                          >
                            <div className="text-center mb-2">
                              <div className="text-xs text-gray-500">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className="font-semibold">
                                {date.getDate()}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              {['breakfast', 'lunch', 'dinner', 'snacks'].map(type => {
                                const typeMeals = dayMeals.filter(m => m.mealType === type);
                                const totalCals = typeMeals.reduce((sum, m) => sum + m.calories, 0);
                                
                                return typeMeals.length > 0 ? (
                                  <div key={type} className="text-xs bg-white p-1 rounded">
                                    <div className="font-medium truncate">{typeMeals[0].name}</div>
                                    <div className="text-gray-500">{totalCals} cal</div>
                                  </div>
                                ) : null;
                              })}
                              
                              {dayMeals.length === 0 && (
                                <div className="text-xs text-gray-400 text-center py-2">
                                  No meals
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        💡 <strong>Tip:</strong> Browse the Recipes tab to add meals to your planner!
                      </p>
                    </div>
                  </div>
                )}

                {plannerView === 'day' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() - 1);
                          setSelectedDate(newDate);
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="font-medium">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() + 1);
                          setSelectedDate(newDate);
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {mealTypes.map((meal) => {
                        const MealIcon = meal.icon;
                        const dateStr = selectedDate.toISOString().split('T')[0];
                        const plannedMeals = getMealsForDate(dateStr).filter(m => m.mealType === meal.id);
                        
                        return (
                          <div key={meal.id} className="border rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${meal.color} flex items-center justify-center`}>
                                <MealIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="font-semibold">{meal.label}</div>
                            </div>
                            
                            {plannedMeals.length > 0 ? (
                              <div className="space-y-2">
                                {plannedMeals.map(plannedMeal => (
                                  <div key={plannedMeal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      {plannedMeal.image && (
                                        <ImageWithFallback
                                          src={plannedMeal.image}
                                          alt={plannedMeal.name}
                                          className="w-12 h-12 rounded object-cover"
                                        />
                                      )}
                                      <div>
                                        <div className="font-medium text-sm">{plannedMeal.name}</div>
                                        <div className="text-xs text-gray-500">{plannedMeal.calories} cal</div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removePlannedMeal(plannedMeal.id)}
                                    >
                                      <X className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-400 text-sm">
                                No planned meals
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recommended Recipes</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Search recipes..."
                  value={recipeSearchQuery}
                  onChange={(e) => setRecipeSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipeResults.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1.5">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-white/90 text-gray-900">{recipe.difficulty}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{recipe.title}</h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {recipe.calories} cal
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {recipe.rating}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {recipe.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedRecipe(recipe);
                          setShowRecipeDialog(true);
                        }}
                      >
                        <BookOpen className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddRecipeToPlanner(recipe)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add to Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Nutrition Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="calories" stroke="#F97316" strokeWidth={2} name="Calories" />
                      <Line type="monotone" dataKey="protein" stroke="#10B981" strokeWidth={2} name="Protein (g)" />
                      <Line type="monotone" dataKey="carbs" stroke="#3B82F6" strokeWidth={2} name="Carbs (g)" />
                      <Line type="monotone" dataKey="fat" stroke="#F59E0B" strokeWidth={2} name="Fat (g)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Averages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Calories</span>
                    <span className="font-semibold">
                      {analyticsData.length > 0 
                        ? Math.round(analyticsData.reduce((sum, d) => sum + d.calories, 0) / analyticsData.length)
                        : 0} kcal
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Protein</span>
                    <span className="font-semibold">
                      {analyticsData.length > 0 
                        ? Math.round(analyticsData.reduce((sum, d) => sum + d.protein, 0) / analyticsData.length)
                        : 0}g
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Water</span>
                    <span className="font-semibold">{getWeeklyAverage()} glasses/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Goal Adherence</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">85%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Macro Distribution (7-day avg)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Carbs', value: analyticsData.reduce((sum, d) => sum + d.carbs, 0), color: '#3B82F6' },
                          { name: 'Protein', value: analyticsData.reduce((sum, d) => sum + d.protein, 0), color: '#10B981' },
                          { name: 'Fat', value: analyticsData.reduce((sum, d) => sum + d.fat, 0), color: '#F59E0B' },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Add Food Dialog */}
      <Dialog open={showAddFood} onOpenChange={setShowAddFood}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Food to {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}</DialogTitle>
            <DialogDescription>Search for foods or add a custom meal to track your nutrition.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchQuery && searchResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <h3 className="font-medium text-sm text-gray-600">Search Results</h3>
                {searchResults.map((food) => (
                  <div
                    key={food.name}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddFood(food)}
                  >
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-gray-500">
                        {food.calories} cal | P: {food.protein}g C: {food.carbs}g F: {food.fat}g
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Or add custom meal</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Meal name"
                  value={customMealName}
                  onChange={(e) => setCustomMealName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Calories"
                  value={customMealCalories}
                  onChange={(e) => setCustomMealCalories(e.target.value)}
                />
                <Button onClick={handleAddCustomMeal} className="w-full">
                  <Check className="w-4 h-4 mr-2" />
                  Add Custom Meal
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recipe Details Dialog */}
      <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRecipe?.title}</DialogTitle>
            <DialogDescription>View recipe details and nutrition information.</DialogDescription>
          </DialogHeader>
          {selectedRecipe && (
            <div className="space-y-4">
              <ImageWithFallback
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-gray-600">{selectedRecipe.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Calories</div>
                  <div className="font-semibold">{selectedRecipe.calories} kcal</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Prep Time</div>
                  <div className="font-semibold">{selectedRecipe.prepTime} min</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Protein</div>
                  <div className="font-semibold">{selectedRecipe.protein}g</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Carbs</div>
                  <div className="font-semibold">{selectedRecipe.carbs}g</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(selectedRecipe.recipeUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Recipe
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowRecipeDialog(false);
                    handleAddRecipeToPlanner(selectedRecipe);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Meal Plan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add to Planner Dialog */}
      <Dialog open={showAddToPlannerDialog} onOpenChange={setShowAddToPlannerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Meal Planner</DialogTitle>
            <DialogDescription>Select a date and meal type to add this recipe to your meal plan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <Input
                type="date"
                value={plannerDate}
                onChange={(e) => setPlannerDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Meal Type</label>
              <Select value={plannerMealType} onValueChange={(value: any) => setPlannerMealType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snacks">Snacks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={confirmAddToPlanner} className="w-full">
              <Check className="w-4 h-4 mr-2" />
              Add to Planner
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
