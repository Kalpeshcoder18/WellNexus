import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Send, Bot, User, Heart, Calendar, Clock, TrendingUp, 
  Brain, Smile, MessageSquare, FileText, BarChart3, 
  Info, Shield, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';

interface TherapyDashboardProps {
  userProfile: any;
}

interface Message {
  id: string;
  sender: 'user' | 'therapist';
  content: string;
  timestamp: Date;
}

const therapyTopics = [
  { id: 'stress', label: 'Stress Management', icon: Brain, color: 'bg-purple-100 text-purple-600' },
  { id: 'anxiety', label: 'Anxiety Relief', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { id: 'sleep', label: 'Sleep Issues', icon: Clock, color: 'bg-blue-100 text-blue-600' },
  { id: 'motivation', label: 'Motivation', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
];

const sessionHistory = [
  { date: '2025-10-28', topic: 'Stress Management', duration: '45 min', rating: 5 },
  { date: '2025-10-25', topic: 'Sleep Issues', duration: '30 min', rating: 4 },
  { date: '2025-10-22', topic: 'Anxiety Relief', duration: '40 min', rating: 5 },
  { date: '2025-10-19', topic: 'Motivation', duration: '35 min', rating: 4 },
];

const aiResponses: { [key: string]: string[] } = {
  default: [
    "I'm here to support you. Can you tell me more about what's on your mind?",
    "That sounds challenging. How have you been coping with this?",
    "Thank you for sharing. What would you like to explore today?",
    "I appreciate you opening up. Let's work through this together.",
  ],
  stress: [
    "Stress is a natural response. Let's explore some techniques to manage it better. Have you tried deep breathing exercises?",
    "I hear that you're feeling stressed. What are the main sources of stress in your life right now?",
    "Managing stress is important for overall wellbeing. Would you like to try a quick relaxation exercise?",
  ],
  anxiety: [
    "Anxiety can be overwhelming. Remember, you're not alone in this. What triggers your anxiety most?",
    "Let's work on some grounding techniques. Can you name 5 things you can see right now?",
    "Your feelings are valid. Have you noticed any patterns in when your anxiety tends to increase?",
  ],
  sleep: [
    "Good sleep is essential for mental health. What's your current bedtime routine like?",
    "Sleep issues often have underlying causes. Have you noticed anything specific that keeps you awake?",
    "Let's create a sleep hygiene plan together. What time do you typically try to go to bed?",
  ],
  motivation: [
    "Motivation can fluctuate, and that's normal. What are your current goals?",
    "Sometimes breaking big goals into smaller steps helps. What's one small thing you'd like to accomplish today?",
    "Tell me about a time when you felt really motivated. What was different then?",
  ],
};

export default function TherapyDashboard({ userProfile }: TherapyDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'therapist',
      content: `Hello ${userProfile.name || 'there'}! I'm your AI wellness companion. I'm here to provide a safe, supportive space for you to explore your thoughts and feelings. How are you feeling today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const detectTopic = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('stress') || lowerMessage.includes('stressed')) return 'stress';
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) return 'anxiety';
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) return 'sleep';
    if (lowerMessage.includes('motivation') || lowerMessage.includes('motivated') || lowerMessage.includes('goal')) return 'motivation';
    return 'default';
  };

  const getAIResponse = (userMessage: string): string => {
    const topic = detectTopic(userMessage);
    const responses = aiResponses[topic] || aiResponses.default;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'therapist',
        content: getAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickTopic = (topic: string) => {
    setSelectedTopic(topic);
    const topicMessages: { [key: string]: string } = {
      stress: "I've been feeling really stressed lately and need some help managing it.",
      anxiety: "I'm experiencing anxiety and would like to talk about it.",
      sleep: "I'm having trouble sleeping and it's affecting my daily life.",
      motivation: "I'm struggling with motivation and need some guidance.",
    };
    setInputMessage(topicMessages[topic] || '');
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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-purple-600" />
            Therapy & Counseling
          </h1>
          <p className="text-gray-600">Professional support for your mental wellbeing</p>
        </div>
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          AI Available
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - User Profile & Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-4"
        >
          {/* User Profile Card */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-purple-600" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-16 h-16 border-2 border-purple-200">
                    <AvatarFallback className="bg-purple-500 text-white text-xl">
                      {userProfile.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg">{userProfile.name || 'User'}</div>
                    <div className="text-sm text-gray-600">{userProfile.age || 'N/A'} years old</div>
                    <Badge variant="secondary" className="mt-1">Active Member</Badge>
                  </div>
                </div>
                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Sessions</span>
                    <span className="font-semibold">{sessionHistory.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-semibold">4 sessions</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg. Rating</span>
                    <span className="font-semibold text-yellow-600">4.5 ⭐</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mental Health Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Stress Level</span>
                  <span className="text-green-600">↓ Improving</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Sleep Quality</span>
                  <span className="text-blue-600">↑ Better</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Mood Score</span>
                  <span className="text-purple-600">→ Stable</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                Quick Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {therapyTopics.map((topic) => {
                  const TopicIcon = topic.icon;
                  return (
                    <Button
                      key={topic.id}
                      variant="outline"
                      className={`w-full justify-start gap-2 ${selectedTopic === topic.id ? 'border-purple-500 bg-purple-50' : ''}`}
                      onClick={() => handleQuickTopic(topic.id)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${topic.color}`}>
                        <TopicIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{topic.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Session History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessionHistory.slice(0, 3).map((session, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium">{session.topic}</span>
                      <span className="text-xs text-yellow-600">{'⭐'.repeat(session.rating)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-[calc(100vh-180px)] flex flex-col">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">AI Wellness Companion</CardTitle>
                  <p className="text-xs text-gray-600">Always here to listen and support</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className={`w-8 h-8 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                        <AvatarFallback className="text-white">
                          {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'items-end' : ''}`}>
                        <div
                          className={`p-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white rounded-tr-sm'
                              : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block px-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8 bg-purple-500">
                        <AvatarFallback className="text-white">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message here..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>Your conversations are private and confidential</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}