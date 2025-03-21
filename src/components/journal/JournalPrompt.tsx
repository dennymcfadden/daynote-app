
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { saveJournalEntry } from "@/services/journalService";
import { PromptView } from "./PromptView";
import { RecordingView } from "./RecordingView";
import { TranscribingView } from "./TranscribingView";
import { TranscriptionView } from "./TranscriptionView";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

export const JournalPrompt: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    isRecording,
    recordingTime,
    transcription,
    setTranscription,
    isTranscribing,
    startRecording,
    stopRecording,
    resetTranscription
  } = useAudioRecorder();

  const handleStartRecording = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create journal entries",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    startRecording();
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save journal entries",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      await saveJournalEntry(transcription);
      
      toast({
        title: "Journal Entry Saved",
        description: "Your journal entry has been saved successfully.",
      });
      
      resetTranscription();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      toast({
        title: "Error Saving Entry",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isTranscribing) {
    return <TranscribingView />;
  }

  if (isRecording) {
    return <RecordingView 
      recordingTime={recordingTime} 
      onStopRecording={stopRecording} 
    />;
  }

  if (transcription) {
    return <TranscriptionView 
      transcription={transcription}
      onTranscriptionChange={setTranscription}
      onCancel={resetTranscription}
      onSave={handleSave}
    />;
  }

  return <PromptView onStartRecording={handleStartRecording} />;
};
