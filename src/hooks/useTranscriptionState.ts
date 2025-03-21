
import { useState } from "react";
import { transcribeAudio } from "@/services/journalService";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export const useTranscriptionState = () => {
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { handleError } = useErrorHandler();

  const processAudioForTranscription = async (audioBlob: Blob, mimeType: string) => {
    try {
      console.log("Processing audio blob size:", audioBlob.size, "type:", audioBlob.type);
      setIsTranscribing(true);
      
      const transcribedText = await transcribeAudio(audioBlob);
      setTranscription(transcribedText);
    } catch (error) {
      handleError("Transcription", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const resetTranscription = () => {
    setTranscription("");
  };

  return {
    transcription,
    setTranscription,
    isTranscribing,
    processAudioForTranscription,
    resetTranscription
  };
};
