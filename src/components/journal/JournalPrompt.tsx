
import React, { useState } from "react";
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
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [typedEntry, setTypedEntry] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const {
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
  } = useAudioRecorder();

  const handleStartRecording = async () => {
    if (!checkAuth("create journal entries")) {
      return;
    }
    
    startRecording();
  };

  const handleStartTyping = async () => {
    if (!checkAuth("create journal entries")) {
      return;
    }
    
    setIsTypingMode(true);
    setTypedEntry("");
  };

  const handleSave = async (content: string) => {
    if (!checkAuth("save journal entries")) {
      return;
    }

    try {
      await saveJournalEntry(content, selectedDate);
      
      toast({
        title: "Journal Entry Saved",
        description: "Your journal entry has been saved successfully.",
      });
      
      resetTranscription();
      setIsTypingMode(false);
      setTypedEntry("");
    } catch (error) {
      handleError("Saving Entry", error);
    }
  };

  const handleCancel = () => {
    if (isTypingMode) {
      setIsTypingMode(false);
      setTypedEntry("");
    } else {
      resetTranscription();
    }
  };

  if (isTranscribing) {
    return <TranscribingView />;
  }

  if (isRecording) {
    return <RecordingView 
      recordingTime={recordingTime} 
      onStopRecording={stopRecording}
      permissionState={permissionState}
      showPermissionPrompt={showPermissionPrompt}
    />;
  }

  if (transcription) {
    return <TranscriptionView 
      transcription={transcription}
      onTranscriptionChange={setTranscription}
      onCancel={handleCancel}
      onSave={() => handleSave(transcription)}
    />;
  }

  if (isTypingMode) {
    return <TranscriptionView 
      transcription={typedEntry}
      onTranscriptionChange={setTypedEntry}
      onCancel={handleCancel}
      onSave={() => handleSave(typedEntry)}
    />;
  }

  return <PromptView 
    onStartRecording={handleStartRecording}
    onStartTyping={handleStartTyping}
    selectedDate={selectedDate}
    onDateChange={setSelectedDate}
  />;
};
