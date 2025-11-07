// Weekly Workout Plans based on user goals

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: {
    name: string;
    sets: string;
    reps: string;
    rest: string;
    notes?: string;
  }[];
  cardio?: {
    type: string;
    duration: string;
    intensity: string;
  };
}

export interface WeeklyPlan {
  goal: string;
  description: string;
  weeklySchedule: DailyWorkout[];
}

export const weeklyWorkoutPlans: Record<string, WeeklyPlan> = {
  'weight-loss': {
    goal: 'Weight Loss',
    description: 'High-intensity cardio and full-body workouts to maximize calorie burn',
    weeklySchedule: [
      {
        day: 'Monday',
        focus: 'Full Body Circuit',
        exercises: [
          { name: 'Jumping Jacks', sets: '3', reps: '30 seconds', rest: '15s' },
          { name: 'Burpees', sets: '3', reps: '12-15', rest: '30s' },
          { name: 'Mountain Climbers', sets: '3', reps: '20', rest: '20s' },
          { name: 'Squat Jumps', sets: '3', reps: '15', rest: '30s' },
          { name: 'Push-ups', sets: '3', reps: '12-15', rest: '30s' },
        ],
        cardio: { type: 'Running/Jogging', duration: '20-30 min', intensity: 'Moderate to High' }
      },
      {
        day: 'Tuesday',
        focus: 'Cardio & Core',
        exercises: [
          { name: 'Plank', sets: '3', reps: '45-60 seconds', rest: '30s' },
          { name: 'Bicycle Crunches', sets: '3', reps: '20', rest: '20s' },
          { name: 'Leg Raises', sets: '3', reps: '15', rest: '20s' },
          { name: 'Russian Twists', sets: '3', reps: '20', rest: '20s' },
        ],
        cardio: { type: 'HIIT Cardio', duration: '25 min', intensity: 'High' }
      },
      {
        day: 'Wednesday',
        focus: 'Active Recovery',
        exercises: [
          { name: 'Walking', sets: '-', reps: '30-45 min', rest: '-', notes: 'Light pace' },
          { name: 'Stretching', sets: '-', reps: '15 min', rest: '-' },
          { name: 'Yoga Flow', sets: '-', reps: '20 min', rest: '-' },
        ]
      },
      {
        day: 'Thursday',
        focus: 'Lower Body & Cardio',
        exercises: [
          { name: 'Squats', sets: '4', reps: '15-20', rest: '30s' },
          { name: 'Lunges', sets: '3', reps: '12 each leg', rest: '30s' },
          { name: 'Step-ups', sets: '3', reps: '15 each leg', rest: '30s' },
          { name: 'Glute Bridges', sets: '3', reps: '20', rest: '20s' },
        ],
        cardio: { type: 'Cycling', duration: '30 min', intensity: 'Moderate' }
      },
      {
        day: 'Friday',
        focus: 'Upper Body Circuit',
        exercises: [
          { name: 'Push-ups', sets: '4', reps: '12-15', rest: '30s' },
          { name: 'Dumbbell Rows', sets: '3', reps: '12', rest: '30s' },
          { name: 'Shoulder Press', sets: '3', reps: '12', rest: '30s' },
          { name: 'Tricep Dips', sets: '3', reps: '12-15', rest: '30s' },
          { name: 'Bicep Curls', sets: '3', reps: '12-15', rest: '30s' },
        ],
        cardio: { type: 'Jump Rope', duration: '15 min', intensity: 'High' }
      },
      {
        day: 'Saturday',
        focus: 'Full Body HIIT',
        exercises: [
          { name: 'High Knees', sets: '4', reps: '30 seconds', rest: '15s' },
          { name: 'Burpees', sets: '4', reps: '10', rest: '30s' },
          { name: 'Jump Squats', sets: '4', reps: '15', rest: '30s' },
          { name: 'Plank to Push-up', sets: '3', reps: '10', rest: '30s' },
        ],
        cardio: { type: 'Sprints', duration: '20 min', intensity: 'Very High' }
      },
      {
        day: 'Sunday',
        focus: 'Rest & Recovery',
        exercises: [
          { name: 'Light Stretching', sets: '-', reps: '20 min', rest: '-' },
          { name: 'Foam Rolling', sets: '-', reps: '15 min', rest: '-' },
          { name: 'Meditation', sets: '-', reps: '10 min', rest: '-' },
        ]
      }
    ]
  },
  'muscle-gain': {
    goal: 'Muscle Gain',
    description: 'Progressive overload strength training focused on each major muscle group',
    weeklySchedule: [
      {
        day: 'Monday',
        focus: 'Chest & Triceps',
        exercises: [
          { name: 'Barbell Bench Press', sets: '4', reps: '8-10', rest: '90s', notes: 'Increase weight each set' },
          { name: 'Incline Dumbbell Press', sets: '4', reps: '10-12', rest: '60s' },
          { name: 'Chest Flyes', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Tricep Dips', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Overhead Tricep Extension', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Tricep Pushdowns', sets: '3', reps: '12-15', rest: '60s' },
        ]
      },
      {
        day: 'Tuesday',
        focus: 'Back & Biceps',
        exercises: [
          { name: 'Deadlifts', sets: '4', reps: '6-8', rest: '2 min', notes: 'Heavy weight, perfect form' },
          { name: 'Pull-ups/Lat Pulldowns', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Barbell Rows', sets: '4', reps: '10-12', rest: '60s' },
          { name: 'Seated Cable Rows', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Barbell Bicep Curls', sets: '4', reps: '10-12', rest: '60s' },
          { name: 'Hammer Curls', sets: '3', reps: '12-15', rest: '60s' },
        ]
      },
      {
        day: 'Wednesday',
        focus: 'Rest or Light Cardio',
        exercises: [
          { name: 'Walking', sets: '-', reps: '20-30 min', rest: '-' },
          { name: 'Light Stretching', sets: '-', reps: '15 min', rest: '-' },
        ]
      },
      {
        day: 'Thursday',
        focus: 'Legs & Glutes',
        exercises: [
          { name: 'Barbell Squats', sets: '5', reps: '6-8', rest: '2 min', notes: 'Progressive overload' },
          { name: 'Leg Press', sets: '4', reps: '10-12', rest: '90s' },
          { name: 'Romanian Deadlifts', sets: '4', reps: '10-12', rest: '90s' },
          { name: 'Leg Curls', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Leg Extensions', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Calf Raises', sets: '4', reps: '15-20', rest: '60s' },
        ]
      },
      {
        day: 'Friday',
        focus: 'Shoulders & Abs',
        exercises: [
          { name: 'Military Press', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Lateral Raises', sets: '4', reps: '12-15', rest: '60s' },
          { name: 'Front Raises', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Rear Delt Flyes', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Hanging Leg Raises', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Cable Crunches', sets: '3', reps: '15-20', rest: '60s' },
        ]
      },
      {
        day: 'Saturday',
        focus: 'Arms & Core',
        exercises: [
          { name: 'Close-Grip Bench Press', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Preacher Curls', sets: '4', reps: '10-12', rest: '60s' },
          { name: 'Skull Crushers', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Concentration Curls', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Plank', sets: '3', reps: '60 seconds', rest: '60s' },
          { name: 'Russian Twists', sets: '3', reps: '20', rest: '45s' },
        ]
      },
      {
        day: 'Sunday',
        focus: 'Rest & Recovery',
        exercises: [
          { name: 'Foam Rolling', sets: '-', reps: '20 min', rest: '-' },
          { name: 'Stretching', sets: '-', reps: '20 min', rest: '-' },
          { name: 'Light Walk', sets: '-', reps: '15 min', rest: '-', notes: 'Optional' },
        ]
      }
    ]
  },
  'fitness': {
    goal: 'Overall Fitness',
    description: 'Balanced program combining strength, cardio, and flexibility',
    weeklySchedule: [
      {
        day: 'Monday',
        focus: 'Full Body Strength',
        exercises: [
          { name: 'Squats', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Push-ups', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Dumbbell Rows', sets: '3', reps: '12 each', rest: '60s' },
          { name: 'Lunges', sets: '3', reps: '10 each leg', rest: '60s' },
          { name: 'Plank', sets: '3', reps: '45 seconds', rest: '45s' },
        ]
      },
      {
        day: 'Tuesday',
        focus: 'Cardio & Core',
        exercises: [
          { name: 'Bicycle Crunches', sets: '3', reps: '20', rest: '30s' },
          { name: 'Mountain Climbers', sets: '3', reps: '15', rest: '30s' },
          { name: 'Leg Raises', sets: '3', reps: '12-15', rest: '30s' },
        ],
        cardio: { type: 'Running or Cycling', duration: '30 min', intensity: 'Moderate' }
      },
      {
        day: 'Wednesday',
        focus: 'Yoga & Flexibility',
        exercises: [
          { name: 'Yoga Flow', sets: '-', reps: '30-45 min', rest: '-' },
          { name: 'Deep Stretching', sets: '-', reps: '15 min', rest: '-' },
        ]
      },
      {
        day: 'Thursday',
        focus: 'Upper Body',
        exercises: [
          { name: 'Overhead Press', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Bench Press or Push-ups', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Pull-ups/Lat Pulldowns', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Bicep Curls', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Tricep Dips', sets: '3', reps: '12-15', rest: '60s' },
        ]
      },
      {
        day: 'Friday',
        focus: 'Lower Body & Cardio',
        exercises: [
          { name: 'Deadlifts', sets: '3', reps: '10-12', rest: '90s' },
          { name: 'Leg Press', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Leg Curls', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Calf Raises', sets: '3', reps: '15-20', rest: '45s' },
        ],
        cardio: { type: 'Swimming or Rowing', duration: '20 min', intensity: 'Moderate' }
      },
      {
        day: 'Saturday',
        focus: 'HIIT & Core',
        exercises: [
          { name: 'Burpees', sets: '4', reps: '10', rest: '30s' },
          { name: 'Jump Squats', sets: '4', reps: '12', rest: '30s' },
          { name: 'High Knees', sets: '4', reps: '30 seconds', rest: '20s' },
          { name: 'Plank to Push-up', sets: '3', reps: '10', rest: '30s' },
        ]
      },
      {
        day: 'Sunday',
        focus: 'Active Recovery',
        exercises: [
          { name: 'Light Walk or Hike', sets: '-', reps: '30-60 min', rest: '-' },
          { name: 'Stretching', sets: '-', reps: '20 min', rest: '-' },
        ]
      }
    ]
  },
  'mental-wellness': {
    goal: 'Mental Wellness',
    description: 'Low-impact exercises focusing on mindfulness and stress relief',
    weeklySchedule: [
      {
        day: 'Monday',
        focus: 'Gentle Yoga',
        exercises: [
          { name: 'Sun Salutations', sets: '3', reps: '5 rounds', rest: '30s' },
          { name: 'Warrior Poses', sets: '-', reps: '10 min', rest: '-' },
          { name: 'Child\'s Pose', sets: '-', reps: '5 min', rest: '-' },
          { name: 'Savasana', sets: '-', reps: '10 min', rest: '-' },
        ]
      },
      {
        day: 'Tuesday',
        focus: 'Walking Meditation',
        exercises: [
          { name: 'Mindful Walking', sets: '-', reps: '30 min', rest: '-', notes: 'Focus on breath and steps' },
          { name: 'Breathing Exercises', sets: '-', reps: '10 min', rest: '-' },
        ]
      },
      {
        day: 'Wednesday',
        focus: 'Tai Chi & Balance',
        exercises: [
          { name: 'Tai Chi Flow', sets: '-', reps: '20-30 min', rest: '-' },
          { name: 'Balance Poses', sets: '3', reps: '1 min each', rest: '30s' },
          { name: 'Stretching', sets: '-', reps: '15 min', rest: '-' },
        ]
      },
      {
        day: 'Thursday',
        focus: 'Restorative Yoga',
        exercises: [
          { name: 'Supported Bridge Pose', sets: '-', reps: '5 min', rest: '-' },
          { name: 'Legs Up the Wall', sets: '-', reps: '10 min', rest: '-' },
          { name: 'Gentle Twists', sets: '-', reps: '10 min', rest: '-' },
          { name: 'Final Relaxation', sets: '-', reps: '10 min', rest: '-' },
        ]
      },
      {
        day: 'Friday',
        focus: 'Nature Walk & Mindfulness',
        exercises: [
          { name: 'Nature Walk', sets: '-', reps: '45 min', rest: '-', notes: 'In a park or natural setting' },
          { name: 'Seated Meditation', sets: '-', reps: '15 min', rest: '-' },
        ]
      },
      {
        day: 'Saturday',
        focus: 'Gentle Flow Yoga',
        exercises: [
          { name: 'Vinyasa Flow', sets: '-', reps: '30 min', rest: '-', notes: 'Slow, mindful movements' },
          { name: 'Yin Yoga', sets: '-', reps: '20 min', rest: '-' },
          { name: 'Meditation', sets: '-', reps: '10 min', rest: '-' },
        ]
      },
      {
        day: 'Sunday',
        focus: 'Rest & Self-Care',
        exercises: [
          { name: 'Journaling', sets: '-', reps: '15 min', rest: '-' },
          { name: 'Breathing Exercises', sets: '-', reps: '10 min', rest: '-' },
          { name: 'Light Stretching', sets: '-', reps: '15 min', rest: '-' },
        ]
      }
    ]
  }
};

export function getWorkoutPlanByGoal(goals: string[]): WeeklyPlan | null {
  // Priority order: muscle-gain > weight-loss > fitness > mental-wellness
  const priorityOrder = ['muscle-gain', 'weight-loss', 'fitness', 'mental-wellness'];
  
  for (const goalId of priorityOrder) {
    if (goals.includes(goalId) && weeklyWorkoutPlans[goalId]) {
      return weeklyWorkoutPlans[goalId];
    }
  }
  
  // Default to overall fitness if no matching goal
  return weeklyWorkoutPlans['fitness'];
}
