// /mnt/data/TherapyDashboard.tsx
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

export default function TherapyDashboard({ userProfile }: TherapyDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'therapist',
      content: `Hello ${userProfile?.name || 'there'}! I'm your AI wellness companion. I'm here to provide a safe, supportive space for you to explore your thoughts and feelings. How are you feeling today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // build a trimmed conversation suitable for the model (keeps last N messages)
  const buildModelHistory = (history: Message[], maxEntries = 12) => {
    // convert each message to { role, content }
    const converted = history.map(m => ({
      role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: m.content
    }));
    return converted.slice(-maxEntries);
  };

  // send conversation to backend route and return assistant reply text
 // ---------- REPLACE sendToAI ----------
const sendToAI = async (history: Message[]): Promise<string> => {
  try {
    const systemPrompt = {
      role: "system",
      content:
        "You are a compassionate mental health assistant. Be supportive, empathetic and safe. Ask clarifying questions first."
    };

    const messagesForAPI = [systemPrompt, ...history.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.content
    })).slice(-12)];

    const token = localStorage.getItem("token") || undefined;

    // IMPORTANT: if your frontend and backend are on different ports without a proxy,
    // replace '/api/therapy/chat' with 'http://localhost:5000/api/therapy/chat'
    const endpoint = "/api/therapy/chat";

    console.log("[Therapy] sending to backend:", { endpoint, messagesForAPI, tokenPresent: !!token });

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ messages: messagesForAPI })
    });

    // debug: log status and raw text
    const text = await res.text();
    console.log("[Therapy] raw response text:", text);

    let json;
    try { json = JSON.parse(text); } catch (e) { json = null; }

    if (!res.ok) {
      console.error("[Therapy] backend responded non-OK:", res.status, json || text);
      // show friendly message to UI
      return "Sorry, the assistant is currently unavailable (backend error).";
    }

    // Prefer { reply } if backend returns it
    if (json?.reply && typeof json.reply === "string") {
      console.log("[Therapy] reply (reply field):", json.reply);
      return json.reply;
    }

    // Try v1beta candidates shape: candidates[].content.parts[].text
    if (json?.raw && json.raw.candidates && Array.isArray(json.raw.candidates)) {
      const c = json.raw.candidates[0];
      if (c?.content?.parts && Array.isArray(c.content.parts)) {
        const reply = c.content.parts.map((p: any) => p.text || p).join("\n");
        console.log("[Therapy] reply (raw.candidates):", reply);
        return reply;
      }
    }

    // Try top-level candidates (some backends return directly)
    if (json?.candidates && Array.isArray(json.candidates)) {
      const c = json.candidates[0];
      if (c?.content?.parts && Array.isArray(c.content.parts)) {
        return c.content.parts.map((p: any) => p.text || p).join("\n");
      } else if (typeof c === "string") {
        return c;
      }
    }

    // fallback: if response has 'raw' with nested content
    if (json?.raw) {
      // attempt to extract text in common places
      const raw = json.raw;
      if (raw?.candidates?.[0]?.content?.parts) {
        return raw.candidates[0].content.parts.map((p: any) => p.text || p).join("\n");
      }
      if (raw?.candidates?.[0]?.output) return raw.candidates[0].output;
    }

    // last fallback: use text body
    if (text && text.length < 10000) return text;

    return "I'm here with you — could you say a little more?";
  } catch (err) {
    console.error("[Therapy] sendToAI error:", err);
    return "I’m having trouble contacting the assistant at the moment. Please try again.";
  }
};

// ---------- REPLACE handleSendMessage ----------
const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    sender: "user",
    content: inputMessage.trim(),
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage("");
  setIsTyping(true);

  // capture current messages to send (including the new user message)
  const historyToSend = [...messages, userMessage];

  // TRY to call backend and receive reply
  const aiReply = await sendToAI(historyToSend);

  console.log("[Therapy] aiReply:", aiReply);

  const aiMessage: Message = {
    id: (Date.now() + 1).toString(),
    sender: "therapist",
    content: aiReply,
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, aiMessage]);
  setIsTyping(false);
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

  // topic detection (used nowhere internally for AI, only for quick UI categorization)
  const detectTopic = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('stress') || lowerMessage.includes('stressed')) return 'stress';
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) return 'anxiety';
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) return 'sleep';
    if (lowerMessage.includes('motivation') || lowerMessage.includes('motivated') || lowerMessage.includes('goal')) return 'motivation';
    return 'default';
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
                          {message.timestamp instanceof Date
                            ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
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
