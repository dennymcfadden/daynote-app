import React from "react";

export const JournalPrompt: React.FC = () => {
  const handleVoicePrompt = () => {
    // In a real implementation, this would trigger voice recording
    alert("Voice recording feature would start here");
  };

  return (
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
  );
};
