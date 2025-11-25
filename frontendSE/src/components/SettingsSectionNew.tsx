import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, User, Bell, Shield, Palette, Moon, Sun,
  Globe, Download, Trash2, Eye, EyeOff, Lock, Mail,
  Phone, Calendar, TrendingUp, BarChart3, PieChart,
  Activity, Target, Heart, Zap, Save, Edit, Plus, X,
  Check, AlertCircle, FileText, HelpCircle, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useTheme } from './utils/themeContext';
import { useLanguage } from './utils/languageContext';
import LegalDocumentViewer from './LegalDocumentViewer';
import { legalDocuments, LegalDocument } from './utils/legalDocuments';

interface SettingsSectionProps {
  userProfile: any;
  setUserProfile: (profile: any) => void;
}

interface Goal {
  id: string;
  goal: string;
  target: number;
  current: number;
  unit: string;
}

interface PersonalRecord {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: string;
  notes: string;
}

const analyticsData = {
  weekly: [
    { day: 'Mon', calories: 2100, workouts: 1, mood: 7, weight: 70.2 },
    { day: 'Tue', calories: 1950, workouts: 0, mood: 6, weight: 70.1 },
    { day: 'Wed', calories: 2200, workouts: 1, mood: 8, weight: 70.0 },
    { day: 'Thu', calories: 2000, workouts: 1, mood: 7, weight: 69.9 },
    { day: 'Fri', calories: 2150, workouts: 0, mood: 6, weight: 69.8 },
    { day: 'Sat', calories: 2300, workouts: 2, mood: 9, weight: 69.7 },
    { day: 'Sun', calories: 2050, workouts: 1, mood: 8, weight: 69.6 },
  ],
  monthly: [
    { month: 'Jan', avgCalories: 2050, totalWorkouts: 20, avgMood: 6.8, weightLoss: 1.2 },
    { month: 'Feb', avgCalories: 2100, totalWorkouts: 22, avgMood: 7.1, weightLoss: 1.5 },
    { month: 'Mar', avgCalories: 2080, totalWorkouts: 25, avgMood: 7.4, weightLoss: 1.8 },
    { month: 'Apr', avgCalories: 2120, totalWorkouts: 24, avgMood: 7.6, weightLoss: 2.1 },
    { month: 'May', avgCalories: 2090, totalWorkouts: 26, avgMood: 7.8, weightLoss: 2.4 },
    { month: 'Jun', avgCalories: 2110, totalWorkouts: 28, avgMood: 8.0, weightLoss: 2.6 },
  ],
  categories: [
    { name: 'Nutrition', value: 85, color: '#10B981' },
    { name: 'Fitness', value: 78, color: '#3B82F6' },
    { name: 'Mental Health', value: 82, color: '#8B5CF6' },
    { name: 'Sleep', value: 75, color: '#F59E0B' },
  ]
};

export default function SettingsSection({ userProfile, setUserProfile }: SettingsSectionProps) {
  const { theme, setTheme: setGlobalTheme } = useTheme();
  const { language, setLanguage: setGlobalLanguage, t } = useLanguage();
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [email, setEmail] = useState(userProfile.email || 'user@wellnesshub.com');
  
  // Goals state
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', goal: 'Weight Loss', target: 5, current: 2.6, unit: 'kg' },
    { id: '2', goal: 'Weekly Workouts', target: 5, current: 6, unit: 'sessions' },
    { id: '3', goal: 'Daily Calories', target: 2000, current: 2100, unit: 'cal' },
    { id: '4', goal: 'Meditation Days', target: 30, current: 12, unit: 'days' },
  ]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Goal>({
    id: '',
    goal: '',
    target: 0,
    current: 0,
    unit: ''
  });

  // Personal Records state
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([
    { id: '1', type: 'Max Bench Press', value: 100, unit: 'kg', date: '2025-10-15', notes: 'New PR!' },
    { id: '2', type: 'Fastest 5K', value: 22.5, unit: 'minutes', date: '2025-10-20', notes: 'Beat previous time by 2 min' },
    { id: '3', type: 'Lowest Weight', value: 69.6, unit: 'kg', date: '2025-10-28', notes: 'Down 5kg from start!' },
  ]);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PersonalRecord | null>(null);
  const [newRecord, setNewRecord] = useState<PersonalRecord>({
    id: '',
    type: '',
    value: 0,
    unit: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Preferences state
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: true,
    communityMessages: false,
    expertTips: true,
    weeklyReports: true,
  });
  
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'friends',
    shareProgress: true,
    showInLeaderboard: true,
    dataSharing: false,
  });

  // Analytics state
  const [analyticsRange, setAnalyticsRange] = useState<'week' | 'month' | '6months'>('week');

  // Legal document viewer state
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);

  const handleSaveProfile = () => {
    setUserProfile(tempProfile);
    setEditingProfile(false);
    toast.success(language === 'fr' ? 'Profil mis à jour avec succès!' : 'Profile updated successfully!', {
      description: language === 'fr' ? 'Vos modifications ont été enregistrées.' : 'Your profile changes have been saved.',
    });
  };

  const handleCancelEdit = () => {
    setTempProfile(userProfile);
    setEditingProfile(false);
  };

  const handleUpdateGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal(goal);
    setGoalDialogOpen(true);
  };

  const handleSaveGoal = () => {
    if (editingGoal) {
      setGoals(goals.map(g => g.id === newGoal.id ? newGoal : g));
      toast.success(language === 'fr' ? 'Objectif mis à jour!' : 'Goal updated!', {
        description: `${newGoal.goal} ${language === 'fr' ? 'a été mis à jour.' : 'has been updated.'}`,
      });
    } else {
      setGoals([...goals, { ...newGoal, id: Date.now().toString() }]);
      toast.success(language === 'fr' ? 'Objectif ajouté!' : 'Goal added!', {
        description: `${newGoal.goal} ${language === 'fr' ? 'a été ajouté à vos objectifs.' : 'has been added to your goals.'}`,
      });
    }
    setGoalDialogOpen(false);
    setEditingGoal(null);
    setNewGoal({ id: '', goal: '', target: 0, current: 0, unit: '' });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
    toast.success(language === 'fr' ? 'Objectif supprimé' : 'Goal removed', {
      description: language === 'fr' ? "L'objectif a été supprimé de votre liste." : 'The goal has been removed from your list.',
    });
  };

  // Personal Records handlers
  const handleUpdateRecord = (record: PersonalRecord) => {
    setEditingRecord(record);
    setNewRecord(record);
    setRecordDialogOpen(true);
  };

  const handleSaveRecord = () => {
    if (editingRecord) {
      setPersonalRecords(personalRecords.map(r => r.id === newRecord.id ? newRecord : r));
      toast.success(language === 'fr' ? 'Record mis à jour!' : 'Record updated!', {
        description: `${newRecord.type} ${language === 'fr' ? 'a été mis à jour.' : 'has been updated.'}`,
      });
    } else {
      setPersonalRecords([...personalRecords, { ...newRecord, id: Date.now().toString() }]);
      toast.success(language === 'fr' ? 'Record ajouté!' : 'Record added!', {
        description: `${newRecord.type} ${language === 'fr' ? 'a été ajouté!' : 'has been added!'}`,
      });
    }
    setRecordDialogOpen(false);
    setEditingRecord(null);
    setNewRecord({ id: '', type: '', value: 0, unit: '', date: new Date().toISOString().split('T')[0], notes: '' });
  };

  const handleDeleteRecord = (recordId: string) => {
    setPersonalRecords(personalRecords.filter(r => r.id !== recordId));
    toast.success(language === 'fr' ? 'Record supprimé' : 'Record removed', {
      description: language === 'fr' ? 'Le record a été supprimé de votre liste.' : 'The record has been removed from your list.',
    });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setGlobalTheme(newTheme);
    toast.success(language === 'fr' ? 'Thème mis à jour' : 'Theme updated', {
      description: language === 'fr' 
        ? `Thème changé en mode ${newTheme === 'light' ? 'clair' : newTheme === 'dark' ? 'sombre' : 'automatique'}.`
        : `Theme changed to ${newTheme} mode.`,
    });
  };

  const handleUnitsChange = (newUnits: 'metric' | 'imperial') => {
    setUnits(newUnits);
    toast.success(language === 'fr' ? 'Unités mises à jour' : 'Units updated', {
      description: language === 'fr' 
        ? `Unités changées en ${newUnits === 'metric' ? 'métrique' : 'impérial'}.`
        : `Units changed to ${newUnits}.`,
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setGlobalLanguage(newLanguage as any);
    toast.success(newLanguage === 'fr' ? 'Langue mise à jour' : 'Language updated', {
      description: newLanguage === 'fr' 
        ? 'Votre préférence de langue a été enregistrée.'
        : 'Your language preference has been saved.',
    });
  };

  const handleNotificationToggle = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success(language === 'fr' ? 'Paramètres de notification mis à jour' : 'Notification settings updated', {
      description: `${key.replace(/([A-Z])/g, ' $1').trim()} ${value ? (language === 'fr' ? 'activé' : 'enabled') : (language === 'fr' ? 'désactivé' : 'disabled')}.`,
    });
  };

  const handleExportData = () => {
    toast.success(language === 'fr' ? 'Export des données...' : 'Exporting data...', {
      description: language === 'fr' ? 'Votre export de données sera prêt dans un instant.' : 'Your data export will be ready in a moment.',
    });
    
    setTimeout(() => {
      const dataStr = JSON.stringify({
        profile: userProfile,
        goals,
        personalRecords,
        analytics: analyticsData,
        preferences: { notifications, theme, language, units, privacy }
      }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'wellnesshub-data.json';
      link.click();
      toast.success(language === 'fr' ? 'Données exportées!' : 'Data exported!', {
        description: language === 'fr' ? 'Vos données ont été téléchargées avec succès.' : 'Your data has been downloaded successfully.',
      });
    }, 1500);
  };

  const handleDeleteAccount = () => {
    toast.error(language === 'fr' ? 'Suppression de compte demandée' : 'Account deletion requested', {
      description: language === 'fr' 
        ? 'Cette fonctionnalité serait connectée à l\'authentification backend.'
        : 'This feature would be connected to backend authentication.',
    });
  };

  const openLegalDocument = (docId: string) => {
    const doc = legalDocuments[docId];
    if (doc) {
      setSelectedDocument(doc);
      setDocumentViewerOpen(true);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl">{t('settings')} & {t('analytics')}</h1>
          <p className="text-gray-600">
            {language === 'fr' 
              ? 'Gérez vos préférences et suivez vos progrès'
              : 'Manage your preferences and track your progress'}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExportData}>
          <Download className="w-4 h-4" />
          {t('exportData')}
        </Button>
      </motion.div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
          <TabsTrigger value="privacy">{t('privacy')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    {t('profileInformation')}
                  </CardTitle>
                  <Button
                    onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                    className="gap-2"
                  >
                    {editingProfile ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {editingProfile ? t('saveChanges') : t('editProfile')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t('name')}</Label>
                      <Input
                        id="name"
                        value={tempProfile.name}
                        onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">{t('age')}</Label>
                      <Input
                        id="age"
                        type="number"
                        value={tempProfile.age}
                        onChange={(e) => setTempProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                        disabled={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">{t('gender')}</Label>
                      <Select 
                        value={tempProfile.gender} 
                        onValueChange={(value) => setTempProfile(prev => ({ ...prev, gender: value }))}
                        disabled={!editingProfile}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'fr' ? 'Sélectionner le genre' : 'Select gender'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{language === 'fr' ? 'Homme' : 'Male'}</SelectItem>
                          <SelectItem value="female">{language === 'fr' ? 'Femme' : 'Female'}</SelectItem>
                          <SelectItem value="non-binary">{language === 'fr' ? 'Non-binaire' : 'Non-binary'}</SelectItem>
                          <SelectItem value="prefer-not-to-say">{language === 'fr' ? 'Préfère ne pas dire' : 'Prefer not to say'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="height">{t('height')} ({units === 'metric' ? 'cm' : 'ft'})</Label>
                      <Input
                        id="height"
                        type="number"
                        value={tempProfile.height}
                        onChange={(e) => setTempProfile(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                        disabled={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">{t('weight')} ({units === 'metric' ? 'kg' : 'lbs'})</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={tempProfile.weight}
                        onChange={(e) => setTempProfile(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                        disabled={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!editingProfile}
                      />
                      {userProfile.loginMethod && (
                        <p className="text-xs text-gray-500 mt-1">
                          {language === 'fr' ? 'Connecté avec' : 'Signed in with'} {userProfile.loginMethod === 'google' ? 'Google' : 'Email'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {editingProfile && (
                  <div className="flex gap-3 mt-6 pt-6 border-t">
                    <Button onClick={handleSaveProfile} className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      {t('saveChanges')}
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      {t('cancel')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Goals Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    {t('yourGoals')}
                  </CardTitle>
                  <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingGoal(null);
                          setNewGoal({ id: '', goal: '', target: 0, current: 0, unit: '' });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('addGoal')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingGoal ? t('editGoal') : t('addGoal')}</DialogTitle>
                        <DialogDescription>
                          {editingGoal 
                            ? (language === 'fr' ? 'Mettre à jour les détails de votre objectif.' : 'Update your goal details.')
                            : (language === 'fr' ? 'Définir un nouvel objectif pour suivre vos progrès.' : 'Set a new goal to track your progress.')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="goal-name">{t('goalName')}</Label>
                          <Input
                            id="goal-name"
                            value={newGoal.goal}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, goal: e.target.value }))}
                            placeholder={language === 'fr' ? 'ex., Perte de poids, Distance de course' : 'e.g., Weight Loss, Running Distance'}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="goal-target">{t('target')}</Label>
                            <Input
                              id="goal-target"
                              type="number"
                              value={newGoal.target}
                              onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="goal-current">{t('current')}</Label>
                            <Input
                              id="goal-current"
                              type="number"
                              value={newGoal.current}
                              onChange={(e) => setNewGoal(prev => ({ ...prev, current: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="goal-unit">{t('unit')}</Label>
                          <Input
                            id="goal-unit"
                            value={newGoal.unit}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                            placeholder={language === 'fr' ? 'ex., kg, sessions, jours' : 'e.g., kg, sessions, days'}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>
                          {t('cancel')}
                        </Button>
                        <Button onClick={handleSaveGoal} disabled={!newGoal.goal || !newGoal.unit}>
                          {editingGoal ? (language === 'fr' ? 'Mettre à jour' : 'Update') : (language === 'fr' ? 'Ajouter' : 'Add')} {language === 'fr' ? "l'objectif" : 'Goal'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{goal.goal}</span>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-semibold">{goal.current}</span>
                            <span className="text-gray-500">/{goal.target} {goal.unit}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleUpdateGoal(goal)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <X className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {language === 'fr' ? 'Supprimer l\'objectif?' : 'Delete Goal?'}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {language === 'fr' 
                                      ? `Êtes-vous sûr de vouloir supprimer "${goal.goal}"? Cette action ne peut pas être annulée.`
                                      : `Are you sure you want to delete "${goal.goal}"? This action cannot be undone.`}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteGoal(goal.id)}>
                                    {t('delete')}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={(goal.current / goal.target) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-gray-500">
                        {((goal.current / goal.target) * 100).toFixed(1)}% {language === 'fr' ? 'terminé' : 'complete'}
                      </div>
                    </div>
                  ))}
                  
                  {goals.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{language === 'fr' ? 'Aucun objectif défini pour le moment. Ajoutez votre premier objectif pour commencer à suivre!' : 'No goals set yet. Add your first goal to start tracking!'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    {t('personalRecords')}
                  </CardTitle>
                  <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingRecord(null);
                          setNewRecord({ id: '', type: '', value: 0, unit: '', date: new Date().toISOString().split('T')[0], notes: '' });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('addRecord')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingRecord 
                            ? (language === 'fr' ? 'Modifier le record' : 'Edit Record')
                            : t('addRecord')}
                        </DialogTitle>
                        <DialogDescription>
                          {editingRecord 
                            ? (language === 'fr' ? 'Mettre à jour les détails de votre record.' : 'Update your record details.')
                            : (language === 'fr' ? 'Ajouter un nouveau record personnel.' : 'Add a new personal record.')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="record-type">{t('recordType')}</Label>
                          <Input
                            id="record-type"
                            value={newRecord.type}
                            onChange={(e) => setNewRecord(prev => ({ ...prev, type: e.target.value }))}
                            placeholder={language === 'fr' ? 'ex., Développé couché max, 5K le plus rapide' : 'e.g., Max Bench Press, Fastest 5K'}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="record-value">{t('recordValue')}</Label>
                            <Input
                              id="record-value"
                              type="number"
                              step="0.1"
                              value={newRecord.value}
                              onChange={(e) => setNewRecord(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="record-unit">{t('unit')}</Label>
                            <Input
                              id="record-unit"
                              value={newRecord.unit}
                              onChange={(e) => setNewRecord(prev => ({ ...prev, unit: e.target.value }))}
                              placeholder={language === 'fr' ? 'ex., kg, minutes' : 'e.g., kg, minutes'}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="record-date">{t('recordDate')}</Label>
                          <Input
                            id="record-date"
                            type="date"
                            value={newRecord.date}
                            onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="record-notes">{t('notes')}</Label>
                          <Input
                            id="record-notes"
                            value={newRecord.notes}
                            onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder={language === 'fr' ? 'Ajouter des notes...' : 'Add notes...'}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setRecordDialogOpen(false)}>
                          {t('cancel')}
                        </Button>
                        <Button onClick={handleSaveRecord} disabled={!newRecord.type || !newRecord.unit}>
                          {editingRecord 
                            ? (language === 'fr' ? 'Mettre à jour' : 'Update')
                            : (language === 'fr' ? 'Ajouter' : 'Add')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {personalRecords.map((record) => (
                    <div key={record.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 text-yellow-600" />
                            <span className="font-semibold">{record.type}</span>
                          </div>
                          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 mb-1">
                            {record.value} {record.unit}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{record.date}</p>
                          {record.notes && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">"{record.notes}"</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUpdateRecord(record)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <X className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {language === 'fr' ? 'Supprimer le record?' : 'Delete Record?'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {language === 'fr' 
                                    ? `Êtes-vous sûr de vouloir supprimer "${record.type}"? Cette action ne peut pas être annulée.`
                                    : `Are you sure you want to delete "${record.type}"? This action cannot be undone.`}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRecord(record.id)}>
                                  {t('delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {personalRecords.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{language === 'fr' ? 'Aucun record personnel pour le moment. Ajoutez votre premier record!' : 'No personal records yet. Add your first record!'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  {t('notificationPreferences')}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Choisissez les notifications que vous souhaitez recevoir'
                    : 'Choose what notifications you want to receive'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <Label className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'workoutReminders' && (language === 'fr' ? 'Recevoir des rappels pour les entraînements programmés' : 'Get reminded about scheduled workouts')}
                          {key === 'mealReminders' && (language === 'fr' ? 'Rappels pour enregistrer vos repas' : 'Reminders to log your meals')}
                          {key === 'progressUpdates' && (language === 'fr' ? 'Résumés hebdomadaires des progrès' : 'Weekly progress summaries')}
                          {key === 'communityMessages' && (language === 'fr' ? 'Notifications de la communauté' : 'Notifications from community')}
                          {key === 'expertTips' && (language === 'fr' ? 'Conseils de bien-être quotidiens des experts' : 'Daily wellness tips from experts')}
                          {key === 'weeklyReports' && (language === 'fr' ? 'Analyses hebdomadaires détaillées' : 'Detailed weekly analytics')}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => handleNotificationToggle(key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme and Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-500" />
                  {t('appearance')}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Personnalisez l\'apparence de l\'application'
                    : 'Customize how the app looks to you'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">{t('themePreference')}</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => handleThemeChange('light')}
                        className={`p-4 border-2 rounded-xl text-center transition-all ${
                          theme === 'light' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Sun className={`w-6 h-6 mx-auto mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                        <span className="text-sm font-medium">{t('light')}</span>
                        {theme === 'light' && <Check className="w-4 h-4 mx-auto mt-1 text-blue-600" />}
                      </button>
                      <button 
                        onClick={() => handleThemeChange('dark')}
                        className={`p-4 border-2 rounded-xl text-center transition-all ${
                          theme === 'dark' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Moon className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                        <span className="text-sm font-medium">{t('dark')}</span>
                        {theme === 'dark' && <Check className="w-4 h-4 mx-auto mt-1 text-blue-600" />}
                      </button>
                      <button 
                        onClick={() => handleThemeChange('auto')}
                        className={`p-4 border-2 rounded-xl text-center transition-all ${
                          theme === 'auto' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Settings className={`w-6 h-6 mx-auto mb-2 ${theme === 'auto' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                        <span className="text-sm font-medium">{t('auto')}</span>
                        {theme === 'auto' && <Check className="w-4 h-4 mx-auto mt-1 text-blue-600" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base mb-3 block">{t('language')}</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base mb-3 block">{t('units')}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleUnitsChange('metric')}
                        className={`p-3 border-2 rounded-lg text-center transition-all ${
                          units === 'metric' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-medium">{t('metric')}</span>
                        {units === 'metric' && <Check className="w-4 h-4 mx-auto mt-1 text-blue-600" />}
                      </button>
                      <button 
                        onClick={() => handleUnitsChange('imperial')}
                        className={`p-3 border-2 rounded-lg text-center transition-all ${
                          units === 'imperial' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-medium">{t('imperial')}</span>
                        {units === 'imperial' && <Check className="w-4 h-4 mx-auto mt-1 text-blue-600" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Time Range Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <Label>
                {language === 'fr' ? 'Plage de temps:' : 'Time Range:'}
              </Label>
              <Select value={analyticsRange} onValueChange={(value: any) => setAnalyticsRange(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">{language === 'fr' ? 'Dernière semaine' : 'Last Week'}</SelectItem>
                  <SelectItem value="month">{language === 'fr' ? 'Dernier mois' : 'Last Month'}</SelectItem>
                  <SelectItem value="6months">{language === 'fr' ? '6 mois' : '6 Months'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Overview Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl">6</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Entraînements/Semaine' : 'Workouts/Week'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl">2,100</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Calories moy.' : 'Avg Calories'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl">7.6</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Humeur moy.' : 'Avg Mood'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl">-2.6kg</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Changement de poids' : 'Weight Change'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Trends */}
          {analyticsRange === 'week' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      {language === 'fr' ? 'Progrès hebdomadaire' : 'Weekly Progress'}
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.success(
                        language === 'fr' ? 'Graphique exporté!' : 'Chart exported!', 
                        { description: language === 'fr' ? 'Le graphique des progrès hebdomadaires a été enregistré.' : 'Weekly progress chart has been saved.' }
                      )}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'fr' ? 'Exporter' : 'Export'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.weekly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="calories" stroke="#3B82F6" strokeWidth={2} name={language === 'fr' ? 'Calories' : 'Calories'} />
                        <Line type="monotone" dataKey="mood" stroke="#8B5CF6" strokeWidth={2} name={language === 'fr' ? 'Humeur' : 'Mood'} />
                        <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2} name={language === 'fr' ? 'Poids' : 'Weight'} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl text-blue-600">2,107</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'fr' ? 'Calories quotidiennes moy.' : 'Avg Daily Calories'}
                      </div>
                      <div className="text-xs text-green-600">
                        {language === 'fr' ? '+5% par rapport à la semaine dernière' : '+5% from last week'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl text-purple-600">7.3</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'fr' ? 'Score d\'humeur moy.' : 'Avg Mood Score'}
                      </div>
                      <div className="text-xs text-green-600">
                        {language === 'fr' ? '+0.4 par rapport à la semaine dernière' : '+0.4 from last week'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl text-green-600">6</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'fr' ? 'Entraînements totaux' : 'Total Workouts'}
                      </div>
                      <div className="text-xs text-green-600">
                        {language === 'fr' ? '+1 par rapport à la semaine dernière' : '+1 from last week'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Monthly Overview */}
          {(analyticsRange === 'month' || analyticsRange === '6months') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      {analyticsRange === '6months' 
                        ? (language === 'fr' ? 'Progrès sur 6 mois' : '6-Month Progress')
                        : (language === 'fr' ? 'Progrès mensuel' : 'Monthly Progress')}
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.success(
                        language === 'fr' ? 'Graphique exporté!' : 'Chart exported!', 
                        { description: language === 'fr' ? 'Le graphique des progrès mensuels a été enregistré.' : 'Monthly progress chart has been saved.' }
                      )}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'fr' ? 'Exporter' : 'Export'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.monthly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalWorkouts" fill="#3B82F6" radius={4} name={language === 'fr' ? 'Entraînements totaux' : 'Total Workouts'} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-500" />
                    {language === 'fr' ? 'Catégories de bien-être' : 'Wellness Categories'}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.success(
                      language === 'fr' ? 'Graphique exporté!' : 'Chart exported!', 
                      { description: language === 'fr' ? 'Le graphique des catégories de bien-être a été enregistré.' : 'Wellness categories chart has been saved.' }
                    )}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'fr' ? 'Exporter' : 'Export'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analyticsData.categories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analyticsData.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    {analyticsData.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className="font-semibold">{category.value}%</span>
                        </div>
                        <Progress value={category.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  {language === 'fr' ? 'Confidentialité et sécurité' : 'Privacy & Security'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Contrôlez vos préférences de confidentialité et de partage de données'
                    : 'Control your privacy and data sharing preferences'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">
                      {language === 'fr' ? 'Visibilité du profil' : 'Profile Visibility'}
                    </Label>
                    <Select 
                      value={privacy.profileVisibility} 
                      onValueChange={(value) => {
                        setPrivacy(prev => ({ ...prev, profileVisibility: value }));
                        toast.success(
                          language === 'fr' ? 'Confidentialité mise à jour' : 'Privacy updated', 
                          { description: language === 'fr' 
                            ? `Visibilité du profil définie sur ${value === 'public' ? 'public' : value === 'friends' ? 'amis' : 'privé'}.` 
                            : `Profile visibility set to ${value}.` 
                          }
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          {language === 'fr' ? 'Public - Tout le monde peut voir' : 'Public - Anyone can see'}
                        </SelectItem>
                        <SelectItem value="friends">
                          {language === 'fr' ? 'Amis uniquement' : 'Friends Only'}
                        </SelectItem>
                        <SelectItem value="private">
                          {language === 'fr' ? 'Privé - Moi uniquement' : 'Private - Only me'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <Label>
                          {language === 'fr' ? 'Partager les mises à jour de progrès' : 'Share Progress Updates'}
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === 'fr' 
                            ? 'Permettre aux autres de voir vos réalisations'
                            : 'Allow others to see your achievements'}
                        </p>
                      </div>
                      <Switch
                        checked={privacy.shareProgress}
                        onCheckedChange={(checked) => {
                          setPrivacy(prev => ({ ...prev, shareProgress: checked }));
                          toast.success(
                            language === 'fr' ? 'Confidentialité mise à jour' : 'Privacy updated', 
                            { 
                              description: language === 'fr'
                                ? `Partage des progrès ${checked ? 'activé' : 'désactivé'}.`
                                : `Progress sharing ${checked ? 'enabled' : 'disabled'}.` 
                            }
                          );
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <Label>
                          {language === 'fr' ? 'Afficher dans le classement' : 'Show in Leaderboard'}
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === 'fr' 
                            ? 'Apparaître dans les classements de la communauté'
                            : 'Appear in community rankings'}
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showInLeaderboard}
                        onCheckedChange={(checked) => {
                          setPrivacy(prev => ({ ...prev, showInLeaderboard: checked }));
                          toast.success(
                            language === 'fr' ? 'Confidentialité mise à jour' : 'Privacy updated', 
                            { 
                              description: language === 'fr'
                                ? `Visibilité du classement ${checked ? 'activée' : 'désactivée'}.`
                                : `Leaderboard visibility ${checked ? 'enabled' : 'disabled'}.` 
                            }
                          );
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <Label>
                          {language === 'fr' ? 'Partage de données pour la recherche' : 'Data Sharing for Research'}
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === 'fr' 
                            ? 'Aider à améliorer la recherche sur le bien-être (anonymisé)'
                            : 'Help improve wellness research (anonymized)'}
                        </p>
                      </div>
                      <Switch
                        checked={privacy.dataSharing}
                        onCheckedChange={(checked) => {
                          setPrivacy(prev => ({ ...prev, dataSharing: checked }));
                          toast.success(
                            language === 'fr' ? 'Confidentialité mise à jour' : 'Privacy updated', 
                            { 
                              description: language === 'fr'
                                ? `Partage de données ${checked ? 'activé' : 'désactivé'}.`
                                : `Data sharing ${checked ? 'enabled' : 'disabled'}.` 
                            }
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'fr' ? 'Gestion des données' : 'Data Management'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Gérez vos données personnelles et la sécurité de votre compte'
                    : 'Manage your personal data and account security'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={handleExportData}
                  >
                    <Download className="w-4 h-4" />
                    {language === 'fr' ? 'Exporter toutes les données' : 'Export All Data'}
                    <span className="ml-auto text-sm text-gray-500">
                      {language === 'fr' ? 'Télécharger vos données' : 'Download your data'}
                    </span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={() => toast.info(
                      language === 'fr' ? 'Utilisation des données' : 'Data Usage', 
                      { 
                        description: language === 'fr' 
                          ? 'Cela montrerait quelles données nous collectons et comment elles sont utilisées.'
                          : 'This would show what data we collect and how it\'s used.' 
                      }
                    )}
                  >
                    <Eye className="w-4 h-4" />
                    {language === 'fr' ? 'Voir l\'utilisation des données' : 'View Data Usage'}
                    <span className="ml-auto text-sm text-gray-500">
                      {language === 'fr' ? 'Voir quelles données nous collectons' : 'See what data we collect'}
                    </span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={() => toast.info(
                      language === 'fr' ? 'Changer le mot de passe' : 'Change Password', 
                      { 
                        description: language === 'fr' 
                          ? 'Cela ouvrirait une boîte de dialogue de changement de mot de passe.'
                          : 'This would open a password change dialog.' 
                      }
                    )}
                  >
                    <Lock className="w-4 h-4" />
                    {language === 'fr' ? 'Changer le mot de passe' : 'Change Password'}
                    <span className="ml-auto text-sm text-gray-500">
                      {language === 'fr' ? 'Mettre à jour la sécurité' : 'Update security'}
                    </span>
                  </Button>
                  
                  <div className="border-t pt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full justify-start gap-3">
                          <Trash2 className="w-4 h-4" />
                          {language === 'fr' ? 'Supprimer le compte' : 'Delete Account'}
                          <span className="ml-auto text-sm">
                            {language === 'fr' ? 'Supprimer définitivement' : 'Permanently remove'}
                          </span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {language === 'fr' ? 'Êtes-vous absolument sûr?' : 'Are you absolutely sure?'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {language === 'fr' 
                              ? 'Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte et supprimera toutes vos données de nos serveurs.'
                              : 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                            {language === 'fr' ? 'Oui, supprimer mon compte' : 'Yes, delete my account'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <p className="text-xs text-gray-500 mt-2">
                      {language === 'fr' 
                        ? 'Cette action ne peut pas être annulée. Toutes vos données seront définitivement supprimées.'
                        : 'This action cannot be undone. All your data will be permanently deleted.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('legalAndSupport')}</CardTitle>
                <CardDescription>
                  {language === 'fr' ? 'Informations importantes et aide' : 'Important information and help'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => openLegalDocument('terms')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t('termsOfService')}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => openLegalDocument('privacy')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {t('privacyPolicy')}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => openLegalDocument('help')}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {t('helpCenter')}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => toast.success(
                      t('contactSupport'), 
                      { 
                        description: language === 'fr' 
                          ? 'L\'équipe d\'assistance répondra dans les 24 heures.'
                          : 'Support team will respond within 24 hours.' 
                      }
                    )}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {t('contactSupport')}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => openLegalDocument('about')}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {t('aboutUs')}
                  </Button>

                  <Button
  className="w-full bg-red-500 hover:bg-red-600 text-white mt-6"
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }}
>
  Log Out
</Button>

                </div>
                
                <div className="mt-6 pt-4 border-t text-center">
                  <p className="text-sm text-gray-500">
                    WellnessHub v2.1.0
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    © 2025 WellnessHub. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Legal Document Viewer */}
      <LegalDocumentViewer
        document={selectedDocument}
        open={documentViewerOpen}
        onClose={() => {
          setDocumentViewerOpen(false);
          setSelectedDocument(null);
        }}
      />
    </div>
  );
}
