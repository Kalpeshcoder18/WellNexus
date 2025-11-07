import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Volume2, Music, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { workoutDatabase, getWorkoutById } from './utils/workoutDatabase';
import { getMusicRecommendations, MusicPlaylist } from './utils/workoutMusicDatabase';

interface StartWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  energyLevel?: number;
}

export default function StartWorkoutDialog({ open, onOpenChange, energyLevel = 7 }: StartWorkoutDialogProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<MusicPlaylist | null>(null);
  const [step, setStep] = useState<'workout' | 'music' | 'preview'>('workout');

  const handleWorkoutSelect = (workoutId: number) => {
    setSelectedWorkout(workoutId);
    const workout = getWorkoutById(workoutId);
    if (workout) {
      const musicRecs = getMusicRecommendations(workout.category, energyLevel);
      if (musicRecs.length > 0) {
        setSelectedMusic(musicRecs[0]);
      }
    }
    setStep('music');
  };

  const handleStart = () => {
    if (selectedWorkout) {
      const workout = getWorkoutById(selectedWorkout);
      if (workout) {
        window.open(workout.videoUrl, '_blank');
        if (selectedMusic) {
          window.open(selectedMusic.embedUrl.replace('/embed/', '/watch?v='), '_blank');
        }
        onOpenChange(false);
        // Reset
        setSelectedWorkout(null);
        setSelectedMusic(null);
        setStep('workout');
      }
    }
  };

  const selectedWorkoutData = selectedWorkout ? getWorkoutById(selectedWorkout) : null;
  const musicRecommendations = selectedWorkoutData 
    ? getMusicRecommendations(selectedWorkoutData.category, energyLevel)
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            Start Your Workout
          </DialogTitle>
          <DialogDescription>
            Choose your workout and get personalized music to match your energy
          </DialogDescription>
        </DialogHeader>

        <Tabs value={step} onValueChange={(v) => setStep(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workout" disabled={!selectedWorkout && step !== 'workout'}>
              1. Select Workout
            </TabsTrigger>
            <TabsTrigger value="music" disabled={!selectedWorkout}>
              2. Choose Music
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!selectedWorkout || !selectedMusic}>
              3. Preview & Start
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-4 mt-4">
            <div>
              <Label>Choose Your Workout</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-[400px] overflow-y-auto">
                {workoutDatabase.slice(0, 12).map((workout) => (
                  <motion.div
                    key={workout.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedWorkout === workout.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleWorkoutSelect(workout.id)}
                  >
                    <ImageWithFallback
                      src={workout.thumbnail}
                      alt={workout.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{workout.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {workout.instructor} • {workout.duration}m
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {workout.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          ~{workout.calories} cal
                        </span>
                      </div>
                    </div>
                    {selectedWorkout === workout.id && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="music" className="space-y-4 mt-4">
            <div>
              <Label className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Recommended Music for Your Workout
              </Label>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                Based on your energy level and workout type
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                {musicRecommendations.map((music) => (
                  <motion.div
                    key={music.id}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMusic?.id === music.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedMusic(music)}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      <Volume2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{music.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{music.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {music.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{music.duration}</span>
                        <span className="text-xs text-gray-500 capitalize">• {music.energyLevel} energy</span>
                      </div>
                    </div>
                    {selectedMusic?.id === music.id && (
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('workout')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep('preview')}
                disabled={!selectedMusic}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            {selectedWorkoutData && selectedMusic && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Your Workout Session</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <ImageWithFallback
                          src={selectedWorkoutData.thumbnail}
                          alt={selectedWorkoutData.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Play className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold">{selectedWorkoutData.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {selectedWorkoutData.instructor} • {selectedWorkoutData.duration} minutes
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge>{selectedWorkoutData.difficulty}</Badge>
                            <Badge variant="outline">{selectedWorkoutData.category}</Badge>
                            <span className="text-sm text-gray-600">
                              ~{selectedWorkoutData.calories} calories
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Volume2 className="w-4 h-4 text-purple-600" />
                            <h4 className="font-semibold">{selectedMusic.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{selectedMusic.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{selectedMusic.category}</Badge>
                            <span className="text-sm text-gray-500">{selectedMusic.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">Tip</h4>
                      <p className="text-sm text-yellow-800">
                        Both your workout and music will open in separate tabs. Adjust the music volume as needed during your session.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep('music')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleStart}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
