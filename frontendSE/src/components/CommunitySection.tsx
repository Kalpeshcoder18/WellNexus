import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, MessageSquare, Trophy, Target, Award, Heart, 
  Plus, Search, Filter, Clock, ArrowUp, ArrowDown,
  Send, Bookmark, Share2, MoreHorizontal, Star,
  Medal, Flame, Zap, Crown, TrendingUp, Calendar, BookOpen,
  X, ThumbsUp, CheckCircle2, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { useCommunity } from './utils/communityContext';
import { usePoints, Challenge as ChallengeType, POINTS_CONFIG } from './utils/pointsContext';
import { useWorkout } from './utils/workoutContext';
import { useMentalWellbeing } from './utils/mentalWellbeingContext';
import { useMoodContext } from './utils/moodContext';
import { toast } from 'sonner@2.0.3';
import ExpertCard from './ExpertCard';

interface CommunitySectionProps {
  userProfile: any;
}

const forumCategories = [
  { id: 'all', name: 'All Discussions', posts: 0, color: 'bg-gray-100 text-gray-700' },
  { id: 'nutrition', name: 'Nutrition & Diet', posts: 0, color: 'bg-green-100 text-green-700' },
  { id: 'fitness', name: 'Fitness & Exercise', posts: 0, color: 'bg-blue-100 text-blue-700' },
  { id: 'mental-health', name: 'Mental Health', posts: 0, color: 'bg-purple-100 text-purple-700' },
  { id: 'weight-loss', name: 'Weight Loss', posts: 0, color: 'bg-orange-100 text-orange-700' },
  { id: 'recipes', name: 'Healthy Recipes', posts: 0, color: 'bg-pink-100 text-pink-700' },
  { id: 'motivation', name: 'Motivation & Support', posts: 0, color: 'bg-yellow-100 text-yellow-700' },
];

const allChallenges: ChallengeType[] = [
  {
    id: 1,
    title: '30-Day Water Challenge',
    description: 'Drink 8 glasses of water daily for 30 days',
    participants: 1250,
    daysLeft: 12,
    progress: 0,
    difficulty: 'Beginner',
    category: 'Hydration',
    reward: 50,
    joined: false,
    targetDays: 30,
    dailyGoal: { type: 'water', count: 8 }
  },
  {
    id: 2,
    title: 'Weekly Workout Warriors',
    description: 'Complete 5 workouts per week',
    participants: 890,
    daysLeft: 3,
    progress: 0,
    difficulty: 'Intermediate',
    category: 'Fitness',
    reward: 100,
    joined: false,
    targetDays: 7,
    dailyGoal: { type: 'workout', count: 5 }
  },
  {
    id: 3,
    title: 'Mindful Meditation Month',
    description: 'Meditate for 10 minutes daily',
    participants: 650,
    daysLeft: 18,
    progress: 0,
    difficulty: 'Beginner',
    category: 'Mental Health',
    reward: 75,
    joined: false,
    targetDays: 30,
    dailyGoal: { type: 'meditation', count: 1 }
  },
  {
    id: 4,
    title: 'Plant-Based Week',
    description: 'Eat only plant-based meals for 7 days',
    participants: 420,
    daysLeft: 5,
    progress: 0,
    difficulty: 'Advanced',
    category: 'Nutrition',
    reward: 150,
    joined: false,
    targetDays: 7,
    dailyGoal: { type: 'plant-based', count: 3 }
  }
];

const expertProfiles = [
  {
    id: 1,
    name: 'Aryan Tyagi',
    title: 'Certified Personal Trainer & Fitness Coach',
    specialties: ['Strength Training', 'HIIT', 'Body Transformation', 'Nutrition Planning'],
    rating: 4.9,
    consultations: 350,
    avatar: 'AT',
    isOnline: true,
    instagramUrl: 'https://www.instagram.com/notme_aryan_?igsh=MWpjNHZ3NzNmNWdsaQ==',
    instagramHandle: '@notme_aryan_'
  },
  {
    id: 2,
    name: 'Kalpesh Paliwal',
    title: 'Fitness Expert & Wellness Consultant',
    specialties: ['Weight Loss', 'Muscle Gain', 'Cardio Training', 'Lifestyle Coaching'],
    rating: 4.8,
    consultations: 280,
    avatar: 'KP',
    isOnline: true,
    instagramUrl: 'https://www.instagram.com/kalpeshpaliwal01?igsh=azF3Z2dhbXI5Z3hu',
    instagramHandle: '@kalpeshpaliwal01'
  }
];

export default function CommunitySection({ userProfile }: CommunitySectionProps) {
  const { posts, members, addPost, addComment, likePost, unlikePost, getPostComments, getPost, leaderboard, updateUserPoints, getUserRank } = useCommunity();
  const { totalPoints, streak, activeChallenges, joinChallenge, updateChallengeProgress, completeChallenge, getChallengeById, addPoints, badge, rank } = usePoints();
  const { getTotalStats } = useWorkout();
  const { getMeditationStats } = useMentalWellbeing();
  const { moodEntries } = useMoodContext();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [challenges, setChallenges] = useState<ChallengeType[]>(allChallenges);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false);

  // Update user's position in leaderboard whenever points change
  useEffect(() => {
    if (userProfile?.name) {
      updateUserPoints(userProfile.name, totalPoints);
    }
  }, [totalPoints, userProfile?.name, updateUserPoints]);

  // Sync challenges with user's active challenges
  useEffect(() => {
    const updatedChallenges = allChallenges.map(challenge => {
      const userChallenge = getChallengeById(challenge.id);
      if (userChallenge) {
        return {
          ...challenge,
          joined: true,
          progress: userChallenge.progress
        };
      }
      return challenge;
    });
    setChallenges(updatedChallenges);
  }, [activeChallenges, getChallengeById]);

  // Calculate category counts
  const getCategoryPosts = (categoryId: string) => {
    if (categoryId === 'all') return posts.length;
    return posts.filter(post => post.category === categoryId).length;
  };

  // Filter posts based on selected category and search
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      toast.error('Please fill in all fields');
      return;
    }

    addPost({
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      author: userProfile?.name || 'Anonymous',
      avatar: userProfile?.name?.[0] || 'A',
      isExpert: false
    });

    // Award points for creating a post
    addPoints('post_created', POINTS_CONFIG.POST_CREATED, 'Created a new post');

    toast.success('Post created successfully! +' + POINTS_CONFIG.POST_CREATED + ' points');
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('');
    setIsNewPostDialogOpen(false);
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    addComment(postId, newComment, userProfile?.name || 'Anonymous');
    
    // Award points for adding a comment
    addPoints('comment_added', POINTS_CONFIG.COMMENT_ADDED, 'Added a comment');
    
    setNewComment('');
    toast.success('Comment added! +' + POINTS_CONFIG.COMMENT_ADDED + ' points');
  };

  const handleLikeToggle = (postId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikePost(postId);
    } else {
      likePost(postId);
      addPoints('post_liked', POINTS_CONFIG.POST_LIKED, 'Liked a post');
      toast.success('Post liked! +' + POINTS_CONFIG.POST_LIKED + ' point');
    }
  };

  const handleJoinChallenge = (challenge: ChallengeType) => {
    joinChallenge(challenge);
    toast.success(`Joined ${challenge.title}! +5 points`);
  };

  const handleContinueChallenge = (challengeId: number) => {
    setSelectedChallengeId(challengeId);
    setIsChallengeDialogOpen(true);
  };

  const handleUpdateChallengeProgress = (amount: number) => {
    if (selectedChallengeId === null) return;

    const challenge = challenges.find(c => c.id === selectedChallengeId);
    const userChallenge = getChallengeById(selectedChallengeId);
    
    if (!challenge || !userChallenge) return;

    const newProgress = Math.min(100, userChallenge.progress + amount);
    updateChallengeProgress(selectedChallengeId, newProgress);

    if (newProgress >= 100) {
      completeChallenge(selectedChallengeId);
      addPoints('challenge_completed', challenge.reward, `Completed ${challenge.title}`);
      toast.success(`Challenge completed! +${challenge.reward} points!`);
    } else {
      toast.success(`Progress updated! +${Math.floor(amount)} points`);
      addPoints('challenge_progress', Math.floor(amount / 10), `Made progress on ${challenge.title}`);
    }

    setIsChallengeDialogOpen(false);
    setSelectedChallengeId(null);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Champion': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Expert': return <Star className="w-4 h-4 text-purple-500" />;
      case 'Advanced': return <Medal className="w-4 h-4 text-blue-500" />;
      default: return <Trophy className="w-4 h-4 text-gray-500" />;
    }
  };

  const selectedPost = selectedPostId ? getPost(selectedPostId) : null;
  const postComments = selectedPostId ? getPostComments(selectedPostId) : [];
  const selectedChallenge = selectedChallengeId ? challenges.find(c => c.id === selectedChallengeId) : null;

  // Get full leaderboard with current user
  const fullLeaderboard = [...leaderboard];
  const userInLeaderboard = fullLeaderboard.find(u => u.name === userProfile?.name);
  
  if (!userInLeaderboard && userProfile?.name) {
    fullLeaderboard.push({
      rank: rank,
      name: userProfile.name,
      points: totalPoints,
      badge: badge,
      streak: streak,
      avatar: userProfile.name[0]
    });
  }

  // Sort and ensure correct rankings
  const sortedLeaderboard = fullLeaderboard
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  return (
    <div className="p-6 space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl text-gray-900">Community Hub</h1>
          <p className="text-gray-600">Connect, share, and grow together</p>
        </div>
        
        <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Share your thoughts, questions, or experiences with the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="post-title">Title</Label>
                <Input
                  id="post-title"
                  placeholder="What's on your mind?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="post-category">Category</Label>
                <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                  <SelectTrigger id="post-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {forumCategories.filter(cat => cat.id !== 'all').map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="post-content">Content</Label>
                <Textarea
                  id="post-content"
                  placeholder="Share your thoughts, questions, or experiences..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsNewPostDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Community Stats */}
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
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl">{members.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl">{posts.length.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Discussions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl text-purple-900">{totalPoints.toLocaleString()}</div>
                <div className="text-sm text-purple-700">Your Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl">{streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="forums" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
        </TabsList>

        <TabsContent value="forums" className="space-y-6">
          {/* Forum Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Discussion Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {forumCategories.map((category) => {
                    const categoryPostCount = getCategoryPosts(category.id);
                    return (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer ${
                          selectedCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{category.name}</h3>
                          <Badge className={category.color}>{categoryPostCount}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {categoryPostCount} {categoryPostCount === 1 ? 'discussion' : 'discussions'}
                        </p>
                      </motion.div>
                    );
                  })}
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
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedCategory !== 'all' && (
              <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                Clear Filter
              </Button>
            )}
          </motion.div>

          {/* Forum Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No discussions found. Be the first to post!</p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{post.avatar}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 
                            className="font-semibold hover:text-blue-600 cursor-pointer"
                            onClick={() => setSelectedPostId(post.id)}
                          >
                            {post.title}
                          </h3>
                          {post.isExpert && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Expert
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <span>{getTimeAgo(post.timestamp)}</span>
                          <Badge variant="outline" className="text-xs">
                            {forumCategories.find(c => c.id === post.category)?.name}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{post.content}</p>
                        
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => setSelectedPostId(post.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {post.replies} replies
                          </button>
                          <button
                            onClick={() => handleLikeToggle(post.id, post.likedByUser || false)}
                            className={`flex items-center gap-1 text-sm transition-colors ${
                              post.likedByUser ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${post.likedByUser ? 'fill-current' : ''}`} />
                            {post.likes} likes
                          </button>
                          <div className="flex items-center gap-2 ml-auto">
                            <Button variant="ghost" size="sm">
                              <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{challenge.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg text-blue-600">{challenge.participants}</div>
                        <div className="text-xs text-gray-600">Participants</div>
                      </div>
                      <div>
                        <div className="text-lg text-green-600">{challenge.daysLeft}</div>
                        <div className="text-xs text-gray-600">Days Left</div>
                      </div>
                      <div>
                        <div className="text-lg text-purple-600">{challenge.reward}</div>
                        <div className="text-xs text-gray-600">Points</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="outline">{challenge.category}</Badge>
                    </div>
                    
                    {challenge.joined ? (
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleContinueChallenge(challenge.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Continue Challenge
                        </Button>
                        {challenge.progress >= 100 && (
                          <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Completed!
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handleJoinChallenge(challenge)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Join Challenge
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Global Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedLeaderboard.map((user) => (
                    <div
                      key={user.rank + user.name}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        user.name === userProfile?.name
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          user.rank === 1 ? 'bg-yellow-500 text-white' :
                          user.rank === 2 ? 'bg-gray-400 text-white' :
                          user.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {user.rank}
                        </div>
                        <Avatar>
                          <AvatarFallback>{user.avatar || user.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-semibold">
                          {user.name}
                          {user.name === userProfile?.name && (
                            <span className="text-blue-600 ml-2">(You)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {getBadgeIcon(user.badge)}
                          <span>{user.badge}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg text-blue-600">{user.points.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{user.streak} day streak</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl text-blue-600">{rank}{rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'}</div>
                    <div className="text-sm text-gray-600">Current Rank</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl text-green-600">{totalPoints.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl text-purple-600">{streak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl text-yellow-600">{activeChallenges.filter(c => c.completed).length}</div>
                    <div className="text-sm text-gray-600">Challenges Won</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="experts" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {expertProfiles.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPostId} onOpenChange={() => setSelectedPostId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Discussion</DialogTitle>
            <DialogDescription>
              Join the conversation and share your thoughts
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Post Content */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{selectedPost.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{selectedPost.title}</h3>
                        {selectedPost.isExpert && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Expert
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>by {selectedPost.author}</span>
                        <span>•</span>
                        <span>{getTimeAgo(selectedPost.timestamp)}</span>
                        <Badge variant="outline" className="text-xs">
                          {forumCategories.find(c => c.id === selectedPost.category)?.name}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{selectedPost.content}</p>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleLikeToggle(selectedPost.id, selectedPost.likedByUser || false)}
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            selectedPost.likedByUser ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${selectedPost.likedByUser ? 'fill-current' : ''}`} />
                          {selectedPost.likes} likes
                        </button>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MessageSquare className="w-4 h-4" />
                          {selectedPost.replies} replies
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Comments ({postComments.length})</h4>
                  
                  {/* Add Comment */}
                  <div className="mb-6 space-y-3">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button onClick={() => handleAddComment(selectedPost.id)}>
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {postComments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                    ) : (
                      postComments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-sm">{comment.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-500">{getTimeAgo(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600">
                              <ThumbsUp className="w-3 h-3" />
                              {comment.likes > 0 && comment.likes}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Challenge Progress Dialog */}
      <Dialog open={isChallengeDialogOpen} onOpenChange={setIsChallengeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Challenge Progress</DialogTitle>
            <DialogDescription>
              {selectedChallenge?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedChallenge && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{selectedChallenge.description}</p>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Progress</span>
                  <span>{selectedChallenge.progress}%</span>
                </div>
                <Progress value={selectedChallenge.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdateChallengeProgress(10)}
                  className="w-full"
                >
                  +10%
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdateChallengeProgress(25)}
                  className="w-full"
                >
                  +25%
                </Button>
                <Button 
                  onClick={() => handleUpdateChallengeProgress(100 - selectedChallenge.progress)}
                  className="w-full"
                >
                  Complete
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Track your daily progress and earn {selectedChallenge.reward} points upon completion!
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
