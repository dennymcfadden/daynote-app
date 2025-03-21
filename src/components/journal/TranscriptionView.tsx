
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptionViewProps {
  transcription: string;
  onTranscriptionChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const TranscriptionView: React.FC<TranscriptionViewProps> = ({
  transcription,
  onTranscriptionChange,
  onCancel,
  onSave,
}) => {
  return (
    <div className="flex flex-col gap-3 w-full max-w-xl mx-auto px-4">
      <Textarea
        className="min-h-[200px]"
        value={transcription}
        onChange={(e) => onTranscriptionChange(e.target.value)}
        placeholder="Your transcribed text will appear here..."
      />
      <div className="flex justify-end gap-3 mt-2">
        <Button variant="outline" onClick={onCancel}>
          Discard
        </Button>
        <Button onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
};
