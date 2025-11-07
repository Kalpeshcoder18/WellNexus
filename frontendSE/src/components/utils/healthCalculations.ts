// Shared health calculation utilities

export interface HealthMetrics {
  bmi: number;
  bmr: number;
  tdee: number;
  targetCalories: number;
  bmiCategory: {
    category: string;
    color: string;
    bgColor: string;
    progressColor: string;
  };
  macros: {
    protein: { grams: number; percent: number };
    carbs: { grams: number; percent: number };
    fat: { grams: number; percent: number };
  };
}

export function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function getBMICategory(bmi: number) {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      progressColor: 'bg-blue-500',
    };
  }
  if (bmi < 25) {
    return {
      category: 'Normal',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      progressColor: 'bg-green-500',
    };
  }
  if (bmi < 30) {
    return {
      category: 'Overweight',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      progressColor: 'bg-orange-500',
    };
  }
  return {
    category: 'Obese',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    progressColor: 'bg-red-500',
  };
}

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  isMale: boolean
): number {
  // Mifflin-St Jeor Equation
  return isMale
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityMultiplier: number = 1.55): number {
  // Default activity multiplier is 1.55 (moderate exercise 3-5 days/week)
  return Math.round(bmr * activityMultiplier);
}

export function calculateTargetCalories(tdee: number, goals: string[]): number {
  const hasWeightLoss = goals.includes('weight-loss');
  const hasMuscleGain = goals.includes('muscle-gain');

  if (hasWeightLoss) {
    return Math.round(tdee - 500); // 500 calorie deficit for ~0.5kg/week loss
  } else if (hasMuscleGain) {
    return Math.round(tdee + 300); // 300 calorie surplus for muscle gain
  }
  return tdee; // Maintenance
}

export function calculateMacros(targetCalories: number, goals: string[]) {
  const hasWeightLoss = goals.includes('weight-loss');
  const hasMuscleGain = goals.includes('muscle-gain');

  let proteinPercent = 30;
  let carbsPercent = 40;
  let fatPercent = 30;

  if (hasMuscleGain) {
    proteinPercent = 35;
    carbsPercent = 40;
    fatPercent = 25;
  } else if (hasWeightLoss) {
    proteinPercent = 35;
    carbsPercent = 35;
    fatPercent = 30;
  }

  const proteinCalories = targetCalories * (proteinPercent / 100);
  const carbsCalories = targetCalories * (carbsPercent / 100);
  const fatCalories = targetCalories * (fatPercent / 100);

  return {
    protein: { grams: Math.round(proteinCalories / 4), percent: proteinPercent },
    carbs: { grams: Math.round(carbsCalories / 4), percent: carbsPercent },
    fat: { grams: Math.round(fatCalories / 9), percent: fatPercent },
  };
}

export function calculateAllHealthMetrics(
  height: number,
  weight: number,
  age: number,
  gender: string,
  goals: string[]
): HealthMetrics {
  const isMale = gender === 'male';
  const bmi = calculateBMI(height, weight);
  const bmr = calculateBMR(weight, height, age, isMale);
  const tdee = calculateTDEE(bmr);
  const targetCalories = calculateTargetCalories(tdee, goals);
  const bmiCategory = getBMICategory(bmi);
  const macros = calculateMacros(targetCalories, goals);

  return {
    bmi,
    bmr,
    tdee,
    targetCalories,
    bmiCategory,
    macros,
  };
}
