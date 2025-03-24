
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
import { JournalEntries } from "./JournalEntries";
import { Header } from "./Header";
import { WeekdayIndicator } from "./WeekdayIndicator";

export const JournalPrompt: React.FC = () => {
  const { toast } = useToast();
  const { checkAuth } = useAuthCheck();
  const { handleError } = useErrorHandler();
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [typedEntry, setTypedEntry] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const {
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
  } = useAudioRecorder();

  const handleStartRecording = async () => {
    if (!checkAuth("create journal entries")) {
      return;
    }
    
    try {
      await startRecording();
    } catch (error) {
      console.error("Error starting recording:", error);
      // Error handling is done within startRecording
    }
  };

  const handleStartTyping = async () => {
    if (!checkAuth("create journal entries")) {
      return;
    }
    
    setIsTypingMode(true);
    setTypedEntry("");
    setImageFile(null);
  };

  const handleSave = async (content: string) => {
    if (!checkAuth("save journal entries")) {
      return;
    }

    try {
      await saveJournalEntry(content, selectedDate, imageFile);
      
      toast({
        title: "Journal Entry Saved",
        description: "Your journal entry has been saved successfully.",
      });
      
      resetTranscription();
      setIsTypingMode(false);
      setTypedEntry("");
      setImageFile(null);
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
    setImageFile(null);
  };

  if (isTranscribing) {
    return <>
      <Header selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <TranscribingView />
    </>;
  }

  if (isRecording) {
    return <>
      <Header selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <RecordingView 
        recordingTime={recordingTime} 
        onStopRecording={stopRecording}
        permissionState={permissionState}
        showPermissionPrompt={showPermissionPrompt}
        recordingError={recordingError}
      />
    </>;
  }

  if (transcription) {
    return <>
      <Header selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <TranscriptionView 
        transcription={transcription}
        onTranscriptionChange={setTranscription}
        onCancel={handleCancel}
        onSave={() => handleSave(transcription)}
        imageFile={imageFile}
        onImageChange={setImageFile}
      />
    </>;
  }

  if (isTypingMode) {
    return <>
      <Header selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <TranscriptionView 
        transcription={typedEntry}
        onTranscriptionChange={setTypedEntry}
        onCancel={handleCancel}
        onSave={() => handleSave(typedEntry)}
        imageFile={imageFile}
        onImageChange={setImageFile}
      />
    </>;
  }

  return (
    <div className="flex flex-col items-stretch w-full">
      <Header selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <WeekdayIndicator selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <PromptView 
        onStartRecording={handleStartRecording}
        onStartTyping={handleStartTyping}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <JournalEntries selectedDate={selectedDate} />
    </div>
  );
};
