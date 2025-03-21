
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface RecordingViewProps {
  recordingTime: number;
  onStopRecording: () => void;
}

export const RecordingView: React.FC<RecordingViewProps> = ({ 
  recordingTime, 
  onStopRecording 
}) => {
  const MAX_RECORDING_TIME = 120; // 2 minutes in seconds
  const remainingTime = MAX_RECORDING_TIME - recordingTime;
  const progressPercentage = (recordingTime / MAX_RECORDING_TIME) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-3 py-8 w-full">
      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-500 animate-pulse"></div>
      </div>
      
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm">
          <span>Recording</span>
          <span className="font-medium">{formatTime(remainingTime)} remaining</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
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
