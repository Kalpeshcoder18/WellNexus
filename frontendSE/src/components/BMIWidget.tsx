import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, TrendingUp, Apple, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { calculateAllHealthMetrics } from './utils/healthCalculations';

interface BMIWidgetProps {
  userProfile: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    goals: string[];
  };
}

export default function BMIWidget({ userProfile }: BMIWidgetProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { height, weight, age, gender, goals } = userProfile;

  // Calculate all health metrics using shared utility
  const { bmi, bmr, tdee, targetCalories, bmiCategory: bmiInfo, macros } = calculateAllHealthMetrics(
    height,
    weight,
    age,
    gender,
    goals || []
  );

  return (
    <>
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Health Metrics
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* BMI Display */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-2xl font-bold">BMI: {bmi.toFixed(1)}</div>
                <Badge className={`${bmiInfo.bgColor} ${bmiInfo.color} mt-1`}>
                  {bmiInfo.category}
                </Badge>
              </div>
            </div>
            <Progress 
              value={(bmi / 40) * 100} 
              className={`h-2 ${bmiInfo.progressColor}`}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
            </div>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 border-t pt-3"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily Calories</span>
                  <span className="font-medium">{targetCalories} cal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TDEE</span>
                  <span className="font-medium">{tdee} cal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">BMR</span>
                  <span className="font-medium">{Math.round(bmr)} cal</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  className="w-full mt-2"
                >
                  View Full Details
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isExpanded && (
            <div className="text-xs text-gray-500 text-center">
              Click to expand
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-500" />
              Your Complete Health Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* BMI and TDEE Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-xl bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <h3 className="font-medium">BMI</h3>
                </div>
                <div className="text-3xl font-bold mb-1">{bmi.toFixed(1)}</div>
                <Badge className={`${bmiInfo.bgColor} ${bmiInfo.color}`}>
                  {bmiInfo.category}
                </Badge>
                <div className="mt-3">
                  <Progress value={(bmi / 40) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-xl bg-gradient-to-br from-green-50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <h3 className="font-medium">Daily Target</h3>
                </div>
                <div className="text-3xl font-bold mb-1">{targetCalories}</div>
                <p className="text-sm text-gray-600">calories per day</p>
                <div className="mt-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">TDEE</span>
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

              <div className="p-4 border rounded-xl bg-gradient-to-br from-orange-50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <Apple className="w-4 h-4 text-orange-500" />
                  <h3 className="font-medium">Macro Split</h3>
                </div>
                <div className="space-y-2 mt-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Protein</span>
                      <span>{macros.protein.grams}g ({macros.protein.percent}%)</span>
                    </div>
                    <Progress value={macros.protein.percent} className="h-1.5 bg-blue-100" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Carbs</span>
                      <span>{macros.carbs.grams}g ({macros.carbs.percent}%)</span>
                    </div>
                    <Progress value={macros.carbs.percent} className="h-1.5 bg-green-100" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fat</span>
                      <span>{macros.fat.grams}g ({macros.fat.percent}%)</span>
                    </div>
                    <Progress value={macros.fat.percent} className="h-1.5 bg-orange-100" />
                  </div>
                </div>
              </div>
            </div>

            {/* Body Stats */}
            <div className="p-4 border rounded-xl bg-gray-50">
              <h3 className="font-medium mb-3">Your Body Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="text-lg font-medium">{height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-lg font-medium">{weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="text-lg font-medium">{age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-lg font-medium capitalize">{userProfile.gender}</p>
                </div>
              </div>
            </div>

            {/* Goals */}
            {userProfile.goals && userProfile.goals.length > 0 && (
              <div className="p-4 border rounded-xl bg-purple-50">
                <h3 className="font-medium mb-3">Your Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.goals.map((goal) => (
                    <Badge key={goal} variant="secondary">
                      {goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These calculations are based on the Mifflin-St Jeor equation and moderate activity level. 
                For personalized advice, please consult with a healthcare professional or registered dietitian.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
