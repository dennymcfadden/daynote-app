
import React from "react";
import { Button } from "@/components/ui/button";

interface RecordingViewProps {
  recordingTime: number;
  onStopRecording: () => void;
}

export const RecordingView: React.FC<RecordingViewProps> = ({ 
  recordingTime, 
  onStopRecording 
}) => {
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
      <div className="text-lg font-medium">{formatTime(recordingTime)}</div>
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
