import React from 'react';
import { Camera } from 'lucide-react';

interface AIAvatarProps {
  isRecording: boolean;
}

export const AIAvatar = ({ isRecording }: AIAvatarProps) => {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
      {isRecording ? (
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <div className="text-white text-center space-y-4">
            <div className="mb-2">
              <Camera className="w-12 h-12 mx-auto animate-pulse" />
            </div>
            <p className="font-medium text-xl">AI Interviewer</p>
            <p className="text-sm opacity-80">Active and Listening</p>
            <div className="w-3 h-3 bg-green-400 rounded-full mx-auto animate-ping" />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <p>AI Interviewer - Ready to Start</p>
        </div>
      )}
    </div>
  );
};