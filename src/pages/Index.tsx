import React from "react";
import { Header } from "@/components/journal/Header";
import { DateSelector } from "@/components/journal/DateSelector";
import { JournalPrompt } from "@/components/journal/JournalPrompt";
import { JournalEntries } from "@/components/journal/JournalEntries";

const Index = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <main className="flex flex-col items-center gap-12 min-h-screen w-full bg-[#F3EFEC] px-0 py-6">
        <Header />
        <DateSelector />
        <JournalPrompt />
        <JournalEntries />
      </main>
    </>
  );
};

export default Index;
