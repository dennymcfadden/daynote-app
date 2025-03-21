
import React from "react";
import { AuthButton } from "./AuthButton";

export const Header = () => {
  return <header className="flex justify-between items-center w-full px-6 py-3 shadow-sm bg-transparent">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/0f6d6781-8b08-4247-b881-2f68e9e04791.png" 
          alt="DayNote Logo" 
          className="h-8" 
        />
      </div>
      <AuthButton />
    </header>;
};
