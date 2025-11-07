import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Brain, MessageSquare, Play, Pause, Volume2, VolumeX,
  Phone, AlertTriangle, BookOpen, Smile, Meh, Frown, Sun,
  Moon, Cloud, CloudRain, Zap, Flower, Calendar, TrendingUp,
  Send, Mic, MoreHorizontal, Settings, Timer, Mail, User, CheckCircle2,
  Clock, Plus, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useMoodContext } from './utils/moodContext';
import { useJournalContext } from './utils/journalContext';
import { useMentalWellbeing } from './utils/mentalWellbeingContext';
import { toast } from 'sonner';

interface MentalWellbeingProps {
  userProfile: any;
  onNavigate?: (screen: string) => void;
}

const moodOptions = [
  { id: 'ecstatic', emoji: '😄', label: 'Ecstatic', value: 10, color: '#10B981' },
  { id: 'happy', emoji: '😊', label: 'Happy', value: 8, color: '#22C55E' },
  { id: 'content', emoji: '🙂', label: 'Content', value: 6, color: '#84CC16' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', value: 5, color: '#EAB308' },
  { id: 'sad', emoji: '😔', label: 'Sad', value: 3, color: '#F97316' },
  { id: 'depressed', emoji: '😢', label: 'Very Sad', value: 1, color: '#EF4444' },
];

const weatherMoods = [
  { id: 'sunny', icon: Sun, label: 'Sunny', color: 'text-yellow-500' },
  { id: 'cloudy', icon: Cloud, label: 'Cloudy', color: 'text-gray-500' },
  { id: 'rainy', icon: CloudRain, label: 'Rainy', color: 'text-blue-500' },
  { id: 'stormy', icon: Zap, label: 'Stormy', color: 'text-purple-500' },
];

const meditationSessions = [
  {
    id: 1,
    title: 'Morning Mindfulness',
    duration: 10,
    category: 'Mindfulness',
    instructor: 'Dr. Sarah Chen',
    description: 'Start your day with clarity and focus',
    image: 'https://images.unsplash.com/photo-1687180948607-9ba1dd045e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjBjYWxtfGVufDF8fHx8MTc1Njc5MjM1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    background: 'Forest sounds',
    audioUrl: 'https://www.youtube.com/embed/inpok4MKVLM'
  },
  {
    id: 2,
    title: 'Stress Relief',
    duration: 15,
    category: 'Relaxation',
    instructor: 'Michael Torres',
    description: 'Release tension and find inner peace',
    image: 'https://images.unsplash.com/photo-1687180948607-9ba1dd045e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjBjYWxtfGVufDF8fHx8MTc1Njc5MjM1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    background: 'Ocean waves',
    audioUrl: 'https://www.youtube.com/embed/1ZYbU82GVz4'
  },
  {
    id: 3,
    title: 'Sleep Stories',
    duration: 20,
    category: 'Sleep',
    instructor: 'Emma Johnson',
    description: 'Drift into peaceful slumber',
    image: 'https://images.unsplash.com/photo-1687180948607-9ba1dd045e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjBjYWxtfGVufDF8fHx8MTc1Njc5MjM1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    background: 'Rain sounds',
    audioUrl: 'https://www.youtube.com/embed/oz7ePzZGKpM'
  },
  {
    id: 4,
    title: 'Deep Breathing',
    duration: 5,
    category: 'Breathwork',
    instructor: 'Dr. Sarah Chen',
    description: 'Calm your mind with focused breathing',
    image: 'https://images.unsplash.com/photo-1687180948607-9ba1dd045e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjBjYWxtfGVufDF8fHx8MTc1Njc5MjM1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    background: 'Nature sounds',
    audioUrl: 'https://www.youtube.com/embed/SEfs5TJZ6Nk'
  },
  {
    id: 5,
    title: 'Anxiety Relief',
    duration: 12,
    category: 'Relaxation',
    instructor: 'Michael Torres',
    description: 'Ease anxiety and find calm',
    image: 'https://images.unsplash.com/photo-1687180948607-9ba1dd045e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjBjYWxtfGVufDF8fHx8MTc1Njc5MjM1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    background: 'Gentle rain',
    audioUrl: 'https://www.youtube.com/embed/O-6f5wQXSu8'
  },
  {
    id: 6,
    title: 'Body Scan',
    duration: 18,
    category: 'Mindfulness',
    instructor: 'Emma Johnson',
    description: 'Full body relaxation meditation',
    image: 'https://images.unsplash.com/photo-1687180948607-9ba1dd045e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjBjYWxtfGVufDF8fHx8MTc1Njc5MjM1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    background: 'Soft music',
    audioUrl: 'https://www.youtube.com/embed/15q9QGVqkN4'
  }
];

const chatMessages = [
  { id: 1, sender: 'therapist', content: 'Hello! How are you feeling today?', time: '2:30 PM', isBot: true },
  { id: 2, sender: 'user', content: 'I\'ve been feeling a bit overwhelmed lately with work.', time: '2:32 PM', isBot: false },
  { id: 3, sender: 'therapist', content: 'I understand that work can be stressful. Can you tell me more about what specifically is making you feel overwhelmed?', time: '2:33 PM', isBot: true },
  { id: 4, sender: 'user', content: 'It\'s the deadline pressure and the amount of tasks I need to complete.', time: '2:35 PM', isBot: false },
];

const moodData = [
  { day: 'Mon', mood: 7, stress: 3, energy: 6 },
  { day: 'Tue', mood: 6, stress: 5, energy: 5 },
  { day: 'Wed', mood: 8, stress: 2, energy: 8 },
  { day: 'Thu', mood: 5, stress: 6, energy: 4 },
  { day: 'Fri', mood: 7, stress: 4, energy: 7 },
  { day: 'Sat', mood: 9, stress: 1, energy: 9 },
  { day: 'Sun', mood: 8, stress: 2, energy: 8 },
];

const journalPrompts = [
  "What are three things I'm grateful for today?",
  "How did I handle stress today, and what could I do differently?",
  "What made me smile today?",
  "What's one thing I learned about myself this week?",
  "What would I tell a friend who's going through what I'm experiencing?",
];

export default function MentalWellbeing({ userProfile, onNavigate }: MentalWellbeingProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [stressLevel, setStressLevel] = useState([5]);
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMeditation, setCurrentMeditation] = useState(meditationSessions[0]);
  const [chatInput, setChatInput] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [therapyDialogOpen, setTherapyDialogOpen] = useState(false);
  const [therapyDate, setTherapyDate] = useState(new Date().toISOString().split('T')[0]);
  const [therapyTime, setTherapyTime] = useState('10:00');
  const [therapyType, setTherapyType] = useState('General Counseling');
  const [therapyNotes, setTherapyNotes] = useState('');
  
  const { addMoodEntry, getAverageMood, getMoodTrends } = useMoodContext();
  const { addJournalEntry, getTotalEntries, getStreak, getRecentEntries } = useJournalContext();
  const mentalWellbeingContext = useMentalWellbeing();
  
  const averageMood = getAverageMood();
  const moodTrendsData = getMoodTrends();
  const totalJournalEntries = getTotalEntries();
  const journalStreak = getStreak();
  const recentJournalEntries = getRecentEntries(2);
  const meditationStreak = mentalWellbeingContext.getMeditationStreak();
  const totalMeditationMinutes = mentalWellbeingContext.getTotalMeditationMinutes();
  const therapySessionsThisMonth = mentalWellbeingContext.getTherapySessionsThisMonth();
  
  const emergencyContacts = [
    {
      name: 'Kalpesh Paliwal',
      phone: '8005560634',
      email: 'klpshplwl455@gmail.com',
      role: 'Crisis Support Specialist'
    },
    {
      name: 'Aryan Tyagi',
      phone: '8755573869',
      email: 'notmearyan1@gmail.com',
      role: 'Mental Health Counselor'
    }
  ];

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // Add user message logic here
      setChatInput('');
    }
  };

  const handleSaveMoodCheckIn = () => {
    if (selectedMood) {
      addMoodEntry({
        date: new Date().toLocaleDateString(),
        mood: selectedMood,
        weather: selectedWeather || undefined,
        stressLevel: stressLevel[0],
        energyLevel: energyLevel[0],
      });
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 2000);
    }
  };

  const handleSaveJournal = () => {
    if (journalEntry.trim()) {
      addJournalEntry({
        date: new Date().toLocaleDateString(),
        content: journalEntry,
        prompt: journalPrompts[selectedPrompt],
      });
      setJournalEntry('');
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 2000);
    }
  };

  const handleAddMeditationSession = () => {
    mentalWellbeingContext.addMeditationSession({
      date: new Date().toLocaleDateString(),
      session: currentMeditation,
    });
    toast.success('Meditation session added!');
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
          <h1 className="text-2xl font-bold text-gray-900">Mental Wellbeing</h1>
          <p className="text-gray-600">Take care of your mind and emotions</p>
        </div>
        <Button variant="destructive" className="gap-2" onClick={() => setEmergencyDialogOpen(true)}>
          <Phone className="w-4 h-4" />
          Emergency Help
        </Button>
      </motion.div>

      {/* Mental Health Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{averageMood > 0 ? averageMood.toFixed(1) : 'N/A'}</div>
                <div className="text-sm text-gray-600">Avg Mood</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-600">Meditation Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-600">Therapy Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalJournalEntries}</div>
                <div className="text-sm text-gray-600">Journal Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="tracker" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tracker">Mood Tracker</TabsTrigger>
          <TabsTrigger value="therapy">Therapy Chat</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          {/* Mood Check-in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  How are you feeling today?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Mood Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Select your mood</label>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {moodOptions.map((mood) => (
                        <motion.button
                          key={mood.id}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedMood(mood.value)}
                          className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                            selectedMood === mood.value
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <span className="text-3xl mb-2">{mood.emoji}</span>
                          <span className="text-sm font-medium">{mood.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Weather Metaphor */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">What's your emotional weather?</label>
                    <div className="flex gap-3 justify-center">
                      {weatherMoods.map((weather) => {
                        const WeatherIcon = weather.icon;
                        return (
                          <motion.button
                            key={weather.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedWeather(weather.id)}
                            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                              selectedWeather === weather.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <WeatherIcon className={`w-8 h-8 mb-2 ${weather.color}`} />
                            <span className="text-sm font-medium">{weather.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stress and Energy Levels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Stress Level</label>
                      <div className="px-3">
                        <Slider
                          value={stressLevel}
                          onValueChange={setStressLevel}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Low</span>
                          <span>{stressLevel[0]}/10</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Energy Level</label>
                      <div className="px-3">
                        <Slider
                          value={energyLevel}
                          onValueChange={setEnergyLevel}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Low</span>
                          <span>{energyLevel[0]}/10</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={handleSaveMoodCheckIn}
                    disabled={!selectedMood}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {showSaveConfirmation ? '✓ Saved!' : 'Save Check-in'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mood Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Mood Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodTrendsData.length > 0 ? moodTrendsData : moodData}>
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 10]} />
                      <Line type="monotone" dataKey="mood" stroke="#EC4899" strokeWidth={2} name="Mood" />
                      <Line type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} name="Stress" />
                      <Line type="monotone" dataKey="energy" stroke="#10B981" strokeWidth={2} name="Energy" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">{averageMood > 0 ? averageMood.toFixed(1) : 'N/A'}</div>
                    <div className="text-sm text-gray-600">Average Mood</div>
                    <div className="text-xs text-gray-500">Last 7 days</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {moodTrendsData.length > 0 
                        ? (moodTrendsData.reduce((sum, d) => sum + d.stress, 0) / moodTrendsData.length).toFixed(1)
                        : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Average Stress</div>
                    <div className="text-xs text-gray-500">Last 7 days</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {moodTrendsData.length > 0 
                        ? (moodTrendsData.reduce((sum, d) => sum + d.energy, 0) / moodTrendsData.length).toFixed(1)
                        : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Average Energy</div>
                    <div className="text-xs text-gray-500">Last 7 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="therapy" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <MessageSquare className="w-16 h-16 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Therapy Chat</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Connect with our AI wellness companion for guided support and therapeutic conversations in a dedicated, distraction-free environment.
              </p>
              <Button 
                onClick={() => onNavigate?.('therapy')}
                className="bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Open Therapy Dashboard
              </Button>
            </Card>
            
            <Card className="h-[500px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    Quick Chat Preview
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-2xl ${
                        message.isBot
                          ? 'bg-blue-50 text-blue-900'
                          : 'bg-blue-500 text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <span className={`text-xs mt-1 block ${
                          message.isBot ? 'text-blue-600' : 'text-blue-100'
                        }`}>
                          {message.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggested Responses */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Suggested responses:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      I'd like to talk about anxiety
                    </Button>
                    <Button variant="outline" size="sm">
                      Help me with stress management
                    </Button>
                    <Button variant="outline" size="sm">
                      I'm feeling overwhelmed
                    </Button>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button size="icon" variant="outline">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Emergency Notice */}
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Crisis Support</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">
                    If you're in crisis, please contact emergency services or call the crisis hotline immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="meditation" className="space-y-6">
          {/* Currently Playing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Video/Audio Player */}
                  <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
                    <iframe
                      src={currentMeditation.audioUrl}
                      title={currentMeditation.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <ImageWithFallback
                      src={currentMeditation.image}
                      alt={currentMeditation.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{currentMeditation.title}</h3>
                      <p className="text-gray-600 mb-2">by {currentMeditation.instructor}</p>
                      <p className="text-sm text-gray-500 mb-3">{currentMeditation.description}</p>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="secondary">{currentMeditation.category}</Badge>
                        <span className="text-sm text-gray-600">
                          <Timer className="w-4 h-4 inline mr-1" />
                          {currentMeditation.duration} min
                        </span>
                        <span className="text-sm text-gray-600">{currentMeditation.background}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Session Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <Button
                  className="w-full"
                  onClick={handleAddMeditationSession}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Add Session
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meditation Library */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Meditation Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {meditationSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${ 
                        currentMeditation.id === session.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setCurrentMeditation(session)}
                    >
                      <div className="relative mb-3">
                        <ImageWithFallback
                          src={session.image}
                          alt={session.title}
                          className="w-full h-32 rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-1">{session.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{session.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{session.category}</Badge>
                        <span className="text-sm text-gray-500">{session.duration}m</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meditation Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Meditation Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{meditationStreak}</div>
                    <div className="text-sm text-gray-600">Days Streak</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalMeditationMinutes}</div>
                    <div className="text-sm text-gray-600">Total Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{meditationSessions.length}</div>
                    <div className="text-sm text-gray-600">Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{totalMeditationMinutes / meditationSessions.length}</div>
                    <div className="text-sm text-gray-600">Avg Session</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="journal" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Journal Entry */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Today's Journal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Writing Prompt</label>
                    <div className="p-3 bg-purple-50 rounded-lg mb-3">
                      <p className="text-sm text-purple-800 italic">
                        "{journalPrompts[selectedPrompt]}"
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPrompt((prev) => (prev - 1 + journalPrompts.length) % journalPrompts.length)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPrompt((prev) => (prev + 1) % journalPrompts.length)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Write your thoughts here..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="min-h-[200px]"
                  />

                  <Button 
                    className="w-full"
                    onClick={handleSaveJournal}
                    disabled={!journalEntry.trim()}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {showSaveConfirmation ? '✓ Saved!' : 'Save Entry'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Journal Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Journal Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totalJournalEntries}</div>
                      <div className="text-sm text-gray-600">Entries</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{journalStreak}</div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recent Entries</h4>
                    <div className="space-y-2">
                      {recentJournalEntries.length > 0 ? (
                        recentJournalEntries.map((entry) => (
                          <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{entry.date}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {entry.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
                          No journal entries yet. Start writing!
                        </div>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View All Entries
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Emergency Dialog */}
      <Dialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Emergency Contact Information</DialogTitle>
            <DialogDescription>
              Please contact one of the following professionals if you are in crisis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{contact.name}</div>
                    <div className="text-xs text-gray-500">{contact.role}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Phone: {contact.phone}</p>
                  <p className="text-sm text-gray-600">Email: {contact.email}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setEmergencyDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Therapy Dialog */}
      <Dialog open={therapyDialogOpen} onOpenChange={setTherapyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book a Therapy Session</DialogTitle>
            <DialogDescription>
              Schedule a therapy session with our AI wellness companion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="therapy-date">Date</Label>
                <Input
                  id="therapy-date"
                  type="date"
                  value={therapyDate}
                  onChange={(e) => setTherapyDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="therapy-time">Time</Label>
                <Input
                  id="therapy-time"
                  type="time"
                  value={therapyTime}
                  onChange={(e) => setTherapyTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="therapy-type">Therapy Type</Label>
              <Input
                id="therapy-type"
                type="text"
                value={therapyType}
                onChange={(e) => setTherapyType(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="therapy-notes">Notes</Label>
              <Textarea
                id="therapy-notes"
                value={therapyNotes}
                onChange={(e) => setTherapyNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTherapyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Add therapy session logic here
                setTherapyDialogOpen(false);
                toast.success('Therapy session booked!');
              }}
            >
              Book Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}