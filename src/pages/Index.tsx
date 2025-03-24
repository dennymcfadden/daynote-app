
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { JournalPrompt } from "@/components/journal/JournalPrompt";
import AuthContainer from "@/components/auth/AuthContainer";

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
        <main className="flex flex-col items-center gap-4 min-h-screen w-full bg-[#F3EFEC] px-0 py-0">
          <JournalPrompt />
        </main>
      </>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-[#F3EFEC] p-4">
      <AuthContainer />
    </main>
  );
};

export default Index;
