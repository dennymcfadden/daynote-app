
import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="flex items-center w-full relative justify-center px-5 py-0">
      <div className="absolute text-[rgba(0,0,0,0.8)] left-5">
        <i className="ti ti-menu-2" />
      </div>
      <div className="flex justify-center items-center">
        <img 
          src="/lovable-uploads/0b7dd969-edfb-4d79-b26a-56c40126a122.png" 
          alt="daynote logo" 
          className="h-8 object-contain"
        />
      </div>
    </header>
  );
};
