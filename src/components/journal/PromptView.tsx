
import React from "react";
import { Keyboard } from "lucide-react";

interface PromptViewProps {
  onStartRecording: () => void;
  onStartTyping: () => void;
}

export const PromptView: React.FC<PromptViewProps> = ({ 
  onStartRecording,
  onStartTyping 
}) => {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="flex flex-col items-center gap-7 w-full px-0 py-[100px] cursor-pointer">
        <div className="flex gap-12 items-center">
          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={onStartRecording}
            aria-label="Click to start voice journaling"
          >
            <img 
              src="/lovable-uploads/27d42274-817b-49d7-8fbf-636a3b843171.png" 
              alt="Microphone" 
              className="w-16 h-16"
            />
          </div>
          
          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={onStartTyping}
            aria-label="Click to start typing journal entry"
          >
            <img 
              src="/lovable-uploads/3d5db38b-8b2f-4386-abe0-6b81f61bafc4.png" 
              alt="Keyboard" 
              className="w-16 h-16"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
