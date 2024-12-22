import React from 'react';
import { Camera } from 'lucide-react';

interface AIAvatarProps {
  isRecording: boolean;
}

export const AIAvatar = ({ isRecording }: AIAvatarProps) => {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
      {isRecording ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="/lovable-uploads/6133d6fa-7dc2-4469-9a96-d912929085bf.png"
              alt="AI Interviewer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="relative text-white text-center space-y-4 z-10">
            <div className="mb-2">
              <Camera className="w-8 h-8 mx-auto animate-pulse opacity-75" />
            </div>
            <p className="font-medium text-xl text-shadow">Professional AI Interviewer</p>
            <p className="text-sm opacity-90 text-shadow">Active and Listening</p>
            <div className="w-3 h-3 bg-green-400 rounded-full mx-auto animate-ping" />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <div className="text-center space-y-2">
            <img 
              src="/lovable-uploads/6133d6fa-7dc2-4469-9a96-d912929085bf.png"
              alt="AI Interviewer"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 opacity-75"
            />
            <p className="text-lg font-medium">AI Interviewer - Ready to Start</p>
          </div>
        </div>
      )}
    </div>
  );
};