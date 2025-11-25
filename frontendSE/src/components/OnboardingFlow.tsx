import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Heart, Target, User, Stethoscope, CheckCircle, AlertCircle, Sparkles, Activity, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { ImageWithFallback } from './figma/ImageWithFallback';
import BMICalculator from './BMICalculator';
import { api } from "../api/index";
import { updateProfile } from "../api/index";



interface OnboardingProps {
  onComplete: (profile: any) => void;
}

const welcomeSteps = [
  {
    title: "Welcome to WellnessHub",
    subtitle: "Your personal health and wellness companion",
    description: "We're here to support your journey to better physical health, nutrition, and mental wellbeing.",
    image: "https://images.unsplash.com/photo-1687180948607-9ba1dd045e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjBjYWxtfGVufDF8fHx8MTc1Njc5MjM1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    icon: Heart,
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    title: "Holistic Wellness",
    subtitle: "Mind, body, and spirit in harmony",
    description: "Track your nutrition, plan workouts, practice mindfulness, and connect with a supportive community.",
    image: "https://images.unsplash.com/photo-1701416050721-2e8a9f765ac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcGVhY2VmdWwlMjBuYXR1cmV8ZW58MXx8fHwxNzU2NzkyMzUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: Target,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: "Personalized Experience",
    subtitle: "Tailored just for you",
    description: "Let's learn about you to create a personalized wellness plan that fits your lifestyle and goals.",
    image: "https://images.unsplash.com/photo-1733747660804-5a02541ba8dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMGV4ZXJjaXNlfGVufDF8fHx8MTc1Njc4NTYxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    icon: User,
    gradient: 'from-orange-500 to-pink-500',
  },
];

const goalOptions = [
  { id: 'weight-loss', label: 'Weight Loss', icon: '🏃‍♀️', description: 'Lose weight safely and sustainably' },
  { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪', description: 'Build strength and muscle mass' },
  { id: 'mental-wellness', label: 'Mental Wellness', icon: '🧘‍♀️', description: 'Improve mental health and mindfulness' },
  { id: 'nutrition', label: 'Better Nutrition', icon: '🥗', description: 'Develop healthy eating habits' },
  { id: 'fitness', label: 'Overall Fitness', icon: '🏋️‍♂️', description: 'Improve general fitness and health' },
  { id: 'stress-relief', label: 'Stress Relief', icon: '😌', description: 'Manage stress and anxiety' },
];

const commonConditions = [
  'Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'Depression', 'Anxiety',
  'Heart Disease', 'High Cholesterol', 'Sleep Disorders', 'Allergies'
];

export default function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [welcomeSubStep, setWelcomeSubStep] = useState(0);
  const [showWelcomeSlides, setShowWelcomeSlides] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    lifestyle: { sitting: 50, standing: 20, walking: 20, intense: 10 },
    goals: [] as string[],
    medicalConditions: [] as string[],
    medications: '',
  });
  const [validationError, setValidationError] = useState('');

  const totalSteps = 4; // Profile, goals, BMI calculator, medical

  // Auto-advance through welcome slides
   useEffect(() => {
    if (showWelcomeSlides && welcomeSubStep < welcomeSteps.length - 1) {
      const timer = setTimeout(() => {
        setWelcomeSubStep((prev) => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [welcomeSubStep, showWelcomeSlides]);

  const validateProfileStep = () => {
    if (!profile.name.trim()) return setError("Please enter your name");
    if (!profile.age || Number(profile.age) <= 0) return setError("Enter valid age");
    if (!profile.gender) return setError("Please select gender");
    if (!profile.height || Number(profile.height) <= 0) return setError("Enter valid height");
    if (!profile.weight || Number(profile.weight) <= 0) return setError("Enter valid weight");
    return true;
  };

   const validateGoalsStep = () => {
    if (profile.goals.length === 0) return setError("Select at least one goal");
    return true;
  };
   const setError = (msg: string) => {
    setValidationError(msg);
    return false;
  };
  const handleStartJourney = () => {
    setShowWelcomeSlides(false);
  };

  const nextStep = async () => {
    setValidationError("");

    if (currentStep === 0 && !validateProfileStep()) return;
    if (currentStep === 1 && !validateGoalsStep()) return;

    // Final step → save to backend
    if (currentStep === totalSteps - 1) {
      await finishOnboarding();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

    const updateLifestyle = (type: string, value: number[]) => {
    setProfile((prev) => ({
      ...prev,
      lifestyle: { ...prev.lifestyle, [type]: value[0] },
    }));
  };

  const toggleGoal = (goalId: string) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const toggleCondition = (condition: string) => {
    setProfile((prev) => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(condition)
        ? prev.medicalConditions.filter((c) => c !== condition)
        : [...prev.medicalConditions, condition],
    }));
  };


    // --------------------------
  // 🔥 FINISH ONBOARDING (IMPORTANT)
  // --------------------------
// inside the component

  // =============== ⭐ FINAL SUBMIT FUNCTION (IMPORTANT) ===============
 // inside OnboardingFlow: final submit
const finishOnboarding = async () => {
  setValidationError('');

  const finalProfile = {
    ...profile,
    age: Number(profile.age),
    height: Number(profile.height),
    weight: Number(profile.weight),
    medications: profile.medications
      .split(',')
      .map((m: string) => m.trim())
      .filter(Boolean),
    isOnboarded: true,
  };

  try {
    const token = localStorage.getItem('token') || undefined;
    const res = await updateProfile(finalProfile, token); // uses function from api/index.ts
    // If backend returns { user }, use it; otherwise fallback to finalProfile
    const returnedUser = (res && res.user) ? res.user : finalProfile;
    // notify App and pass returned user so App can merge properly
    onComplete(returnedUser);
  } catch (err: any) {
    console.error("Onboarding save failed:", err);
    setValidationError(err?.message || "Failed to save profile. Try again.");
  }
};



  const renderWelcomeSlides = () => {
    const floatingIcons = [
      { icon: Heart, color: 'text-pink-500', position: 'top-1/4 left-1/4' },
      { icon: Sparkles, color: 'text-yellow-500', position: 'top-1/3 right-1/4' },
      { icon: Activity, color: 'text-green-500', position: 'bottom-1/3 left-1/3' },
      { icon: Zap, color: 'text-blue-500', position: 'bottom-1/4 right-1/3' },
    ];

    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          />

          {/* Floating Icons */}
          {floatingIcons.map((element, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
              className={`absolute ${element.position}`}
            >
              <element.icon className={`w-12 h-12 ${element.color} opacity-40`} />
            </motion.div>
          ))}

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={welcomeSubStep}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl w-full text-center"
            >
              <div className="relative mb-12">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                  className="w-48 h-48 mx-auto mb-8 rounded-[3rem] overflow-hidden shadow-2xl"
                >
                  <ImageWithFallback
                    src={welcomeSteps[welcomeSubStep].image}
                    alt={welcomeSteps[welcomeSubStep].title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r ${welcomeSteps[welcomeSubStep].gradient} rounded-3xl flex items-center justify-center shadow-2xl`}
                >
                  {React.createElement(welcomeSteps[welcomeSubStep].icon, {
                    className: "w-10 h-10 text-white"
                  })}
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"
              >
                {welcomeSteps[welcomeSubStep].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className={`text-xl md:text-2xl font-medium bg-gradient-to-r ${welcomeSteps[welcomeSubStep].gradient} bg-clip-text text-transparent mb-6`}
              >
                {welcomeSteps[welcomeSubStep].subtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-gray-600 text-lg mb-12 leading-relaxed max-w-xl mx-auto"
              >
                {welcomeSteps[welcomeSubStep].description}
              </motion.p>

              {welcomeSubStep === welcomeSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button 
                    onClick={handleStartJourney} 
                    size="lg"
                    className={`px-12 py-6 text-lg bg-gradient-to-r ${welcomeSteps[welcomeSubStep].gradient} hover:opacity-90 shadow-2xl`}
                  >
                    Start Your Journey
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex justify-center mt-12 gap-3"
              >
                {welcomeSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === welcomeSubStep 
                        ? `w-12 bg-gradient-to-r ${welcomeSteps[welcomeSubStep].gradient}` 
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderProfileStep = () => {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="max-w-2xl w-full"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-6 h-6 text-blue-500" />
                Tell us about yourself
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, name: e.target.value }));
                      setValidationError('');
                    }}
                    placeholder="Your name"
                    className={!profile.name && validationError ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="age">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, age: e.target.value }));
                      setValidationError('');
                    }}
                    placeholder="25"
                    className={!profile.age && validationError ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <select
                    className={`w-full p-2 border rounded-md ${!profile.gender && validationError ? 'border-red-500' : 'border-gray-300'}`}
                    value={profile.gender}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, gender: e.target.value }));
                      setValidationError('');
                    }}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="height">
                    Height (cm) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, height: e.target.value }));
                      setValidationError('');
                    }}
                    placeholder="170"
                    className={!profile.height && validationError ? 'border-red-500' : ''}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="weight">
                    Weight (kg) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => {
                      setProfile(prev => ({ ...prev, weight: e.target.value }));
                      setValidationError('');
                    }}
                    placeholder="70"
                    className={!profile.weight && validationError ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              <div>
                <Label className="text-base mb-4 block">Lifestyle Activity Levels (%)</Label>
                <div className="space-y-4">
                  {Object.entries(profile.lifestyle).map(([type, value]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize">{type === 'intense' ? 'Intense Work' : type}</span>
                        <span>{value}%</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={(newValue) => updateLifestyle(type, newValue)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> All fields marked with <span className="text-red-500">*</span> are required to continue.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  const renderGoalsStep = () => {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="max-w-4xl w-full"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-green-500" />
                What are your wellness goals? <span className="text-red-500">*</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Select at least one goal to continue
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goalOptions.map((goal) => (
                  <motion.div
                    key={goal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      profile.goals.includes(goal.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{goal.icon}</div>
                      <h3 className="font-medium mb-1">{goal.label}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                      {profile.goals.includes(goal.id) && (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  const renderMedicalStep = () => {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="max-w-4xl w-full"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-purple-500" />
                Medical Information (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base mb-3 block">Do you have any of these conditions?</Label>
                <div className="flex flex-wrap gap-2">
                  {commonConditions.map((condition) => (
                    <Badge
                      key={condition}
                      variant={profile.medicalConditions.includes(condition) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCondition(condition)}
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="medications">Current Medications (comma separated)</Label>
                <Textarea
                  id="medications"
                  value={profile.medications}
                  onChange={(e) => setProfile(prev => ({ ...prev, medications: e.target.value }))}
                  placeholder="e.g., Aspirin, Vitamin D, Metformin"
                  className="mt-2"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Privacy Note:</strong> This information helps us provide better recommendations 
                  but is completely optional. All data is kept secure and private.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  const renderStep = () => {
    if (currentStep === 0) {
      return renderProfileStep();
    } else if (currentStep === 1) {
      return renderGoalsStep();
    } else if (currentStep === 2) {
      return <BMICalculator profile={profile} />;
    } else {
      return renderMedicalStep();
    }
  };

  if (showWelcomeSlides) {
    return renderWelcomeSlides();
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div key={currentStep}>
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-50"
      >
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={nextStep} className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
          {currentStep === totalSteps - 1 ? "Complete Setup" : "Next"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg z-50"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
