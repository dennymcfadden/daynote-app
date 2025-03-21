
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptViewProps {
  onStartRecording: () => void;
  onStartTyping: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const PromptView: React.FC<PromptViewProps> = ({
  onStartRecording,
  onStartTyping,
  selectedDate,
  onDateChange
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-8 flex justify-center w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-center text-center font-normal",
                isMobile ? "w-full" : "w-[240px]"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <section className="flex flex-col items-center gap-7 w-full px-0 cursor-pointer py-[100px]">
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-12 items-center`}>
          <div className="flex flex-col items-center cursor-pointer" onClick={onStartRecording} aria-label="Click to start voice journaling">
            <img src="/lovable-uploads/27d42274-817b-49d7-8fbf-636a3b843171.png" alt="Microphone" className="w-32 h-32" />
          </div>
          
          <div className="flex flex-col items-center cursor-pointer" onClick={onStartTyping} aria-label="Click to start typing journal entry">
            <img src="/lovable-uploads/3d5db38b-8b2f-4386-abe0-6b81f61bafc4.png" alt="Keyboard" className="w-32 h-32" />
          </div>
        </div>
      </section>
    </div>
  );
};
