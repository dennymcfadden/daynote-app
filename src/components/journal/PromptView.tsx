import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
interface PromptViewProps {
  onStartRecording: () => void;
  onStartTyping: () => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}
export const PromptView: React.FC<PromptViewProps> = ({
  onStartRecording,
  onStartTyping,
  selectedDate,
  onDateChange
}) => {
  const isMobile = useIsMobile();
  return <div className="flex flex-col items-center w-full px-6 pt-12 pb-12">
      <section className={cn("flex flex-col items-center gap-7 w-full px-0 cursor-pointer", isMobile ? "py-[25px]" : "py-[100px]")}>
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-12 items-center`}>
          <div className="flex flex-col items-center cursor-pointer" onClick={onStartRecording} aria-label="Click to start voice journaling">
            <img alt="Microphone" className="w-32 h-32" src="/lovable-uploads/1474fecc-4e3a-4c8b-97fd-6da829516253.png" />
          </div>
          
          <div className="flex flex-col items-center cursor-pointer" onClick={onStartTyping} aria-label="Click to start typing journal entry">
            <img alt="Keyboard" className="w-32 h-32" src="/lovable-uploads/0bd103b3-ad09-4744-85ff-58a0ee274c53.png" />
          </div>
        </div>
      </section>
    </div>;
};