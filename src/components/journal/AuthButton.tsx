
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const AuthButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      // Removed the toast for successful sign out
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      localStorage.removeItem("supabase.auth.token");
      navigate("/");
      // Removed the toast for sign out after error
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
  );
};
