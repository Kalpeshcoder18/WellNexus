import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Points awarded for different activities
export const POINTS_CONFIG = {
  WORKOUT_COMPLETED: 10,
  MEDITATION_SESSION: 5,
  MOOD_ENTRY: 3,
  MEAL_LOGGED: 2,
  WATER_GLASS: 1,
  POST_CREATED: 5,
  COMMENT_ADDED: 2,
  POST_LIKED: 1,
  DAILY_STREAK: 5,
  CHALLENGE_COMPLETED: 0, // Variable based on challenge reward
};

export interface Challenge {
  id: number;
  title: string;
  description: string;
  participants: number;
  daysLeft: number;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  reward: number; // Points as number
  joined: boolean;
  startDate?: string;
  targetDays?: number;
  currentDays?: number;
  dailyGoal?: {
    type: 'water' | 'workout' | 'meditation' | 'plant-based';
    count: number;
  };
}

export interface UserChallenge {
  challengeId: number;
  startDate: string;
  progress: number;
  completed: boolean;
  daysCompleted: number;
  lastActivityDate?: string;
}

interface PointsActivity {
  id: string;
  type: string;
  points: number;
  description: string;
  timestamp: Date;
}

interface PointsContextType {
  totalPoints: number;
  streak: number;
  activeChallenges: UserChallenge[];
  completedChallenges: UserChallenge[];
  activities: PointsActivity[];
  addPoints: (type: string, points: number, description: string) => void;
  joinChallenge: (challenge: Challenge) => void;
  updateChallengeProgress: (challengeId: number, progress: number) => void;
  completeChallenge: (challengeId: number) => void;
  getChallengeById: (challengeId: number) => UserChallenge | undefined;
  calculatePointsFromActivities: (workouts: number, meditations: number, moodEntries: number, meals: number) => number;
  updateStreak: () => void;
  rank: number;
  badge: string;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeChallenges, setActiveChallenges] = useState<UserChallenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<UserChallenge[]>([]);
  const [activities, setActivities] = useState<PointsActivity[]>([]);
  const [rank, setRank] = useState(6);
  const [badge, setBadge] = useState('Intermediate');

  // Load from localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem('totalPoints');
    const savedStreak = localStorage.getItem('pointsStreak');
    const savedActiveChallenges = localStorage.getItem('activeChallenges');
    const savedCompletedChallenges = localStorage.getItem('completedChallenges');
    const savedActivities = localStorage.getItem('pointsActivities');
    const savedRank = localStorage.getItem('userRank');
    const savedBadge = localStorage.getItem('userBadge');

    if (savedPoints) setTotalPoints(Number(savedPoints));
    if (savedStreak) setStreak(Number(savedStreak));
    if (savedActiveChallenges) setActiveChallenges(JSON.parse(savedActiveChallenges));
    if (savedCompletedChallenges) setCompletedChallenges(JSON.parse(savedCompletedChallenges));
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities);
      setActivities(parsed.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) })));
    }
    if (savedRank) setRank(Number(savedRank));
    if (savedBadge) setBadge(savedBadge);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('totalPoints', totalPoints.toString());
  }, [totalPoints]);

  useEffect(() => {
    localStorage.setItem('pointsStreak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('activeChallenges', JSON.stringify(activeChallenges));
  }, [activeChallenges]);

  useEffect(() => {
    localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  useEffect(() => {
    localStorage.setItem('pointsActivities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('userRank', rank.toString());
  }, [rank]);

  useEffect(() => {
    localStorage.setItem('userBadge', badge);
  }, [badge]);

  // Update badge based on points
  useEffect(() => {
    if (totalPoints >= 2500) {
      setBadge('Champion');
      setRank(1);
    } else if (totalPoints >= 2000) {
      setBadge('Expert');
      setRank(Math.min(3, rank));
    } else if (totalPoints >= 1500) {
      setBadge('Advanced');
      setRank(Math.min(5, rank));
    } else if (totalPoints >= 1000) {
      setBadge('Intermediate');
      setRank(Math.min(6, rank));
    } else {
      setBadge('Beginner');
      setRank(Math.min(10, rank));
    }
  }, [totalPoints]);

  const addPoints = (type: string, points: number, description: string) => {
    const activity: PointsActivity = {
      id: Date.now().toString() + Math.random(),
      type,
      points,
      description,
      timestamp: new Date(),
    };

    setActivities(prev => [activity, ...prev.slice(0, 99)]); // Keep last 100 activities
    setTotalPoints(prev => prev + points);
  };

  const joinChallenge = (challenge: Challenge) => {
    const userChallenge: UserChallenge = {
      challengeId: challenge.id,
      startDate: new Date().toISOString(),
      progress: 0,
      completed: false,
      daysCompleted: 0,
    };

    setActiveChallenges(prev => [...prev, userChallenge]);
    addPoints('challenge_joined', 5, `Joined ${challenge.title}`);
  };

  const updateChallengeProgress = (challengeId: number, progress: number) => {
    setActiveChallenges(prev =>
      prev.map(challenge =>
        challenge.challengeId === challengeId
          ? { 
              ...challenge, 
              progress, 
              lastActivityDate: new Date().toISOString(),
              daysCompleted: Math.floor(progress / 100 * 30) // Assuming 30-day challenges
            }
          : challenge
      )
    );
  };

  const completeChallenge = (challengeId: number) => {
    const challenge = activeChallenges.find(c => c.challengeId === challengeId);
    if (challenge) {
      const completedChallenge = { ...challenge, completed: true, progress: 100 };
      setCompletedChallenges(prev => [...prev, completedChallenge]);
      setActiveChallenges(prev => prev.filter(c => c.challengeId !== challengeId));
    }
  };

  const getChallengeById = (challengeId: number) => {
    return activeChallenges.find(c => c.challengeId === challengeId) ||
           completedChallenges.find(c => c.challengeId === challengeId);
  };

  const calculatePointsFromActivities = (
    workouts: number,
    meditations: number,
    moodEntries: number,
    meals: number
  ) => {
    return (
      workouts * POINTS_CONFIG.WORKOUT_COMPLETED +
      meditations * POINTS_CONFIG.MEDITATION_SESSION +
      moodEntries * POINTS_CONFIG.MOOD_ENTRY +
      meals * POINTS_CONFIG.MEAL_LOGGED +
      streak * POINTS_CONFIG.DAILY_STREAK
    );
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActivity = activities[0];
    
    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity.timestamp).toDateString();
      
      if (lastActivityDate === today) {
        // Already logged today
        return;
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastActivityDate === yesterdayStr) {
        // Continue streak
        setStreak(prev => prev + 1);
        addPoints('daily_streak', POINTS_CONFIG.DAILY_STREAK, `${streak + 1} day streak!`);
      } else {
        // Reset streak
        setStreak(1);
      }
    }
  };

  return (
    <PointsContext.Provider
      value={{
        totalPoints,
        streak,
        activeChallenges,
        completedChallenges,
        activities,
        addPoints,
        joinChallenge,
        updateChallengeProgress,
        completeChallenge,
        getChallengeById,
        calculatePointsFromActivities,
        updateStreak,
        rank,
        badge,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
