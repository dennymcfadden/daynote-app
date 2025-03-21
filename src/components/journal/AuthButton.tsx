
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
import { Download, LogOut, User } from "lucide-react";
import { downloadJournalEntriesAsCsv } from "@/utils/csvExport";

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
            src="/lovable-uploads/58091e9c-49b5-4654-8908-6b405eb05e05.png" 
            alt="Account" 
            className="w-7 h-7"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <User className="h-4 w-4" />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={handleDownloadEntries}
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
