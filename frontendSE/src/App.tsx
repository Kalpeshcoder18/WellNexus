import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Apple, Dumbbell, Heart, Users, Settings, MessageSquare, ShoppingBag } from 'lucide-react';
import { Button } from './components/ui/button';
import { cn } from './components/ui/utils';
import { Toaster } from './components/ui/sonner';
import { MealProvider } from './components/utils/mealContext';
import { MoodProvider } from './components/utils/moodContext';
import { JournalProvider } from './components/utils/journalContext';
import { MealPlannerProvider } from './components/utils/mealPlannerContext';
import { WaterIntakeProvider } from './components/utils/waterIntakeContext';
import { WorkoutProvider } from './components/utils/workoutContext';
import { MentalWellbeingProvider } from './components/utils/mentalWellbeingContext';
import { CommunityProvider } from './components/utils/communityContext';
import { PointsProvider } from './components/utils/pointsContext';
import { ThemeProvider } from './components/utils/themeContext';
import { LanguageProvider } from './components/utils/languageContext';

// Components
import LoginPage from './components/LoginPage';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import NutritionTracker from './components/NutritionTracker';
import WorkoutSection from './components/WorkoutSection';
import MentalWellbeing from './components/MentalWellbeing';
import CommunitySection from './components/CommunitySection';
import SettingsSection from './components/SettingsSectionNew';
import TherapyDashboard from './components/TherapyDashboard';
import SupplementStore from './components/SupplementStore';

interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  lifestyle: {
    sitting: number;
    standing: number;
    walking: number;
    intense: number;
  };
  goals: string[];
  medicalConditions: string[];
  medications: string[];
  isOnboarded: boolean;
  email?: string;
  loginMethod?: 'email' | 'google';
}

const initialUserProfile: UserProfile = {
  name: '',
  age: 0,
  gender: '',
  height: 0,
  weight: 0,
  lifestyle: { sitting: 50, standing: 20, walking: 20, intense: 10 },
  goals: [],
  medicalConditions: [],
  medications: [],
  isOnboarded: false,
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Home', icon: Home, color: 'text-blue-600' },
    { id: 'nutrition', label: 'Nutrition', icon: Apple, color: 'text-green-600' },
    { id: 'workout', label: 'Workout', icon: Dumbbell, color: 'text-orange-600' },
    { id: 'mental', label: 'Mental', icon: Heart, color: 'text-purple-600' },
    { id: 'therapy', label: 'Therapy', icon: MessageSquare, color: 'text-violet-600' },
    { id: 'supplements', label: 'Supplement Store', icon: ShoppingBag, color: 'text-teal-600' },
    { id: 'community', label: 'Community', icon: Users, color: 'text-pink-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
  ];

  const handleLogin = (email: string, password: string, loginMethod: 'email' | 'google') => {
    setUserProfile(prev => ({
      ...prev,
      email,
      loginMethod,
    }));
    setIsLoggedIn(true);
  };

  const handleCompleteOnboarding = (profile: UserProfile) => {
    setUserProfile({ ...profile, isOnboarded: true, email: userProfile.email, loginMethod: userProfile.loginMethod });
    setCurrentScreen('dashboard');
  };

  const renderCurrentScreen = () => {
    if (!userProfile.isOnboarded) {
      return <OnboardingFlow onComplete={handleCompleteOnboarding} />;
    }

    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard userProfile={userProfile} onNavigate={setCurrentScreen} />;
      case 'nutrition':
        return <NutritionTracker userProfile={userProfile} />;
      case 'workout':
        return <WorkoutSection userProfile={userProfile} />;
      case 'mental':
        return <MentalWellbeing userProfile={userProfile} onNavigate={setCurrentScreen} />;
      case 'therapy':
        return <TherapyDashboard userProfile={userProfile} />;
      case 'supplements':
        return <SupplementStore userProfile={userProfile} />;
      case 'community':
        return <CommunitySection userProfile={userProfile} />;
      case 'settings':
        return <SettingsSection userProfile={userProfile} setUserProfile={setUserProfile} />;
      default:
        return <Dashboard userProfile={userProfile} onNavigate={setCurrentScreen} />;
    }
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <LoginPage onLogin={handleLogin} />
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  // Show onboarding if not onboarded
  if (!userProfile.isOnboarded) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <MealProvider>
            <MealPlannerProvider>
              <WaterIntakeProvider>
                <WorkoutProvider>
                  <MoodProvider>
                    <JournalProvider>
                      <MentalWellbeingProvider>
                        <CommunityProvider>
                          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                            <OnboardingFlow onComplete={handleCompleteOnboarding} />
                            <Toaster />
                          </div>
                        </CommunityProvider>
                      </MentalWellbeingProvider>
                    </JournalProvider>
                  </MoodProvider>
                </WorkoutProvider>
              </WaterIntakeProvider>
            </MealPlannerProvider>
          </MealProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <MealProvider>
          <MealPlannerProvider>
            <WaterIntakeProvider>
              <WorkoutProvider>
                <MoodProvider>
                  <JournalProvider>
                    <MentalWellbeingProvider>
                      <CommunityProvider>
                        <PointsProvider>
                      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
                        <div className="flex h-screen">
                          {/* Desktop Sidebar */}
                          {!isMobile && (
                            <motion.aside
                              initial={{ x: -100, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300"
                            >
                              <div className="p-6">
                                <div className="flex items-center gap-3 mb-8">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">WellnessHub</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Your health companion</p>
                                  </div>
                                </div>

                                <nav className="space-y-2">
                                  {navigationItems.map((item) => (
                                    <Button
                                      key={item.id}
                                      variant={currentScreen === item.id ? "secondary" : "ghost"}
                                      className={cn(
                                        "w-full justify-start gap-3 h-12",
                                        currentScreen === item.id && "bg-blue-50 border border-blue-200"
                                      )}
                                      onClick={() => setCurrentScreen(item.id)}
                                    >
                                      <item.icon className={cn("w-5 h-5", item.color)} />
                                      {item.label}
                                    </Button>
                                  ))}
                                </nav>
                              </div>
                            </motion.aside>
                          )}

                          {/* Main Content */}
                          <main className="flex-1 overflow-hidden">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={currentScreen}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full overflow-y-auto"
                              >
                                {renderCurrentScreen()}
                              </motion.div>
                            </AnimatePresence>
                          </main>

                          {/* Mobile Bottom Navigation */}
                          {isMobile && (
                            <motion.nav
                              initial={{ y: 100, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-2 py-2 z-50"
                            >
                              <div className="flex justify-around">
                                {navigationItems.filter(item => item.id !== 'settings').map((item) => (
                                  <Button
                                    key={item.id}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                      "flex flex-col items-center gap-1 h-auto py-2 px-1",
                                      currentScreen === item.id && "text-blue-600"
                                    )}
                                    onClick={() => setCurrentScreen(item.id)}
                                  >
                                    <item.icon className={cn(
                                      "w-4 h-4",
                                      currentScreen === item.id ? "text-blue-600" : item.color
                                    )} />
                                    <span className="text-xs">{item.label.split(' ')[0]}</span>
                                  </Button>
                                ))}
                              </div>
                            </motion.nav>
                          )}
                        </div>
                        <Toaster />
                      </div>
                    </PointsProvider>
                  </CommunityProvider>
                </MentalWellbeingProvider>
              </JournalProvider>
            </MoodProvider>
          </WorkoutProvider>
        </WaterIntakeProvider>
      </MealPlannerProvider>
    </MealProvider>
        </LanguageProvider>
      </ThemeProvider>
  );
}
