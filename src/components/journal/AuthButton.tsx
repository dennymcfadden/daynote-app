
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FeedbackDialog } from "./FeedbackDialog";
import { useToast } from "@/hooks/use-toast";

export const AuthButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      localStorage.removeItem("supabase.auth.token");
      navigate("/");
      toast({
        title: "Signed out",
        description: "You have been signed out",
      });
    }
  };

  if (!user) {
    return (
      <Button 
        variant="outline"
        onClick={() => navigate("/")}
        className="text-sm"
      >
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setFeedbackOpen(true)}
        className="p-1 h-auto"
        aria-label="Report Issue"
      >
        <img 
          src="/lovable-uploads/018ce2dd-c1d2-4b7e-a4ab-e361246268d9.png" 
          alt="Feedback" 
          className="w-7 h-7"
        />
      </Button>
      
      <Button 
        variant="ghost" 
        className="p-1 h-auto text-sm"
        onClick={handleSignOut}
        aria-label="Sign Out"
      >
        <img 
          src="/lovable-uploads/1c745cb2-0f96-41f3-8dee-fb18fdbc4719.png" 
          alt="Sign Out" 
          className="w-7 h-7"
        />
      </Button>
      
      <FeedbackDialog 
        open={feedbackOpen} 
        onOpenChange={setFeedbackOpen} 
      />
    </div>
  );
};
