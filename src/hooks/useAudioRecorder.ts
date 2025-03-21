
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { transcribeAudio } from "@/services/journalService";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export const useAudioRecorder = () => {
  const MAX_RECORDING_TIME = 120; // 2 minutes in seconds
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  // Check for microphone permission status on component mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Check if the browser supports permissions API
        if (navigator.permissions && navigator.permissions.query) {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissionState(permissionStatus.state);
          
          // Listen for permission changes
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state);
          };
        }
      } catch (error) {
        console.log("Permission check not supported:", error);
      }
    };
    
    checkPermission();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

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
    audioChunksRef.current = [];
    
    try {
      // On iOS, we need to be more direct with the constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      console.log("Requesting microphone access with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Determine the best MIME type for the browser
      let mimeType = 'audio/webm';
      const options: MediaRecorderOptions = {};
      
      // Check if the browser supports the preferred MIME type
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options.mimeType = 'audio/mp4';
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        options.mimeType = 'audio/ogg';
        mimeType = 'audio/ogg';
      }
      
      console.log(`Using MIME type: ${options.mimeType || 'default'}`);
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          console.log("Recording complete, audio blob size:", audioBlob.size, "type:", audioBlob.type);
          setIsTranscribing(true);
          
          const transcribedText = await transcribeAudio(audioBlob);
          setTranscription(transcribedText);
        } catch (error) {
          handleError("Transcription", error);
        } finally {
          setIsTranscribing(false);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
      // Update permission state if possible
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionState(permissionStatus.state);
      }
      
    } catch (error) {
      console.error("Microphone access error:", error);
      
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
      
      handleError("Microphone", new Error(errorMessage));
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

  const resetTranscription = () => {
    setTranscription("");
  };

  return {
    isRecording,
    recordingTime,
    transcription,
    setTranscription,
    isTranscribing,
    permissionState,
    startRecording,
    stopRecording,
    resetTranscription
  };
};
