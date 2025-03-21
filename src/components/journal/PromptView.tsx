
import React from "react";

interface PromptViewProps {
  onStartRecording: () => void;
}

export const PromptView: React.FC<PromptViewProps> = ({ onStartRecording }) => {
  return (
    <section
      className="flex flex-col items-center gap-7 w-full px-0 py-[143px] cursor-pointer"
      onClick={onStartRecording}
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
};
