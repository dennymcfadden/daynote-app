
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackDialog = ({ open, onOpenChange }: FeedbackDialogProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getBrowserInfo = () => {
    return `${navigator.userAgent}`;
  };

  const getDeviceInfo = () => {
    return `${window.innerWidth}x${window.innerHeight}, ${window.devicePixelRatio}x DPR, ${navigator.platform}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter your feedback before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("user_feedback").insert({
        user_id: user?.id || null,
        email: user?.email || "anonymous@user.com",
        browser_info: getBrowserInfo(),
        device_info: getDeviceInfo(),
        message: message.trim(),
      });

      if (error) throw error;

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      
      setMessage("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Submission error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>We love feedback</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea 
              placeholder="How could daynote be improved?" 
              className="min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
