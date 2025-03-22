
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "./FeedbackDialog";

export const FeedbackButton = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setFeedbackOpen(true)}
        className="p-1 h-auto"
        aria-label="Report Issue"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
        >
          <path 
            d="M12.75 15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15C11.25 14.5858 11.5858 14.25 12 14.25C12.4142 14.25 12.75 14.5858 12.75 15Z" 
            fill="currentColor"
          />
          <path 
            d="M12 11V9" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          <path 
            d="M18.8117 14.1236C19.3612 15.6686 19.1377 17.4242 18.0869 18.7681C17.0361 20.112 15.3175 20.8333 13.5537 20.6564C11.79 20.4795 10.2389 19.4312 9.4005 17.9014L6.61869 12.644C5.7365 11.0255 5.70787 9.06979 6.5397 7.42469C7.37153 5.77959 8.97545 4.68478 10.787 4.4784C12.5986 4.27202 14.3821 4.98584 15.502 6.38911L16.375 7.55333"
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      </Button>
      
      <FeedbackDialog 
        open={feedbackOpen} 
        onOpenChange={setFeedbackOpen} 
      />
    </>
  );
};
