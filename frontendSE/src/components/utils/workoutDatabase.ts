export interface WorkoutVideo {
  id: number;
  title: string;
  instructor: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  category: 'yoga' | 'cardio' | 'strength' | 'hiit' | 'pilates' | 'dance';
  thumbnail: string;
  equipment: string;
  calories: number;
  videoUrl: string;
}

export const workoutDatabase: WorkoutVideo[] = [
  // Yoga Workouts
  {
    id: 1,
    title: 'Morning Yoga Flow',
    instructor: 'Yoga With Adriene',
    duration: 30,
    difficulty: 'Beginner',
    rating: 4.9,
    category: 'yoga',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    equipment: 'Mat',
    calories: 120,
    videoUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE'
  },
  {
    id: 2,
    title: 'Deep Stretch Yoga',
    instructor: 'Boho Beautiful',
    duration: 25,
    difficulty: 'Beginner',
    rating: 4.8,
    category: 'yoga',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    equipment: 'Mat',
    calories: 100,
    videoUrl: 'https://www.youtube.com/watch?v=GLy2rYHwUqY'
  },
  {
    id: 3,
    title: 'Power Yoga Workout',
    instructor: 'Yoga With Tim',
    duration: 45,
    difficulty: 'Intermediate',
    rating: 4.7,
    category: 'yoga',
    thumbnail: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800',
    equipment: 'Mat',
    calories: 180,
    videoUrl: 'https://www.youtube.com/watch?v=Yzm3fA2HhkQ'
  },
  {
    id: 4,
    title: 'Vinyasa Flow',
    instructor: 'Five Parks Yoga',
    duration: 35,
    difficulty: 'Intermediate',
    rating: 4.8,
    category: 'yoga',
    thumbnail: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
    equipment: 'Mat',
    calories: 150,
    videoUrl: 'https://www.youtube.com/watch?v=COp7BR_Dvps'
  },
  {
    id: 5,
    title: 'Advanced Yoga Practice',
    instructor: 'Kino Yoga',
    duration: 60,
    difficulty: 'Advanced',
    rating: 4.9,
    category: 'yoga',
    thumbnail: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800',
    equipment: 'Mat',
    calories: 220,
    videoUrl: 'https://www.youtube.com/watch?v=nAmc9SNciTg'
  },

  // Cardio Workouts
  {
    id: 6,
    title: 'HIIT Cardio Blast',
    instructor: 'FitnessBlender',
    duration: 30,
    difficulty: 'Intermediate',
    rating: 4.8,
    category: 'cardio',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    equipment: 'None',
    calories: 280,
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI'
  },
  {
    id: 7,
    title: 'Walking Workout',
    instructor: 'Walk at Home',
    duration: 20,
    difficulty: 'Beginner',
    rating: 4.6,
    category: 'cardio',
    thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    equipment: 'None',
    calories: 150,
    videoUrl: 'https://www.youtube.com/watch?v=FEy49r0m8O0'
  },
  {
    id: 8,
    title: 'Jump Rope Cardio',
    instructor: 'Jump Rope Dudes',
    duration: 15,
    difficulty: 'Intermediate',
    rating: 4.7,
    category: 'cardio',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    equipment: 'Jump Rope',
    calories: 200,
    videoUrl: 'https://www.youtube.com/watch?v=FszklyZAXMw'
  },
  {
    id: 9,
    title: 'Running Intervals',
    instructor: 'The Run Experience',
    duration: 25,
    difficulty: 'Advanced',
    rating: 4.8,
    category: 'cardio',
    thumbnail: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    equipment: 'None',
    calories: 300,
    videoUrl: 'https://www.youtube.com/watch?v=ZfoGTBrChKE'
  },

  // Strength Workouts
  {
    id: 10,
    title: 'Full Body Strength',
    instructor: 'Heather Robertson',
    duration: 40,
    difficulty: 'Intermediate',
    rating: 4.9,
    category: 'strength',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    equipment: 'Dumbbells',
    calories: 320,
    videoUrl: 'https://www.youtube.com/watch?v=3sEeVJEXTfY'
  },
  {
    id: 11,
    title: 'Upper Body Workout',
    instructor: 'Caroline Girvan',
    duration: 35,
    difficulty: 'Intermediate',
    rating: 4.8,
    category: 'strength',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    equipment: 'Dumbbells',
    calories: 280,
    videoUrl: 'https://www.youtube.com/watch?v=cXh0nOHNbW8'
  },
  {
    id: 12,
    title: 'Leg Day Workout',
    instructor: 'Growingannanas',
    duration: 30,
    difficulty: 'Advanced',
    rating: 4.7,
    category: 'strength',
    thumbnail: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800',
    equipment: 'Dumbbells',
    calories: 300,
    videoUrl: 'https://www.youtube.com/watch?v=A7k2Pg-a1Qs'
  },
  {
    id: 13,
    title: 'Core Strength Training',
    instructor: 'MadFit',
    duration: 20,
    difficulty: 'Beginner',
    rating: 4.8,
    category: 'strength',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    equipment: 'Mat',
    calories: 180,
    videoUrl: 'https://www.youtube.com/watch?v=DHD1-2P94DI'
  },
  {
    id: 14,
    title: 'Total Body Sculpt',
    instructor: 'Sydney Cummings',
    duration: 45,
    difficulty: 'Intermediate',
    rating: 4.9,
    category: 'strength',
    thumbnail: 'https://images.unsplash.com/photo-1623874228601-f4193c7b1818?w=800',
    equipment: 'Dumbbells',
    calories: 350,
    videoUrl: 'https://www.youtube.com/watch?v=MhPf0BwvfC8'
  },

  // HIIT Workouts
  {
    id: 15,
    title: '20 Min HIIT Workout',
    instructor: 'POPSUGAR Fitness',
    duration: 20,
    difficulty: 'Intermediate',
    rating: 4.8,
    category: 'hiit',
    thumbnail: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800',
    equipment: 'None',
    calories: 250,
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI'
  },
  {
    id: 16,
    title: 'Tabata Training',
    instructor: 'HASfit',
    duration: 30,
    difficulty: 'Advanced',
    rating: 4.7,
    category: 'hiit',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    equipment: 'None',
    calories: 320,
    videoUrl: 'https://www.youtube.com/watch?v=2MzfY1kYxGQ'
  },
  {
    id: 17,
    title: 'Fat Burning HIIT',
    instructor: 'The Body Coach TV',
    duration: 25,
    difficulty: 'Intermediate',
    rating: 4.9,
    category: 'hiit',
    thumbnail: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800',
    equipment: 'None',
    calories: 290,
    videoUrl: 'https://www.youtube.com/watch?v=cZnsLVArIt8'
  },
  {
    id: 18,
    title: 'Beginner HIIT',
    instructor: 'Juice & Toya',
    duration: 15,
    difficulty: 'Beginner',
    rating: 4.6,
    category: 'hiit',
    thumbnail: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800',
    equipment: 'None',
    calories: 180,
    videoUrl: 'https://www.youtube.com/watch?v=q20pZbqJDN0'
  },
  {
    id: 19,
    title: 'Advanced HIIT Challenge',
    instructor: 'Chloe Ting',
    duration: 35,
    difficulty: 'Advanced',
    rating: 4.8,
    category: 'hiit',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    equipment: 'None',
    calories: 380,
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
  },

  // Pilates Workouts
  {
    id: 20,
    title: 'Beginner Pilates',
    instructor: 'Move With Nicole',
    duration: 30,
    difficulty: 'Beginner',
    rating: 4.7,
    category: 'pilates',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    equipment: 'Mat',
    calories: 150,
    videoUrl: 'https://www.youtube.com/watch?v=K56Z12XqMRI'
  },
  {
    id: 21,
    title: 'Core Pilates Workout',
    instructor: 'Blogilates',
    duration: 25,
    difficulty: 'Intermediate',
    rating: 4.8,
    category: 'pilates',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    equipment: 'Mat',
    calories: 170,
    videoUrl: 'https://www.youtube.com/watch?v=kUgs4eT5XS8'
  },
  {
    id: 22,
    title: 'Full Body Pilates',
    instructor: 'Lottie Murphy',
    duration: 40,
    difficulty: 'Intermediate',
    rating: 4.9,
    category: 'pilates',
    thumbnail: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
    equipment: 'Mat',
    calories: 200,
    videoUrl: 'https://www.youtube.com/watch?v=fShHGCfJVBs'
  },
  {
    id: 23,
    title: 'Advanced Pilates Flow',
    instructor: 'Pilates Anytime',
    duration: 35,
    difficulty: 'Advanced',
    rating: 4.8,
    category: 'pilates',
    thumbnail: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800',
    equipment: 'Mat, Ball',
    calories: 220,
    videoUrl: 'https://www.youtube.com/watch?v=E0yzjI1RyKo'
  },

  // Dance Workouts
  {
    id: 24,
    title: 'Dance Cardio Party',
    instructor: 'The Fitness Marshall',
    duration: 30,
    difficulty: 'Beginner',
    rating: 4.9,
    category: 'dance',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
    equipment: 'None',
    calories: 220,
    videoUrl: 'https://www.youtube.com/watch?v=rMcNi5ZP5o8'
  },
  {
    id: 25,
    title: 'Hip Hop Dance Workout',
    instructor: 'MihranTV',
    duration: 25,
    difficulty: 'Intermediate',
    rating: 4.7,
    category: 'dance',
    thumbnail: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800',
    equipment: 'None',
    calories: 240,
    videoUrl: 'https://www.youtube.com/watch?v=nIQdM5bKLa4'
  },
  {
    id: 26,
    title: 'Latin Dance Fitness',
    instructor: 'DanceFitness with Jessica',
    duration: 35,
    difficulty: 'Intermediate',
    rating: 4.8,
    category: 'dance',
    thumbnail: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800',
    equipment: 'None',
    calories: 280,
    videoUrl: 'https://www.youtube.com/watch?v=QdDz6IhPBWE'
  },
  {
    id: 27,
    title: 'Bollywood Dance Workout',
    instructor: 'BollyX',
    duration: 30,
    difficulty: 'Beginner',
    rating: 4.6,
    category: 'dance',
    thumbnail: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800',
    equipment: 'None',
    calories: 200,
    videoUrl: 'https://www.youtube.com/watch?v=mOE9fE72EvQ'
  },
  {
    id: 28,
    title: 'Zumba Gold',
    instructor: 'Zumba',
    duration: 40,
    difficulty: 'Beginner',
    rating: 4.8,
    category: 'dance',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
    equipment: 'None',
    calories: 260,
    videoUrl: 'https://www.youtube.com/watch?v=XULUBg_ZcAU'
  },
];

export const workoutCategories = [
  { id: 'yoga', label: 'Yoga', icon: '🧘‍♀️', color: 'from-purple-400 to-pink-500' },
  { id: 'cardio', label: 'Cardio', icon: '🏃‍♂️', color: 'from-red-400 to-orange-500' },
  { id: 'strength', label: 'Strength', icon: '💪', color: 'from-blue-400 to-indigo-500' },
  { id: 'hiit', label: 'HIIT', icon: '⚡', color: 'from-yellow-400 to-red-500' },
  { id: 'pilates', label: 'Pilates', icon: '🤸‍♀️', color: 'from-green-400 to-blue-500' },
  { id: 'dance', label: 'Dance', icon: '💃', color: 'from-pink-400 to-purple-500' },
];

export function getWorkoutsByCategory(category: string): WorkoutVideo[] {
  if (category === 'all') {
    return workoutDatabase;
  }
  return workoutDatabase.filter(workout => workout.category === category);
}

export function getWorkoutById(id: number): WorkoutVideo | undefined {
  return workoutDatabase.find(workout => workout.id === id);
}

export function getCategoryCount(category: string): number {
  if (category === 'all') {
    return workoutDatabase.length;
  }
  return workoutDatabase.filter(workout => workout.category === category).length;
}
