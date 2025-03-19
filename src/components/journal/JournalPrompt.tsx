
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { transcribeAudio } from "@/services/transcriptionService";

export const JournalPrompt: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    const savedKey = localStorage.getItem("openai-api-key");
    return savedKey || "";
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem("openai-api-key"));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Clean up on unmount
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

  const saveApiKey = () => {
    localStorage.setItem("openai-api-key", apiKey);
    setShowApiKeyInput(false);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved to local storage",
    });
  };

  const startRecording = async () => {
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to use transcription",
        variant: "destructive",
      });
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
          // Process the recorded audio for transcription
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setIsTranscribing(true);
          
          // Send to Whisper API for transcription
          const transcribedText = await transcribeAudio(audioBlob, apiKey);
          setTranscription(transcribedText);
        } catch (error) {
          console.error("Transcription error:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          
          // Special handling for API key errors
          if (errorMessage.includes("API key")) {
            setShowApiKeyInput(true);
          }
          
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
      
      // Start timer
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
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSave = () => {
    // In a real app, you would save this transcription to your database
    toast({
      title: "Transcription complete",
      description: "Your journal entry has been created.",
    });
    console.log("Transcription text:", transcription);
    // Reset component state after saving
    setTranscription("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderApiKeyInput = () => (
    <div className="flex flex-col gap-4 w-full max-w-xl mx-auto p-4 border rounded-lg shadow-sm">
      <Alert>
        <AlertDescription>
          You need an OpenAI API key to use the transcription service. This key will be stored in your browser only.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="apiKey">OpenAI API Key</Label>
        <Input
          id="apiKey"
          type="password" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..." 
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Your API key is stored locally in your browser and never sent to our servers.
        </p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button onClick={() => setShowApiKeyInput(false)} variant="outline">
          Cancel
        </Button>
        <Button onClick={saveApiKey} disabled={!apiKey}>
          Save API Key
        </Button>
      </div>
    </div>
  );

  const renderPromptView = () => (
    <section
      className="flex flex-col items-center gap-7 w-full px-0 py-[143px] cursor-pointer"
      onClick={startRecording}
      aria-label="Click to start voice journaling"
    >
      <div className="flex items-center gap-[13px]">
        <div className="w-2 h-2 rounded-full bg-[rgba(0,0,0,0.8)]" />
        <div className="w-2 h-2 rounded-full bg-[rgba(0,0,0,0.8)]" />
        <div className="w-2 h-2 rounded-full bg-[rgba(0,0,0,0.8)]" />
        <div className="w-2 h-2 rounded-full bg-[rgba(0,0,0,0.8)]" />
        <div className="w-2 h-2 rounded-full bg-[rgba(0,0,0,0.8)]" />
      </div>
      <div className="text-[rgba(0,0,0,0.3)] text-sm italic">
        Speak to journal
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

  if (showApiKeyInput) {
    return renderApiKeyInput();
  }

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
