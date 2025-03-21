
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RecordingViewProps {
  recordingTime: number;
  onStopRecording: () => void;
  permissionState?: PermissionState | null;
  showPermissionPrompt?: boolean;
  recordingError?: string | null;
}

export const RecordingView: React.FC<RecordingViewProps> = ({ 
  recordingTime, 
  onStopRecording,
  permissionState,
  showPermissionPrompt,
  recordingError
}) => {
  const MAX_RECORDING_TIME = 120; // 2 minutes in seconds
  
  // Use local state to track the display time
  const [displayTime, setDisplayTime] = useState(MAX_RECORDING_TIME);
  
  // Update the display time whenever recording time changes
  useEffect(() => {
    const remaining = MAX_RECORDING_TIME - recordingTime;
    setDisplayTime(remaining);
    console.log("Recording time updated:", recordingTime, "Remaining:", remaining);
  }, [recordingTime]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Detect if we're on iOS
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isIOSChrome = isIOS && /CriOS/.test(navigator.userAgent);
  const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  // Show a permission prompt if microphone access is denied or we specifically need to show it
  if (permissionState === 'denied' || showPermissionPrompt || recordingError) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 w-full max-w-md mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Microphone Access {recordingError ? "Error" : "Denied"}</AlertTitle>
          <AlertDescription>
            {recordingError ? (
              <p className="mb-2">{recordingError}</p>
            ) : (
              <p className="mb-2">Please enable microphone access in your browser settings.</p>
            )}
            
            {isIOSChrome ? (
              <ul className="list-disc pl-4 text-sm">
                <li className="mb-1">For Chrome on iOS: Tap the three dots → Settings → Site Settings → Microphone, and ensure this site is allowed.</li>
                <li className="mb-1">You may need to refresh the page after changing permissions.</li>
                <li className="mb-1">If issues persist, try using Safari which has better microphone support on iOS.</li>
              </ul>
            ) : isIOSSafari ? (
              <ul className="list-disc pl-4 text-sm">
                <li className="mb-1">Go to Settings app → Safari → Camera & Microphone Access.</li>
                <li className="mb-1">Make sure Safari has microphone permission in your device settings.</li>
                <li className="mb-1">When prompted by Safari, choose "Allow" for microphone access.</li>
                <li className="mb-1">You may need to reload the page after granting permission.</li>
              </ul>
            ) : isIOS ? (
              <ul className="list-disc pl-4 text-sm">
                <li className="mb-1">On iPhone: Go to Settings → Safari → Microphone and enable it for this site.</li>
                <li className="mb-1">You may need to reload the page after changing settings.</li>
              </ul>
            ) : (
              <ul className="list-disc pl-4 text-sm">
                <li className="mb-1">On Android: Tap the lock icon in your browser address bar and enable the microphone.</li>
                <li className="mb-1">On desktop: Look for the camera/microphone icon in your browser address bar.</li>
              </ul>
            )}
          </AlertDescription>
        </Alert>
        <Button onClick={onStopRecording}>
          Return to Journal
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-8 w-full">
      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-500 animate-pulse"></div>
      </div>
      
      <div className="text-2xl font-medium mt-4">
        {formatTime(displayTime)}
      </div>
      
      <Button 
        variant="outline" 
        onClick={onStopRecording}
        className="mt-6"
      >
        Stop Recording
      </Button>
    </div>
  );
};
