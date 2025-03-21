
import React from "react";
import { AuthButton } from "./AuthButton";
import { FeedbackButton } from "./FeedbackButton";

export const Header = () => {
  // Get current day number
  const currentDay = new Date().getDate();

  return (
    <header className="flex justify-between items-center w-full px-6 py-3 bg-transparent">
      <FeedbackButton />
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src="/lovable-uploads/0f6d6781-8b08-4247-b881-2f68e9e04791.png" alt="DayNote Logo" className="h-6" />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <img 
            src="/lovable-uploads/fe7c969e-d1c2-4a4c-a48c-47e3b0a213d6.png" 
            alt="Calendar" 
            className="h-6 w-6 text-primary" 
          />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
            {currentDay}
          </span>
        </div>
        <AuthButton />
      </div>
    </header>
  );
};
