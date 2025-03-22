
import React from "react";
import { AuthButton } from "./AuthButton";
import { FeedbackButton } from "./FeedbackButton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface HeaderProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedDate = new Date(), onDateChange }) => {
  // Get current day number
  const currentDay = selectedDate.getDate();

  const handleDateChange = (date: Date | undefined) => {
    if (date && onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-6 py-3 bg-transparent">
      <FeedbackButton />
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src="/lovable-uploads/0f6d6781-8b08-4247-b881-2f68e9e04791.png" alt="DayNote Logo" className="h-6" />
      </div>
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative cursor-pointer">
              <img 
                src="/lovable-uploads/fe7c969e-d1c2-4a4c-a48c-47e3b0a213d6.png" 
                alt="Calendar" 
                className="w-7 h-7 text-primary" 
              />
              <span className="absolute top-[56%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
                {currentDay}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <AuthButton />
      </div>
    </header>
  );
};
