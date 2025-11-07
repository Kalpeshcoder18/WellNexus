import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Comment {
  id: string;
  postId: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  avatar: string;
  category: string;
  content: string;
  replies: number;
  likes: number;
  timestamp: Date;
  isExpert: boolean;
  likedByUser?: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  badge: string;
  streak: number;
  avatar?: string;
}

interface CommunityContextType {
  posts: Post[];
  comments: Comment[];
  members: number;
  leaderboard: LeaderboardUser[];
  addPost: (post: Omit<Post, 'id' | 'replies' | 'likes' | 'timestamp' | 'likedByUser'>) => void;
  addComment: (postId: string, content: string, author: string) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  likeComment: (commentId: string) => void;
  getPostComments: (postId: string) => Comment[];
  getPost: (postId: string) => Post | undefined;
  updateUserPoints: (userName: string, points: number) => void;
  getUserRank: (userName: string) => number;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const initialPosts: Post[] = [
  {
    id: '1',
    title: 'How to stay motivated during winter workouts?',
    author: 'Sarah_Fitness',
    avatar: 'S',
    category: 'fitness',
    content: 'I find it really hard to stay motivated when it\'s cold and dark outside. I used to run every morning, but now I struggle to even get out of bed. Does anyone have tips for staying active during winter? What works for you?',
    replies: 24,
    likes: 67,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isExpert: false,
    likedByUser: false
  },
  {
    id: '2',
    title: 'My 6-month transformation journey - Before & After',
    author: 'Dr_Johnson',
    avatar: 'D',
    category: 'weight-loss',
    content: 'Sharing my client\'s amazing transformation with proper nutrition and exercise. Started at 220 lbs and now at 175 lbs. The key was consistency and a sustainable approach to both diet and fitness. Happy to answer any questions!',
    replies: 156,
    likes: 432,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isExpert: true,
    likedByUser: true
  },
  {
    id: '3',
    title: 'Quinoa Buddha Bowl Recipe - 320 calories',
    author: 'ChefMike',
    avatar: 'C',
    category: 'recipes',
    content: 'A delicious and nutritious bowl that\'s perfect for lunch or dinner! Ingredients: quinoa, chickpeas, roasted sweet potato, kale, avocado, tahini dressing. Full recipe and macros in the comments!',
    replies: 38,
    likes: 128,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isExpert: false,
    likedByUser: false
  },
  {
    id: '4',
    title: 'Dealing with anxiety and starting meditation',
    author: 'MindfulMom',
    avatar: 'M',
    category: 'mental-health',
    content: 'Just started my meditation journey to help with anxiety. Looking for beginner tips. I\'ve tried a few apps but find it hard to stay focused. How long did it take you to see benefits?',
    replies: 45,
    likes: 89,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isExpert: false,
    likedByUser: false
  },
  {
    id: '5',
    title: 'Plant-based protein sources guide',
    author: 'NutritionNinja',
    avatar: 'N',
    category: 'nutrition',
    content: 'Complete guide to plant-based proteins: lentils (18g per cup), chickpeas (15g per cup), tofu (20g per cup), tempeh (31g per cup), and more. Perfect for vegetarians and vegans!',
    replies: 67,
    likes: 203,
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    isExpert: false,
    likedByUser: false
  },
  {
    id: '6',
    title: 'Overcoming workout plateaus',
    author: 'FitnessGuru22',
    avatar: 'F',
    category: 'fitness',
    content: 'Been lifting for 2 years and hit a plateau. Changed my routine, added progressive overload, and started tracking everything. Saw results within 3 weeks. Here\'s what worked...',
    replies: 92,
    likes: 314,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isExpert: false,
    likedByUser: true
  },
  {
    id: '7',
    title: 'Morning routines that changed my life',
    author: 'HealthyHabits',
    avatar: 'H',
    category: 'motivation',
    content: '5:30 AM wake up, 10 min meditation, workout, healthy breakfast, journaling. Been doing this for 6 months and it\'s transformative. Anyone else have morning rituals they swear by?',
    replies: 124,
    likes: 256,
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    isExpert: false,
    likedByUser: false
  },
  {
    id: '8',
    title: 'Meal prep Sunday - Week 12',
    author: 'PrepQueen',
    avatar: 'P',
    category: 'nutrition',
    content: 'Prepped all meals for the week in 3 hours! Grilled chicken, roasted veggies, quinoa, overnight oats, and snack boxes. Sharing my complete meal prep strategy and containers I use.',
    replies: 81,
    likes: 187,
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
    isExpert: false,
    likedByUser: false
  }
];

const initialComments: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    author: 'MikeFit',
    avatar: 'M',
    content: 'I switched to indoor workouts during winter. YouTube has great home workout videos!',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 12
  },
  {
    id: 'c2',
    postId: '1',
    author: 'Emma_Wellness',
    avatar: 'E',
    content: 'Finding a workout buddy helps! We keep each other accountable even on cold mornings.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    likes: 8
  },
  {
    id: 'c3',
    postId: '2',
    author: 'HealthSeeker',
    avatar: 'H',
    content: 'This is so inspiring! What was the biggest challenge?',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 15
  },
  {
    id: 'c4',
    postId: '3',
    author: 'FoodLover23',
    avatar: 'F',
    content: 'Just made this! Amazing recipe, thank you for sharing!',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 6
  },
  {
    id: 'c5',
    postId: '4',
    author: 'Dr_Emma',
    avatar: 'D',
    content: 'Start with just 5 minutes a day. Consistency is more important than duration at first.',
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
    likes: 23
  }
];

const initialLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'FitnessGuru22', points: 2850, badge: 'Champion', streak: 45, avatar: 'F' },
  { rank: 2, name: 'HealthyHabits', points: 2720, badge: 'Expert', streak: 38, avatar: 'H' },
  { rank: 3, name: 'WellnessWarrior', points: 2650, badge: 'Expert', streak: 42, avatar: 'W' },
  { rank: 4, name: 'MindfulMover', points: 2580, badge: 'Advanced', streak: 35, avatar: 'M' },
  { rank: 5, name: 'NutritionNinja', points: 2520, badge: 'Advanced', streak: 30, avatar: 'N' },
];

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [members] = useState(12547); // Static for now, could be dynamic
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(initialLeaderboard);

  const addPost = useCallback((newPost: Omit<Post, 'id' | 'replies' | 'likes' | 'timestamp' | 'likedByUser'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(),
      replies: 0,
      likes: 0,
      timestamp: new Date(),
      likedByUser: false
    };
    setPosts(prev => [post, ...prev]);
  }, []);

  const addComment = useCallback((postId: string, content: string, author: string) => {
    const comment: Comment = {
      id: `c${Date.now()}`,
      postId,
      author,
      avatar: author[0].toUpperCase(),
      content,
      timestamp: new Date(),
      likes: 0
    };
    setComments(prev => [...prev, comment]);
    
    // Update post reply count
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, replies: post.replies + 1 }
        : post
    ));
  }, []);

  const likePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1, likedByUser: true }
        : post
    ));
  }, []);

  const unlikePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: Math.max(0, post.likes - 1), likedByUser: false }
        : post
    ));
  }, []);

  const likeComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  }, []);

  const getPostComments = useCallback((postId: string): Comment[] => {
    return comments.filter(comment => comment.postId === postId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [comments]);

  const getPost = useCallback((postId: string): Post | undefined => {
    return posts.find(post => post.id === postId);
  }, [posts]);

  const updateUserPoints = useCallback((userName: string, points: number) => {
    setLeaderboard(prev => {
      const existingUser = prev.find(u => u.name === userName);
      
      if (existingUser) {
        // Only update if points have actually changed
        if (existingUser.points === points) {
          return prev;
        }
        // Update existing user
        const updated = prev.map(u => 
          u.name === userName ? { ...u, points } : u
        );
        // Re-sort and update ranks
        return updated
          .sort((a, b) => b.points - a.points)
          .map((u, index) => ({ ...u, rank: index + 1 }));
      } else {
        // Add new user
        const newUser: LeaderboardUser = {
          rank: prev.length + 1,
          name: userName,
          points,
          badge: 'Beginner',
          streak: 0,
          avatar: userName[0]
        };
        const updated = [...prev, newUser];
        return updated
          .sort((a, b) => b.points - a.points)
          .map((u, index) => ({ ...u, rank: index + 1 }));
      }
    });
  }, []);

  const getUserRank = useCallback((userName: string): number => {
    const user = leaderboard.find(u => u.name === userName);
    return user?.rank || leaderboard.length + 1;
  }, [leaderboard]);

  return (
    <CommunityContext.Provider value={{
      posts,
      comments,
      members,
      leaderboard,
      addPost,
      addComment,
      likePost,
      unlikePost,
      likeComment,
      getPostComments,
      getPost,
      updateUserPoints,
      getUserRank,
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};