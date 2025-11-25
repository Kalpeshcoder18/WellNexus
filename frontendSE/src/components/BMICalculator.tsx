import React from 'react';
import { motion } from 'motion/react';
import { Activity, TrendingUp, Apple, Utensils, Coffee, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { calculateAllHealthMetrics } from './utils/healthCalculations';
import { foodDatabase } from './utils/foodDatabase';
import { updateProfile } from "../api/index";
interface BMICalculatorProps {
  profile: {
    age: string;
    gender: string;
    height: number;
    weight: number;
    goals: string[];
  };
}

export default function BMICalculator({ profile }: BMICalculatorProps) {
  const height = parseInt(profile.height);
  const weight = parseInt(profile.weight);
  const age = parseInt(profile.age);

  // Calculate all health metrics using shared utility
  const { bmi, bmr, tdee, targetCalories, bmiCategory: bmiInfo, macros } = calculateAllHealthMetrics(
    height,
    weight,
    age,
    profile.gender,
    profile.goals || []
  );

  // Check if user has goals that require meal plans
  const shouldShowMealPlan = profile.goals.some(goal => 
    ['muscle-gain', 'overall-fitness', 'weight-loss'].includes(goal)
  );

  // Generate meal plan
  const generateMealPlan = () => {
    // Distribute calories: breakfast 25%, lunch 35%, dinner 30%, snacks 10%
    const breakfastTarget = targetCalories * 0.25;
    const lunchTarget = targetCalories * 0.35;
    const dinnerTarget = targetCalories * 0.30;
    const snacksTarget = targetCalories * 0.10;

    const findClosestMeal = (mealType: keyof typeof foodDatabase, target: number) => {
      const meals = foodDatabase[mealType];
      return meals.reduce((closest, meal) => {
        return Math.abs(meal.calories - target) < Math.abs(closest.calories - target)
          ? meal
          : closest;
      });
    };

    return {
      breakfast: findClosestMeal('breakfast', breakfastTarget),
      lunch: findClosestMeal('lunch', lunchTarget),
      dinner: findClosestMeal('dinner', dinnerTarget),
      snacks: [
        findClosestMeal('snacks', snacksTarget / 2),
        findClosestMeal('snacks', snacksTarget / 2),
      ],
    };
  };

  const mealPlan = generateMealPlan();
  const totalMealCalories = 
    mealPlan.breakfast.calories +
    mealPlan.lunch.calories +
    mealPlan.dinner.calories +
    mealPlan.snacks[0].calories +
    mealPlan.snacks[1].calories;

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl mb-2"
          >
            Your Personalized Health Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Based on your information, here's your customized nutrition plan
          </motion.p>
        </div>

        {/* BMI and TDEE Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Body Mass Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl mb-2">{bmi.toFixed(1)}</div>
                  <Badge className={`${bmiInfo.bgColor} ${bmiInfo.color}`}>
                    {bmiInfo.category}
                  </Badge>
                  <div className="mt-4">
                    <Progress value={(bmi / 40) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Daily Calorie Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl mb-2">{targetCalories}</div>
                  <p className="text-sm text-gray-600">calories per day</p>
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Maintenance (TDEE)</span>
                      <span>{tdee} cal</span>
                    </div>
                    {targetCalories !== tdee && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {targetCalories < tdee ? 'Deficit' : 'Surplus'}
                        </span>
                        <span className={targetCalories < tdee ? 'text-red-600' : 'text-green-600'}>
                          {Math.abs(targetCalories - tdee)} cal
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Apple className="w-5 h-5 text-red-500" />
                  Macro Split
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Protein</span>
                      <span>{macros.protein.grams}g ({macros.protein.percent}%)</span>
                    </div>
                    <Progress value={macros.protein.percent} className="h-2 bg-blue-100" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Carbs</span>
                      <span>{macros.carbs.grams}g ({macros.carbs.percent}%)</span>
                    </div>
                    <Progress value={macros.carbs.percent} className="h-2 bg-green-100" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fat</span>
                      <span>{macros.fat.grams}g ({macros.fat.percent}%)</span>
                    </div>
                    <Progress value={macros.fat.percent} className="h-2 bg-orange-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Meal Plan - Only show if goals include muscle-gain, overall-fitness, or weight-loss */}
        {shouldShowMealPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-purple-500" />
                  Your Personalized Meal Plan
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Total: {totalMealCalories} calories (Target: {targetCalories} calories)
                </p>
              </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Breakfast */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border-2 border-orange-200 rounded-xl bg-gradient-to-br from-orange-50 to-white"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Coffee className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg">Breakfast</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{mealPlan.breakfast.name}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{mealPlan.breakfast.calories} calories</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          P: {mealPlan.breakfast.protein}g
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          C: {mealPlan.breakfast.carbs}g
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          F: {mealPlan.breakfast.fat}g
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Lunch */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border-2 border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-white"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg">Lunch</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{mealPlan.lunch.name}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{mealPlan.lunch.calories} calories</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          P: {mealPlan.lunch.protein}g
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          C: {mealPlan.lunch.carbs}g
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          F: {mealPlan.lunch.fat}g
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Dinner */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-white"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg">Dinner</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{mealPlan.dinner.name}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{mealPlan.dinner.calories} calories</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          P: {mealPlan.dinner.protein}g
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          C: {mealPlan.dinner.carbs}g
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          F: {mealPlan.dinner.fat}g
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Snacks */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-white"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Apple className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg">Snacks</h3>
                  </div>
                  <div className="space-y-3">
                    {mealPlan.snacks.map((snack, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-sm">{snack.name}</p>
                        <div className="text-xs text-gray-600">
                          <p>{snack.calories} cal</p>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant="outline" className="text-xs py-0 px-1">
                              P: {snack.protein}g
                            </Badge>
                            <Badge variant="outline" className="text-xs py-0 px-1">
                              C: {snack.carbs}g
                            </Badge>
                            <Badge variant="outline" className="text-xs py-0 px-1">
                              F: {snack.fat}g
                            </Badge>
                          </div>
                        </div>
                        {index === 0 && <div className="border-t border-purple-200 my-2" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This meal plan is generated based on your goals and caloric needs. 
                  You can adjust portions and swap meals to match your preferences. Remember to stay hydrated 
                  and consult with a healthcare professional before making significant dietary changes.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        )}
      </motion.div>
    </div>
  );
}
