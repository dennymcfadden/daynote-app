
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
        src="/lovable-uploads/58091e9c-49b5-4654-8908-6b405eb05e05.png" 
        alt="Sign Out" 
        className="w-7 h-7"
      />
    </Button>
  );
};
