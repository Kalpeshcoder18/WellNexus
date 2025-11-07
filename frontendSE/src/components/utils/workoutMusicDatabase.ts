// Workout Music Database - Curated playlists based on workout type and mood/energy level

export interface MusicPlaylist {
  id: string;
  title: string;
  category: string;
  workoutTypes: string[];
  energyLevel: 'low' | 'medium' | 'high';
  mood: string[];
  embedUrl: string;
  description: string;
  duration: string;
}

export const workoutMusicDatabase: MusicPlaylist[] = [
  // High Energy - Strength & HIIT
  {
    id: 'rock-strength',
    title: 'Rock Gym Motivation',
    category: 'Rock',
    workoutTypes: ['strength', 'hiit'],
    energyLevel: 'high',
    mood: ['energetic', 'motivated', 'powerful'],
    embedUrl: 'https://www.youtube.com/embed/sXpF9t1yaHc',
    description: 'Powerful rock tracks to fuel your strength training',
    duration: '1:00:00'
  },
  {
    id: 'edm-hiit',
    title: 'EDM Workout Beast Mode',
    category: 'EDM',
    workoutTypes: ['hiit', 'cardio', 'strength'],
    energyLevel: 'high',
    mood: ['energetic', 'intense', 'focused'],
    embedUrl: 'https://www.youtube.com/embed/bPtsrf6J-h0',
    description: 'High-energy EDM for intense workouts',
    duration: '1:15:00'
  },
  {
    id: 'metal-strength',
    title: 'Heavy Metal Power',
    category: 'Metal',
    workoutTypes: ['strength', 'hiit'],
    energyLevel: 'high',
    mood: ['aggressive', 'powerful', 'intense'],
    embedUrl: 'https://www.youtube.com/embed/WXEUp0m21vs',
    description: 'Aggressive metal for maximum power output',
    duration: '45:00'
  },

  // Medium Energy - Cardio & Dance
  {
    id: 'pop-cardio',
    title: 'Pop Hits Cardio',
    category: 'Pop',
    workoutTypes: ['cardio', 'dance'],
    energyLevel: 'medium',
    mood: ['happy', 'upbeat', 'energetic'],
    embedUrl: 'https://www.youtube.com/embed/jVfOqe8RMNQ',
    description: 'Upbeat pop music for cardio sessions',
    duration: '50:00'
  },
  {
    id: 'dance-cardio',
    title: 'Dance Workout Beats',
    category: 'Dance',
    workoutTypes: ['dance', 'cardio'],
    energyLevel: 'medium',
    mood: ['happy', 'fun', 'energetic'],
    embedUrl: 'https://www.youtube.com/embed/ZCflBkPQDQQ',
    description: 'Infectious dance beats for your cardio workout',
    duration: '1:00:00'
  },
  {
    id: 'hiphop-cardio',
    title: 'Hip Hop Workout Mix',
    category: 'Hip Hop',
    workoutTypes: ['cardio', 'dance', 'hiit'],
    energyLevel: 'medium',
    mood: ['confident', 'energetic', 'motivated'],
    embedUrl: 'https://www.youtube.com/embed/ot_V8AvXfW4',
    description: 'Hip hop beats to keep you moving',
    duration: '55:00'
  },

  // Low Energy - Yoga & Pilates
  {
    id: 'ambient-yoga',
    title: 'Peaceful Yoga Flow',
    category: 'Ambient',
    workoutTypes: ['yoga', 'pilates'],
    energyLevel: 'low',
    mood: ['calm', 'peaceful', 'relaxed'],
    embedUrl: 'https://www.youtube.com/embed/kEJvjk_oCjc',
    description: 'Calming ambient music for yoga practice',
    duration: '1:30:00'
  },
  {
    id: 'acoustic-yoga',
    title: 'Acoustic Zen',
    category: 'Acoustic',
    workoutTypes: ['yoga', 'pilates'],
    energyLevel: 'low',
    mood: ['calm', 'peaceful', 'centered'],
    embedUrl: 'https://www.youtube.com/embed/2OEL4P1Rz04',
    description: 'Gentle acoustic guitar for mindful movement',
    duration: '1:00:00'
  },
  {
    id: 'nature-yoga',
    title: 'Nature Sounds Meditation',
    category: 'Nature',
    workoutTypes: ['yoga', 'pilates'],
    energyLevel: 'low',
    mood: ['calm', 'peaceful', 'grounded'],
    embedUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    description: 'Natural soundscapes for yoga and stretching',
    duration: '2:00:00'
  },

  // Medium-High Energy - Mixed
  {
    id: 'electronic-mixed',
    title: 'Electronic Workout Power',
    category: 'Electronic',
    workoutTypes: ['cardio', 'hiit', 'strength'],
    energyLevel: 'high',
    mood: ['energetic', 'focused', 'motivated'],
    embedUrl: 'https://www.youtube.com/embed/4NRXx6U8ABQ',
    description: 'Electronic music to power through any workout',
    duration: '1:20:00'
  },
  {
    id: 'indie-pilates',
    title: 'Indie Chill Workout',
    category: 'Indie',
    workoutTypes: ['pilates', 'yoga', 'dance'],
    energyLevel: 'medium',
    mood: ['relaxed', 'creative', 'focused'],
    embedUrl: 'https://www.youtube.com/embed/oDAw7vW7H0c',
    description: 'Indie music for a mindful workout session',
    duration: '45:00'
  },
  {
    id: 'motivational-mixed',
    title: 'Motivational Workout Mix',
    category: 'Motivational',
    workoutTypes: ['strength', 'cardio', 'hiit'],
    energyLevel: 'high',
    mood: ['motivated', 'determined', 'powerful'],
    embedUrl: 'https://www.youtube.com/embed/UKpw4s5S0Qo',
    description: 'Motivational tracks to push your limits',
    duration: '1:10:00'
  }
];

// Helper function to get music recommendations based on workout and mood
export function getMusicRecommendations(
  workoutCategory: string,
  energyLevel: number = 5,
  mood?: string
): MusicPlaylist[] {
  // Convert energy level (1-10) to category
  let energyCategory: 'low' | 'medium' | 'high';
  if (energyLevel <= 3) energyCategory = 'low';
  else if (energyLevel <= 7) energyCategory = 'medium';
  else energyCategory = 'high';

  // Filter by workout type and energy level
  let recommendations = workoutMusicDatabase.filter(music => 
    music.workoutTypes.includes(workoutCategory) &&
    (music.energyLevel === energyCategory || Math.abs(
      (music.energyLevel === 'low' ? 1 : music.energyLevel === 'medium' ? 2 : 3) - 
      (energyCategory === 'low' ? 1 : energyCategory === 'medium' ? 2 : 3)
    ) <= 1)
  );

  // If no exact matches, get similar energy level
  if (recommendations.length === 0) {
    recommendations = workoutMusicDatabase.filter(music => 
      music.energyLevel === energyCategory
    );
  }

  // If still no matches, return all for that workout type
  if (recommendations.length === 0) {
    recommendations = workoutMusicDatabase.filter(music => 
      music.workoutTypes.includes(workoutCategory)
    );
  }

  // Sort by relevance
  return recommendations.slice(0, 5);
}

// Get default music for a workout type
export function getDefaultMusic(workoutCategory: string): MusicPlaylist | null {
  const music = workoutMusicDatabase.find(m => 
    m.workoutTypes.includes(workoutCategory)
  );
  return music || workoutMusicDatabase[0];
}
