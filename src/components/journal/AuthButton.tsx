
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadJournalEntriesAsCsv } from "@/utils/csvExport";

export const AuthButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      localStorage.removeItem("supabase.auth.token");
      navigate("/");
    }
  };

  const handleDownloadEntries = async () => {
    try {
      await downloadJournalEntriesAsCsv();
      toast({
        title: "Download Started",
        description: "Your journal entries are being downloaded as a CSV file."
      });
    } catch (error) {
      console.error("Error downloading entries:", error);
      toast({
        title: "Download Failed",
        description: "There was a problem downloading your journal entries.",
        variant: "destructive"
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-1 h-auto"
          aria-label="Account Options"
        >
          <img 
            src="/lovable-uploads/dd193ce2-d02c-4d52-8b86-0e765da7de02.png" 
            alt="Menu"
            className="w-7 h-7"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          className="cursor-pointer" 
          onClick={handleDownloadEntries}
        >
          <span>Download my data</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive" 
          onClick={handleSignOut}
        >
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
