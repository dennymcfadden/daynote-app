import React from "react";

type JournalEntryProps = {
  date: string;
  content: string;
  onClick?: () => void;
};

export const JournalEntry: React.FC<JournalEntryProps> = ({
  date,
  content,
  onClick,
}) => {
  return (
    <article
      className="flex flex-col gap-3 border shadow-[0px_8px_12px_6px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.10)] bg-white p-6 rounded-2xl border-solid border-[#D9D2D0] cursor-pointer"
      onClick={onClick}
    >
      <div className="text-[rgba(0,0,0,0.5)] text-sm font-medium">{date}</div>
      <div className="text-[rgba(0,0,0,0.8)] text-base font-medium leading-6">
        {content}
      </div>
    </article>
  );
};
