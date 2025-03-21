
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RecordingViewProps {
  recordingTime: number;
  onStopRecording: () => void;
  permissionState?: PermissionState | null;
  showPermissionPrompt?: boolean;
}

export const RecordingView: React.FC<RecordingViewProps> = ({ 
  recordingTime, 
  onStopRecording,
  permissionState,
  showPermissionPrompt
}) => {
  const MAX_RECORDING_TIME = 120; // 2 minutes in seconds
  const remainingTime = MAX_RECORDING_TIME - recordingTime;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Detect if we're on iOS Chrome
  const isIOSChrome = /iPhone|iPad|iPod/.test(navigator.userAgent) && /CriOS/.test(navigator.userAgent);

  // Show a permission prompt if microphone access is denied or we specifically need to show it
  if (permissionState === 'denied' || showPermissionPrompt) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 w-full max-w-md mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Microphone Access Denied</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Please enable microphone access in your browser settings.</p>
            {isIOSChrome ? (
              <ul className="list-disc pl-4 text-sm">
                <li className="mb-1">For Chrome on iOS: Tap the three dots → Settings → Site Settings → Microphone, and ensure this site is allowed.</li>
                <li className="mb-1">You may need to refresh the page after changing permissions.</li>
                <li className="mb-1">If issues persist, try using Safari which has better microphone support on iOS.</li>
              </ul>
            ) : (
              <ul className="list-disc pl-4 text-sm">
                <li className="mb-1">On iPhone: Go to Settings → Safari → Microphone and enable it for this site.</li>
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
      
      <div className="text-lg font-medium mt-2">
        {formatTime(remainingTime)}
      </div>
      
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-red-500 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${(recordingTime / MAX_RECORDING_TIME) * 100}%` }}
        ></div>
      </div>

      <div className="text-sm text-gray-500 mt-1">
        {Math.floor((recordingTime / MAX_RECORDING_TIME) * 100)}% recorded
      </div>
      
      <Button 
        variant="outline" 
        onClick={onStopRecording}
        className="mt-4"
      >
        Stop Recording
      </Button>
    </div>
  );
};
