
import React from "react";
import { AuthButton } from "./AuthButton";

export const Header = () => {
  return (
    <header className="flex justify-between items-center w-full px-6 py-3 bg-white shadow-sm">
      <div className="text-xl font-bold">DayNote</div>
      <AuthButton />
    </header>
  );
};
