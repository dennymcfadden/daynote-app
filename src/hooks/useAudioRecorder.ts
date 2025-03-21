
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAudioPermission } from "@/hooks/useAudioPermission";
import { useTranscriptionState } from "@/hooks/useTranscriptionState";
import { getOptimalAudioConfig, getAudioConstraints } from "@/utils/mediaRecorderUtils";

export const useAudioRecorder = () => {
  const MAX_RECORDING_TIME = 120; // 2 minutes in seconds
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const {
    permissionState,
    showPermissionPrompt,
    setShowPermissionPrompt,
    updatePermissionState
  } = useAudioPermission();

  const {
    transcription,
    setTranscription,
    isTranscribing,
    processAudioForTranscription,
    resetTranscription
  } = useTranscriptionState();

  // Cleanup function for timers and media recorder
  useEffect(() => {
    return () => {
      stopTimerAndRecorder();
    };
  }, []);

  const stopTimerAndRecorder = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error("Error stopping media recorder:", e);
      }
    }
    
    // Always clean up the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Effect to automatically stop recording when reaching the time limit
  useEffect(() => {
    if (isRecording && recordingTime >= MAX_RECORDING_TIME) {
      stopRecording();
      toast({
        title: "Recording complete",
        description: "Maximum recording time reached.",
      });
    }
  }, [recordingTime, isRecording]);

  const startRecording = async () => {
    // Reset state
    audioChunksRef.current = [];
    setRecordingTime(0);
    setRecordingError(null);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Make sure any previous recording session is properly closed
    stopTimerAndRecorder();
    
    try {
      const constraints = getAudioConstraints();
      
      console.log("Requesting microphone access with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      const { mimeType, options } = getOptimalAudioConfig();
      console.log(`Using MIME type: ${options.mimeType || 'default'}`);
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log(`Received audio chunk of size: ${event.data.size}`);
          audioChunksRef.current.push(event.data);
        } else {
          console.warn("Received empty audio data");
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setRecordingError("Recording error occurred");
        stopRecording();
      };
      
      mediaRecorder.onstop = async () => {
        console.log("MediaRecorder stopped, processing audio...");
        
        if (audioChunksRef.current.length === 0) {
          console.warn("No audio data collected");
          toast({
            title: "Recording Error",
            description: "No audio data was captured. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log(`Created audio blob: size=${audioBlob.size}, type=${audioBlob.type}`);
        
        if (audioBlob.size > 0) {
          await processAudioForTranscription(audioBlob, mimeType);
        } else {
          toast({
            title: "Recording Error",
            description: "Empty audio recording. Please try again.",
            variant: "destructive"
          });
        }
      };
      
      // We need to make sure we request data frequently on iOS
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      
      // Start the MediaRecorder with timeslice parameter for iOS
      if (isIOS) {
        mediaRecorder.start(1000); // Request data every second on iOS
      } else {
        mediaRecorder.start();
      }
      
      setIsRecording(true);
      
      // Create a new interval timer that increments every second
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          console.log("Recording time incremented to:", newTime);
          return newTime;
        });
      }, 1000);
      
      // Update permission state
      await updatePermissionState();
      
      // Hide the permission prompt if we got this far
      setShowPermissionPrompt(false);
      
    } catch (error) {
      console.error("Microphone access error:", error);
      
      // Show permission prompt if we get an error
      if (error instanceof DOMException && 
          (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')) {
        setShowPermissionPrompt(true);
      }
      
      // Create a more helpful error message for mobile users
      let errorMessage = "Could not access microphone.";
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = "Microphone access was denied. Please check your browser settings and ensure DayNote has permission to use your microphone.";
          
          // iOS Safari specific guidance
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            errorMessage += " On iOS, you may need to go to Settings > Safari > Microphone and ensure it's enabled for this site.";
          }
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No microphone detected. Please ensure your device has a working microphone.";
        } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
          errorMessage = "Your microphone is busy or unavailable. Please close other apps that might be using it.";
        } else if (error.name === 'SecurityError') {
          errorMessage = "Microphone access is blocked due to security restrictions. Please try using HTTPS or check your browser settings.";
        }
      }
      
      setRecordingError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    
    if (mediaRecorderRef.current && isRecording) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            console.log(`Stopping track: ${track.kind}`);
            track.stop();
          });
          streamRef.current = null;
        }
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        toast({
          title: "Error",
          description: "There was a problem stopping the recording.",
          variant: "destructive"
        });
      }
    }
  };

  return {
    isRecording,
    recordingTime,
    recordingError,
    transcription,
    setTranscription,
    isTranscribing,
    permissionState,
    showPermissionPrompt,
    startRecording,
    stopRecording,
    resetTranscription
  };
};
