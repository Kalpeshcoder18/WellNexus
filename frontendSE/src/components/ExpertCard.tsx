import React from 'react';
import { MessageSquare, Calendar, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

interface ExpertCardProps {
  expert: {
    id: number;
    name: string;
    title: string;
    specialties: string[];
    rating: number;
    consultations: number;
    avatar: string;
    isOnline: boolean;
    instagramUrl: string;
    instagramHandle: string;
  };
}

export default function ExpertCard({ expert }: ExpertCardProps) {
  const handleContactExpert = () => {
    window.open(expert.instagramUrl, '_blank');
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-lg">{expert.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{expert.name}</h3>
            <p className="text-sm text-gray-600">{expert.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${expert.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-gray-500">
                {expert.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{expert.rating}/5.0</span>
            <span className="text-sm text-gray-600">({expert.consultations} sessions)</span>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {expert.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">DM on Instagram:</p>
              <a 
                href={expert.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
              >
                {expert.instagramUrl}
              </a>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={handleContactExpert}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={handleContactExpert}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
