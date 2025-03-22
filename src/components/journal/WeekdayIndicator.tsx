
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface WeekdayIndicatorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const WeekdayIndicator: React.FC<WeekdayIndicatorProps> = ({ 
  selectedDate,
  onSelectDate
}) => {
  const [weekdays, setWeekdays] = useState<Array<{date: Date; hasEntry: boolean}>>([]);
  const { user } = useAuth();
  
  // Get the days of the current week
  useEffect(() => {
    // Start the week on Monday (1) instead of Sunday (0)
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(start, { weekStartsOn: 1 });
    
    // Get all days of the current week
    const days = eachDayOfInterval({ start, end });
    
    const initialWeekdays = days.map(day => ({
      date: day,
      hasEntry: false
    }));
    
    setWeekdays(initialWeekdays);
    
    // If user is logged in, check for journal entries
    if (user) {
      fetchEntriesForWeek(days);
    }
  }, [user]);
  
  const fetchEntriesForWeek = async (days: Date[]) => {
    if (!user) return;
    
    try {
      // Fetch all entries for the user
      const { data: entriesData } = await supabase
        .from("journal_entries")
        .select("entry_date")
        .eq("user_id", user.id);
      
      if (!entriesData) return;
      
      // Convert entry_dates to Date objects
      const entryDates = entriesData.map(entry => 
        entry.entry_date ? new Date(entry.entry_date) : null
      ).filter(Boolean) as Date[];
      
      // Check which days have entries
      const updatedWeekdays = days.map(day => {
        // Check if there's an entry for this day (compare month, day, ignoring year)
        const hasEntry = entryDates.some(entryDate => 
          entryDate.getDate() === day.getDate() && 
          entryDate.getMonth() === day.getMonth()
        );
        
        return {
          date: day,
          hasEntry
        };
      });
      
      setWeekdays(updatedWeekdays);
    } catch (error) {
      console.error("Error fetching journal entries for week:", error);
    }
  };
  
  const handleDayClick = (date: Date) => {
    onSelectDate(date);
  };
  
  return (
    <div className="flex justify-around items-center w-full px-6 py-4">
      {weekdays.map((day, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => handleDayClick(day.date)}
        >
          <div 
            className={cn(
              "w-2 h-2 rounded-full mb-1",
              day.hasEntry ? "bg-[#F2FCE2]" : "bg-[#F1F0FB]"
            )}
          />
          <span 
            className={cn(
              "text-sm text-[#403E43]",
              isToday(day.date) ? "font-bold" : "font-normal"
            )}
          >
            {format(day.date, 'EEE')}
          </span>
        </div>
      ))}
    </div>
  );
};
