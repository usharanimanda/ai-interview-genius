import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { pipeline } from '@huggingface/transformers';
import { Camera, Mic, Video } from 'lucide-react';

export const VideoInterview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stream]);

  // Start a new timer effect when recording starts/stops
  useEffect(() => {
    if (isRecording && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        setTime(elapsedSeconds);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startInterview = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsRecording(true);
      startTimeRef.current = Date.now();
      setTime(0);
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setTime(elapsedSeconds);
        }
      }, 1000);

      toast({
        title: "Interview Started",
        description: "Connected with recruitment officer",
      });

      // Initialize emotion detection
      const classifier = await pipeline(
        "image-classification",
        "onnx-community/mobilenetv4_conv_small.e2400_r224_in1k",
        { device: "webgpu" }
      );

      // Periodic emotion analysis
      const analysisInterval = setInterval(async () => {
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg');
            const result = await classifier(imageData);
            if (Array.isArray(result) && result.length > 0 && 'label' in result[0]) {
              setAnalysis(result[0].label);
            }
          }
        }
      }, 5000);

      return () => clearInterval(analysisInterval);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access camera or microphone",
      });
    }
  };

  const stopInterview = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsRecording(false);
      // Don't reset the time when stopping
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      toast({
        title: "Interview Completed",
        description: `Interview duration: ${formatTime(time)}`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Video Interview</h2>
          <div className="flex items-center gap-4">
            {isRecording && (
              <div className="text-sm font-medium">
                Time: {formatTime(time)}
              </div>
            )}
            {analysis && (
              <div className="text-sm text-muted-foreground">
                Current Analysis: {analysis}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
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
          
          {/* Recruitment Officer Video */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {isRecording ? (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="mb-2">
                    <Camera className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="font-medium">Recruitment Officer</p>
                  <p className="text-sm opacity-80">Connected</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <p>Waiting to connect...</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button
              onClick={startInterview}
              className="space-x-2"
            >
              <Video className="w-4 h-4" />
              <span>Start Interview</span>
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={stopInterview}
              className="space-x-2"
            >
              <span>End Interview</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};