  import React, { useState, useEffect } from 'react';
  import { motion, AnimatePresence } from 'motion/react';
  import { Home, Apple, Dumbbell, Heart, Users, Settings, MessageSquare, ShoppingBag } from 'lucide-react';
  import { Button } from './components/ui/button';
  import { cn } from './components/ui/utils';
  import { Toaster } from './components/ui/sonner';

  // Contexts
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

  // Pages
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

  // API
  import { api } from './api/index';

  // --------------------
  // USER PROFILE MODEL
  // --------------------
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

  // --------------------
  // MAIN APP
  // --------------------
  export default function App() {

    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
    const [currentScreen, setCurrentScreen] = useState('dashboard');
    const [isMobile, setIsMobile] = useState(false);

    // Mobile check
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ----------------------------------------
    // 🔥 AUTO LOGIN CHECK USING TOKEN
    // ----------------------------------------
  // AUTO LOGIN CHECK USING TOKEN
  useEffect(() => {
    async function verifyToken() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.me(token);

        if (res.user) {
          setUserProfile({
            ...initialUserProfile,
            name: res.user.name || "",
            email: res.user.email || "",
            age: res.user.age || 0,
            gender: res.user.gender || "",
            height: res.user.height || 0,
            weight: res.user.weight || 0,
            lifestyle: res.user.lifestyle || initialUserProfile.lifestyle,
            goals: res.user.goals || [],
            medicalConditions: res.user.medicalConditions || [],
            medications: res.user.medications || [],
            isOnboarded: res.user.isOnboarded || false,   // 🔥 KEY LINE
          });
        }
      } catch (err) {
        localStorage.removeItem("token");
      }

      setLoading(false);
    }

    verifyToken();
  }, []);



    // Show loading
    if (loading) return <div>Loading...</div>;

    const token = localStorage.getItem("token");

    // ----------------------------------------
    // 🔥 IF NO TOKEN → SHOW LOGIN PAGE
    // ----------------------------------------
    if (!token) {
      return (
        <ThemeProvider>
          <LanguageProvider>
            <LoginPage />
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      );
    }

    // ----------------------------------------
    // 🔥 SIGNUP USERS ONLY → ONBOARDING FLOW
    // ----------------------------------------
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
                            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
                              <OnboardingFlow
  onComplete={async (profile) => {
    const token = localStorage.getItem("token");
    // profile is the returned user object from backend or finalProfile fallback
    const finalProfile = {
      ...userProfile, // keep existing fields (email, _id, etc.)
      ...profile,
      isOnboarded: true,
      height: Number(profile.height) || userProfile.height,
      weight: Number(profile.weight) || userProfile.weight,
      age: Number(profile.age) || userProfile.age,
    };

    // try to save on backend again (idempotent) and prefer backend response
    try {
      const res = await api.updateProfile(finalProfile, token);
      const updated = res?.user ? res.user : finalProfile;
      setUserProfile(updated);
    } catch (err) {
      console.error("Failed to persist profile from App:", err);
      setUserProfile(finalProfile); // still set front-end
    }

    setCurrentScreen("dashboard");
  }}
/>


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

    // ----------------------------------------
    // MAIN DASHBOARD APP
    // ----------------------------------------
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

    const renderCurrentScreen = () => {
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

                            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
                              <div className="flex h-screen">

                                {/* Sidebar */}
                                {!isMobile && (
                                  <motion.aside
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="w-64 bg-white dark:bg-slate-800 backdrop-blur-sm border-r shadow-sm"
                                  >
                                    <div className="p-6">
                                      <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                                          <Heart className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                          <h1 className="text-xl font-semibold">WellnessHub</h1>
                                          <p className="text-sm text-gray-500">Your health companion</p>
                                        </div>
                                      </div>

                                      <nav className="space-y-2">
                                        {navigationItems.map((item) => (
                                          <Button
                                            key={item.id}
                                            variant={currentScreen === item.id ? "secondary" : "ghost"}
                                            className="w-full justify-start gap-3"
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

                                {/* Bottom Navigation (mobile) */}
                                {isMobile && (
                                  <motion.nav
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="fixed bottom-0 left-0 right-0 bg-white border-t p-2"
                                  >
                                    <div className="flex justify-around">
                                      {navigationItems.map((item) => (
                                        <Button
                                          key={item.id}
                                          variant="ghost"
                                          size="sm"
                                          className="flex flex-col items-center gap-1"
                                          onClick={() => setCurrentScreen(item.id)}
                                        >
                                          <item.icon className="w-4 h-4" />
                                          <span className="text-xs">{item.label}</span>
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
