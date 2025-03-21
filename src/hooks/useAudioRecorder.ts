
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAudioPermission } from "@/hooks/useAudioPermission";
import { useTranscriptionState } from "@/hooks/useTranscriptionState";
import { getOptimalAudioConfig, getAudioConstraints } from "@/utils/mediaRecorderUtils";

export const useAudioRecorder = () => {
  const MAX_RECORDING_TIME = 120; // 2 minutes in seconds
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
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
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    try {
      const constraints = getAudioConstraints();
      
      console.log("Requesting microphone access with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      const { mimeType, options } = getOptimalAudioConfig();
      console.log(`Using MIME type: ${options.mimeType || 'default'}`);
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await processAudioForTranscription(audioBlob, mimeType);
      };
      
      // Start the MediaRecorder
      mediaRecorder.start();
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
      
      throw new Error(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  return {
    isRecording,
    recordingTime,
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
