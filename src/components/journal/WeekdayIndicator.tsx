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
  const [weekdays, setWeekdays] = useState<Array<{
    date: Date;
    hasEntry: boolean;
  }>>([]);
  const {
    user
  } = useAuth();

  useEffect(() => {
    const start = startOfWeek(new Date(), {
      weekStartsOn: 0
    });
    const end = endOfWeek(start, {
      weekStartsOn: 0
    });

    const days = eachDayOfInterval({
      start,
      end
    });
    const initialWeekdays = days.map(day => ({
      date: day,
      hasEntry: false
    }));
    setWeekdays(initialWeekdays);

    if (user) {
      fetchEntriesForWeek(days);
    }
  }, [user]);

  const fetchEntriesForWeek = async (days: Date[]) => {
    if (!user) return;
    try {
      const {
        data: entriesData
      } = await supabase.from("journal_entries").select("entry_date").eq("user_id", user.id);
      if (!entriesData) return;

      const entryDates = entriesData.map(entry => entry.entry_date ? new Date(entry.entry_date) : null).filter(Boolean) as Date[];

      const updatedWeekdays = days.map(day => {
        const hasEntry = entryDates.some(entryDate => entryDate.getDate() === day.getDate() && entryDate.getMonth() === day.getMonth());
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

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  };

  return <div className="flex flex-col w-full -mt-[1px]">
      <div className="flex justify-between items-center w-full bg-[#F3EFEC]">
        {weekdays.map((day, index) => <div 
            key={index} 
            className={cn(
              "flex flex-col items-center cursor-pointer relative flex-1",
              isSameDay(day.date, selectedDate) ? "bg-white" : "bg-transparent"
            )} 
            onClick={() => handleDayClick(day.date)}
          >
            <span className="text-sm text-[#403E43] py-4">
              {format(day.date, 'EE')}
            </span>
            <div className={cn("absolute bottom-0 left-0 w-full h-1", day.hasEntry ? "bg-green-500" : "bg-gray-200")} />
          </div>)}
      </div>
    </div>;
};
