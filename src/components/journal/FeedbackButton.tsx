
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
        <img 
          src="/lovable-uploads/39d379ba-0d3b-459f-b49c-79968fde6b14.png" 
          alt="Feedback" 
          className="w-7 h-7"
        />
      </Button>
      
      <FeedbackDialog 
        open={feedbackOpen} 
        onOpenChange={setFeedbackOpen} 
      />
    </>
  );
};
