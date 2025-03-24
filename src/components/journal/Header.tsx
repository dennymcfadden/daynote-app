import React from "react";
import { AuthButton } from "./AuthButton";
import { FeedbackButton } from "./FeedbackButton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
interface HeaderProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}
export const Header: React.FC<HeaderProps> = ({
  selectedDate = new Date(),
  onDateChange
}) => {
  // Format full month and day
  const formattedDate = format(selectedDate, 'MMMM d');
  const handleDateChange = (date: Date | undefined) => {
    if (date && onDateChange) {
      onDateChange(date);
    }
  };
  return <header className="flex justify-between items-center w-full py-3 px-[12px] bg-green-700 border-b-0 mb-0">
      <div className="flex items-center">
        <AuthButton />
        <img alt="DayNote Logo" className="h-8 pt-2 ml-3" src="/lovable-uploads/70eb4703-9578-4fcf-b437-df9f632201bc.png" />
      </div>
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-9 px-3 py-1 text-white hover:text-white bg-green-900 hover:bg-green-900">
              {formattedDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
        <FeedbackButton />
      </div>
    </header>;
};