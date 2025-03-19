import React from "react";
import { JournalEntry } from "./JournalEntry";

type JournalData = {
  id: string;
  date: string;
  content: string;
};

export const JournalEntries: React.FC = () => {
  // Mock data - in a real app, this would come from an API or state
  const entries: JournalData[] = [
    {
      id: "1",
      date: "March 25, 2024",
      content:
        "Today is the first day of spring break for the kids. I wish I could say I was looking forward to it, but honestly this phase has been hard. I'm not enjoying the",
    },
    {
      id: "2",
      date: "March 25, 2024",
      content:
        "Today is the first day of spring break for the kids. I wish I could say I was looking forward to it, but honestly this phase has been hard. I'm not enjoying the",
    },
  ];

  const handleEntryClick = (id: string) => {
    console.log(`Entry ${id} clicked`);
    // In a real app, this would navigate to the entry detail page
  };

  return (
    <section className="flex flex-col gap-6 w-full max-w-[343px] px-4 py-0 max-sm:px-3 max-sm:py-0 mx-auto">
      {entries.map((entry) => (
        <JournalEntry
          key={entry.id}
          date={entry.date}
          content={entry.content}
          onClick={() => handleEntryClick(entry.id)}
        />
      ))}
    </section>
  );
};
