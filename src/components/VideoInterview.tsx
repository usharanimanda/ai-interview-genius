import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { pipeline } from '@huggingface/transformers';
import { Camera, Mic, Video } from 'lucide-react';
import { AIAvatar } from './ai/AIAvatar';
import { VideoControls } from './video/VideoControls';
import { VideoDisplay } from './video/VideoDisplay';

export const VideoInterview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const classifierRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stream]);

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

  const initializeClassifier = async () => {
    try {
      console.log('Initializing classifier...');
      classifierRef.current = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
        { device: 'webgpu' }
      );
      console.log('Classifier initialized successfully');
    } catch (error) {
      console.error('Error initializing classifier:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize video analysis",
      });
    }
  };

  const captureAndAnalyzeFrame = async () => {
    if (!videoRef.current || !videoRef.current.videoWidth) {
      console.log('Video not ready for capture');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        console.log('Capturing frame...');
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        if (!classifierRef.current) {
          console.log('Classifier not initialized, initializing...');
          await initializeClassifier();
        }
        
        if (classifierRef.current) {
          console.log('Analyzing frame...');
          const result = await classifierRef.current(imageData);
          if (Array.isArray(result) && result.length > 0 && 'label' in result[0]) {
            console.log('Analysis result:', result[0].label);
            setAnalysis(result[0].label);
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing frame:', error);
    }
  };

  const startInterview = async () => {
    try {
      console.log('Starting interview...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Initialize classifier before starting the interview
      await initializeClassifier();
      
      setIsRecording(true);
      startTimeRef.current = Date.now();
      setTime(0);
      
      toast({
        title: "Interview Started",
        description: "Connected with AI Interviewer",
      });

      // Wait for video to be ready before starting analysis
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          // Start periodic analysis after video is ready
          const analysisInterval = setInterval(captureAndAnalyzeFrame, 5000);
          // Store interval for cleanup
          intervalRef.current = analysisInterval;
        };
      }

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
          <VideoDisplay videoRef={videoRef} stream={stream} />
          <AIAvatar isRecording={isRecording} />
        </div>

        <VideoControls 
          isRecording={isRecording}
          onStart={startInterview}
          onStop={stopInterview}
        />
      </Card>
    </div>
  );
};