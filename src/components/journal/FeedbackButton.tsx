import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "./FeedbackDialog";
export const FeedbackButton = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  return <>
      <Button variant="ghost" size="sm" onClick={() => setFeedbackOpen(true)} aria-label="Report Issue" className="p-1 h-auto bg-green-900 hover:bg-green-900">
        <img alt="Feedback" className="w-7 h-7" src="/lovable-uploads/2350ce38-a1ae-435f-aee9-8a88c54b6ba4.png" />
      </Button>
      
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>;
};