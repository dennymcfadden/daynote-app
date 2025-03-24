import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "./FeedbackDialog";
export const FeedbackButton = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  return <>
      <Button variant="ghost" size="sm" onClick={() => setFeedbackOpen(true)} aria-label="Report Issue" className="p-1 h-9 w-9 bg-green-900 hover:bg-green-900">
        <img alt="Feedback" src="/lovable-uploads/d0bfe133-d343-46f9-a7d0-fc3b19e9e82e.png" className="h-6 w-6" />
      </Button>
      
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>;
};