
import React from "react";
import { Loader2 } from "lucide-react";

export const TranscribingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-12 w-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="text-lg font-medium">...hang tight...</div>
    </div>
  );
};
