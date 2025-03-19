
import React, { useState } from "react";
import { VoiceRecorder } from "./VoiceRecorder";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export const JournalPrompt: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleVoicePrompt = () => {
    setIsRecording(true);
  };

  const handleCloseRecording = () => {
    setIsRecording(false);
  };

  const handleTranscriptionComplete = (text: string) => {
    setIsRecording(false);
    // In a real app, you would save this transcription to your database
    toast({
      title: "Transcription complete",
      description: "Your journal entry has been created.",
    });
    console.log("Transcription text:", text);
  };

  return (
    <>
      <section
        className="flex flex-col items-center gap-7 w-full px-0 py-[143px] cursor-pointer"
        onClick={handleVoicePrompt}
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

      <Dialog open={isRecording} onOpenChange={setIsRecording}>
        <DialogContent className="sm:max-w-md">
          <VoiceRecorder 
            onClose={handleCloseRecording} 
            onTranscriptionComplete={handleTranscriptionComplete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
