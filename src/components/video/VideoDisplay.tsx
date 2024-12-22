import React from 'react';
import { Camera, Mic } from 'lucide-react';

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
}

export const VideoDisplay = ({ videoRef, stream }: VideoDisplayProps) => {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-2">
              <Camera className="w-8 h-8" />
              <Mic className="w-8 h-8" />
            </div>
            <p>Click Start to begin your interview</p>
          </div>
        </div>
      )}
    </div>
  );
};