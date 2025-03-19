import React, { useRef } from "react";

type DatePillProps = {
  month: string;
  day: string;
  isActive?: boolean;
  onClick?: () => void;
};

const DatePill: React.FC<DatePillProps> = ({
  month,
  day,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      className={`flex flex-col justify-center items-center w-[68px] h-12 gap-px bg-[#D8D1CF] rounded-3xl max-sm:w-[60px] ${isActive ? "ring-2 ring-[rgba(0,0,0,0.3)]" : ""}`}
      onClick={onClick}
      aria-label={`${month} ${day}`}
    >
      <div className="text-[rgba(0,0,0,0.5)] text-[10px] font-medium tracking-[1.2px]">
        {month}
      </div>
      <div className="text-[rgba(0,0,0,0.8)] text-sm font-medium">{day}</div>
    </button>
  );
};

export const DateSelector: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -100 : 100;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex items-center gap-[26px] overflow-x-auto px-5 py-0 max-sm:gap-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <DatePill month="MAR" day="23" />
        <DatePill month="MAR" day="24" />
        <DatePill month="MAR" day="25" isActive={true} />
        <DatePill month="MAR" day="26" />
        <DatePill month="MAR" day="27" />
        <DatePill month="MAR" day="28" />
        <DatePill month="MAR" day="29" />
        <DatePill month="MAR" day="30" />
      </div>
    </div>
  );
};
