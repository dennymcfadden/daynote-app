
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { saveJournalEntry } from "@/services/journalService";
import { PromptView } from "./PromptView";
import { RecordingView } from "./RecordingView";
import { TranscribingView } from "./TranscribingView";
import { TranscriptionView } from "./TranscriptionView";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export const JournalPrompt: React.FC = () => {
  const { toast } = useToast();
  const { checkAuth } = useAuthCheck();
  const { handleError } = useErrorHandler();
  
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
    if (!checkAuth("create journal entries")) {
      return;
    }
    
    startRecording();
  };

  const handleSave = async () => {
    if (!checkAuth("save journal entries")) {
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
      handleError("Saving Entry", error);
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
