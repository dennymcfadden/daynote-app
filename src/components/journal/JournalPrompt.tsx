import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { transcribeAudio, saveJournalEntry } from "@/services/journalService";

export const JournalPrompt: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const startRecording = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create journal entries",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setIsTranscribing(true);
          
          const transcribedText = await transcribeAudio(audioBlob);
          setTranscription(transcribedText);
        } catch (error) {
          console.error("Transcription error:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          
          toast({
            title: "Transcription Error",
            description: errorMessage,
            variant: "destructive",
          });
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
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Unable to access your microphone. Please check permissions.",
        variant: "destructive",
      });
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
      
      setTranscription("");
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPromptView = () => (
    <section
      className="flex flex-col items-center gap-7 w-full px-0 py-[143px] cursor-pointer"
      onClick={startRecording}
      aria-label="Click to start voice journaling"
    >
      <div className="w-24 h-24 rounded-3xl flex items-center justify-center bg-[#E9E3E2]">
        <img 
          src="/lovable-uploads/27d42274-817b-49d7-8fbf-636a3b843171.png" 
          alt="Microphone" 
          className="w-12 h-12"
        />
      </div>
    </section>
  );

  const renderRecordingView = () => (
    <div className="flex flex-col items-center gap-3 py-8 w-full">
      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-500 animate-pulse"></div>
      </div>
      <div className="text-lg font-medium">{formatTime(recordingTime)}</div>
      <Button 
        variant="outline" 
        onClick={stopRecording}
        className="mt-4"
      >
        Stop Recording
      </Button>
    </div>
  );

  const renderTranscribingView = () => (
    <div className="flex flex-col items-center gap-3 py-8 w-full">
      <div className="animate-pulse text-lg">Transcribing your recording...</div>
    </div>
  );

  const renderTranscriptionView = () => (
    <div className="flex flex-col gap-3 w-full max-w-xl mx-auto px-4">
      <Textarea
        className="min-h-[200px]"
        value={transcription}
        onChange={(e) => setTranscription(e.target.value)}
        placeholder="Your transcribed text will appear here..."
      />
      <div className="flex justify-end gap-3 mt-2">
        <Button variant="outline" onClick={() => setTranscription("")}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Journal Entry
        </Button>
      </div>
    </div>
  );

  if (isTranscribing) {
    return renderTranscribingView();
  }

  if (isRecording) {
    return renderRecordingView();
  }

  if (transcription) {
    return renderTranscriptionView();
  }

  return renderPromptView();
};
