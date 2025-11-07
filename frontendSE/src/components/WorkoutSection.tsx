import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Timer, Users, TrendingUp, Calendar,
  Dumbbell, Heart, Zap, Target, Award, Star, Filter, Search,
  Video, Camera, Mic, Volume2, Settings, ChevronRight, Plus, ExternalLink,
  Trash2, CheckCircle2, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useWorkout } from './utils/workoutContext';
import { workoutDatabase, workoutCategories, getWorkoutsByCategory, getWorkoutById, getCategoryCount } from './utils/workoutDatabase';
import { getMusicRecommendations, MusicPlaylist } from './utils/workoutMusicDatabase';
import { toast } from 'sonner@2.0.3';
import { useMoodContext } from './utils/moodContext';
import StartWorkoutDialog from './StartWorkoutDialog';

interface WorkoutSectionProps {
  userProfile: any;
}

const achievements = [
  { title: 'Week Warrior', description: '7 workouts this week', icon: '🏆', unlocked: true },
  { title: 'Consistency King', description: '30-day streak', icon: '🔥', unlocked: false },
  { title: 'Calorie Crusher', description: 'Burned 1000+ calories', icon: '⚡', unlocked: true },
  { title: 'Yoga Master', description: '50 yoga sessions', icon: '🧘‍♀️', unlocked: false },
];

export default function WorkoutSection({ userProfile }: WorkoutSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedWorkoutForSchedule, setSelectedWorkoutForSchedule] = useState<number | null>(null);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedScheduledWorkout, setSelectedScheduledWorkout] = useState<string | null>(null);
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [actualDuration, setActualDuration] = useState('');
  const [startWorkoutDialogOpen, setStartWorkoutDialogOpen] = useState(false);
  const [selectedWorkoutToStart, setSelectedWorkoutToStart] = useState<number | null>(null);
  const [musicPlayerOpen, setMusicPlayerOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);

  const workoutContext = useWorkout();
  const weeklyProgress = workoutContext.getWeeklyProgress();
  const totalStats = workoutContext.getTotalStats();
  const todayScheduled = workoutContext.getScheduledWorkoutsForToday();

  const filteredWorkouts = getWorkoutsByCategory(selectedCategory).filter(workout =>
    workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleScheduleWorkout = (workoutId: number) => {
    setSelectedWorkoutForSchedule(workoutId);
    setScheduleDialogOpen(true);
  };

  const handleSaveSchedule = () => {
    if (selectedWorkoutForSchedule) {
      workoutContext.addScheduledWorkout({
        workoutId: selectedWorkoutForSchedule,
        date: scheduleDate,
        time: scheduleTime,
        completed: false,
      });
      toast.success('Workout scheduled successfully!');
      setScheduleDialogOpen(false);
      setSelectedWorkoutForSchedule(null);
    }
  };

  const handleStartWorkout = (workoutId: number) => {
    const workout = getWorkoutById(workoutId);
    if (workout) {
      window.open(workout.videoUrl, '_blank');
    }
  };

  const handleJoinScheduled = (scheduledId: string) => {
    const scheduled = workoutContext.scheduledWorkouts.find(w => w.id === scheduledId);
    if (scheduled) {
      const workout = getWorkoutById(scheduled.workoutId);
      if (workout) {
        window.open(workout.videoUrl, '_blank');
        // Open complete dialog
        setSelectedScheduledWorkout(scheduledId);
        setCaloriesBurned(workout.calories.toString());
        setActualDuration(workout.duration.toString());
        setCompleteDialogOpen(true);
      }
    }
  };

  const handleCompleteWorkout = () => {
    if (selectedScheduledWorkout && caloriesBurned && actualDuration) {
      workoutContext.completeWorkout(
        selectedScheduledWorkout,
        parseInt(caloriesBurned),
        parseInt(actualDuration)
      );
      toast.success('Workout completed! Great job! 💪');
      setCompleteDialogOpen(false);
      setSelectedScheduledWorkout(null);
      setCaloriesBurned('');
      setActualDuration('');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
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
          <h1 className="text-2xl font-bold text-gray-900">Workout Hub</h1>
          <p className="text-gray-600">Your personal fitness journey starts here</p>
        </div>
        <Button className="gap-2" onClick={() => setStartWorkoutDialogOpen(true)}>
          <Play className="w-4 h-4" />
          Start Workout
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{weeklyProgress.reduce((sum, day) => sum + day.workouts, 0)}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalStats.totalCalories.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Calories Burned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatDuration(totalStats.totalDuration)}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalStats.totalWorkouts}</div>
                <div className="text-sm text-gray-600">Total Workouts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Workout Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedCategory === 'all' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏋️‍♂️</div>
                      <h3 className="font-medium">All</h3>
                      <p className="text-sm text-gray-600">{workoutDatabase.length} workouts</p>
                    </div>
                  </motion.div>
                  
                  {workoutCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedCategory === category.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <h3 className="font-medium">{category.label}</h3>
                        <p className="text-sm text-gray-600">{getCategoryCount(category.id)} workouts</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search workouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </motion.div>

          {/* Workout Videos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <ImageWithFallback
                    src={workout.thumbnail}
                    alt={workout.title}
                    className="w-full h-48 object-cover"
                  />
                  <div 
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => handleStartWorkout(workout.id)}
                  >
                    <Button size="lg" className="rounded-full">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {workout.duration}m
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{workout.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {workout.instructor}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getDifficultyColor(workout.difficulty)}>
                      {workout.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {workout.rating}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <div>Equipment: {workout.equipment}</div>
                    <div>Burns ~{workout.calories} calories</div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => handleStartWorkout(workout.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleScheduleWorkout(workout.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Today's Schedule
                  </div>
                  <Button size="sm" onClick={() => setScheduleDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayScheduled.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No workouts scheduled for today</p>
                      <p className="text-sm">Click "Add" or schedule from the Library tab</p>
                    </div>
                  ) : (
                    todayScheduled.map((scheduled) => {
                      const workout = getWorkoutById(scheduled.workoutId);
                      if (!workout) return null;
                      return (
                        <div key={scheduled.id} className={`flex items-center gap-4 p-3 rounded-lg ${
                          scheduled.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}>
                          <div className="text-sm font-medium text-blue-600 w-16">
                            {scheduled.time}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{workout.title}</h4>
                            <p className="text-sm text-gray-600">
                              {workout.duration}m • {workout.instructor}
                            </p>
                          </div>
                          {scheduled.completed ? (
                            <Badge className="bg-green-500">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Done
                            </Badge>
                          ) : (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleJoinScheduled(scheduled.id)}
                              >
                                Join
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => workoutContext.deleteScheduledWorkout(scheduled.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyProgress}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Bar dataKey="duration" fill="#3B82F6" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {weeklyProgress.reduce((sum, day) => sum + day.workouts, 0)}
                    </div>
                    <div className="text-xs text-gray-600">Workouts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">
                      {formatDuration(weeklyProgress.reduce((sum, day) => sum + day.duration, 0))}
                    </div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-600">
                      {weeklyProgress.reduce((sum, day) => sum + day.calories, 0)}
                    </div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* All Scheduled Workouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Scheduled Workouts</span>
                  <Button size="sm" variant="outline" onClick={() => setScheduleDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Schedule New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workoutContext.scheduledWorkouts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p className="mb-2">No scheduled workouts</p>
                      <p className="text-sm mb-4">Start planning your fitness journey</p>
                      <Button onClick={() => setScheduleDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule Your First Workout
                      </Button>
                    </div>
                  ) : (
                    workoutContext.scheduledWorkouts
                      .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
                      .map((scheduled) => {
                        const workout = getWorkoutById(scheduled.workoutId);
                        if (!workout) return null;
                        const scheduleDate = new Date(scheduled.date);
                        const today = new Date();
                        const isToday = scheduleDate.toDateString() === today.toDateString();
                        const isPast = scheduleDate < today && !isToday;
                        
                        return (
                          <div 
                            key={scheduled.id} 
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                              scheduled.completed 
                                ? 'bg-green-50 border-green-200' 
                                : isPast
                                ? 'bg-gray-50 border-gray-200 opacity-60'
                                : isToday
                                ? 'bg-blue-50 border-blue-300'
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <ImageWithFallback
                              src={workout.thumbnail}
                              alt={workout.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{workout.title}</h4>
                                {isToday && !scheduled.completed && (
                                  <Badge variant="default" className="bg-blue-500">Today</Badge>
                                )}
                                {scheduled.completed && (
                                  <Badge className="bg-green-500">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {workout.instructor} • {workout.duration}m • {workout.difficulty}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {scheduleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {scheduled.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!scheduled.completed && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleJoinScheduled(scheduled.id)}
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  Start
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => workoutContext.deleteScheduledWorkout(scheduled.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Progress Charts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Workout Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyProgress}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Line type="monotone" dataKey="calories" stroke="#EF4444" strokeWidth={2} name="Calories" />
                      <Line type="monotone" dataKey="duration" stroke="#10B981" strokeWidth={2} name="Minutes" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Calories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Duration (min)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${
                      achievement.unlocked ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                    }`}>
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-yellow-500 text-white">Unlocked</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">65kg</div>
                    <div className="text-sm text-gray-600">Bench Press</div>
                    <div className="text-xs text-gray-500">+5kg this month</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85kg</div>
                    <div className="text-sm text-gray-600">Squat</div>
                    <div className="text-xs text-gray-500">+10kg this month</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">45s</div>
                    <div className="text-sm text-gray-600">Plank</div>
                    <div className="text-xs text-gray-500">+15s this week</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">8km</div>
                    <div className="text-sm text-gray-600">Longest Run</div>
                    <div className="text-xs text-gray-500">+2km this month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Schedule Workout Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Workout</DialogTitle>
            <DialogDescription>
              {selectedWorkoutForSchedule ? 'Choose a date and time for your workout' : 'Select a workout and schedule it'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedWorkoutForSchedule ? (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium">
                  {getWorkoutById(selectedWorkoutForSchedule)?.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {getWorkoutById(selectedWorkoutForSchedule)?.duration} min • {' '}
                  {getWorkoutById(selectedWorkoutForSchedule)?.instructor}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setSelectedWorkoutForSchedule(null)}
                >
                  Change Workout
                </Button>
              </div>
            ) : (
              <div>
                <Label>Select Workout</Label>
                <div className="grid grid-cols-1 gap-2 mt-2 max-h-[300px] overflow-y-auto">
                  {workoutDatabase.slice(0, 12).map((workout) => (
                    <div
                      key={workout.id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
                      onClick={() => setSelectedWorkoutForSchedule(workout.id)}
                    >
                      <ImageWithFallback
                        src={workout.thumbnail}
                        alt={workout.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{workout.title}</h4>
                        <p className="text-xs text-gray-600">
                          {workout.instructor} • {workout.duration}m • {workout.difficulty}
                        </p>
                      </div>
                      <Badge className={getDifficultyColor(workout.difficulty)}>
                        {workout.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedWorkoutForSchedule && (
              <>
                <div>
                  <Label htmlFor="schedule-date">Date</Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="schedule-time">Time</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setScheduleDialogOpen(false);
              setSelectedWorkoutForSchedule(null);
            }}>
              Cancel
            </Button>
            {selectedWorkoutForSchedule && (
              <Button onClick={handleSaveSchedule}>
                Schedule Workout
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Workout Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Workout</DialogTitle>
            <DialogDescription>
              Log your workout details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="calories">Calories Burned</Label>
              <Input
                id="calories"
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                placeholder="e.g., 250"
              />
            </div>
            <div>
              <Label htmlFor="duration">Actual Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={actualDuration}
                onChange={(e) => setActualDuration(e.target.value)}
                placeholder="e.g., 30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteWorkout}>
              Complete Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Workout Dialog */}
      <StartWorkoutDialog
        open={startWorkoutDialogOpen}
        onOpenChange={setStartWorkoutDialogOpen}
        energyLevel={7}
      />
    </div>
  );
}