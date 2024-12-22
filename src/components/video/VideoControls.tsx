import React from 'react';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';

interface VideoControlsProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const VideoControls = ({ isRecording, onStart, onStop }: VideoControlsProps) => {
  return (
    <div className="flex justify-center space-x-4">
      {!isRecording ? (
        <Button onClick={onStart} className="space-x-2">
          <Video className="w-4 h-4" />
          <span>Start Interview</span>
        </Button>
      ) : (
        <Button variant="destructive" onClick={onStop} className="space-x-2">
          <span>End Interview</span>
        </Button>
      )}
    </div>
  );
};