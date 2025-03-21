
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { JournalEntry } from "./JournalEntry";
import { getJournalEntries, deleteJournalEntry, updateJournalEntry, type JournalEntry as JournalEntryType } from "@/services/journalService";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JournalEntriesProps {
  selectedDate?: Date;
}

export const JournalEntries: React.FC<JournalEntriesProps> = ({ selectedDate }) => {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchEntries = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getJournalEntries(selectedDate);
      setEntries(data);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    } else {
      setEntries([]);
      setIsLoading(false);
    }
  }, [user, selectedDate]);

  const handleDelete = async (id: string) => {
    try {
      await deleteJournalEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted"
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (id: string, content: string) => {
    try {
      const updatedEntry = await updateJournalEntry(id, content);
      setEntries(entries.map(entry => entry.id === id ? updatedEntry : entry));
      toast({
        title: "Entry Updated",
        description: "Your journal entry has been updated"
      });
    } catch (error) {
      console.error("Error updating entry:", error);
      toast({
        title: "Error",
        description: "Failed to update journal entry",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>;
  }

  if (!user) {
    return <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-center text-muted-foreground">
          Sign in to view your journal entries
        </p>
        <button onClick={() => navigate("/auth")} className="text-blue-600 hover:underline">
          Sign in now
        </button>
      </div>;
  }

  if (entries.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">
        {selectedDate ? 
          `No entries for this day across any year.` : 
          "No entries yet."}
      </div>;
  }

  // Format the date to show month and day only
  const formattedDate = selectedDate ? 
    selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) + " (across all years)" : 
    "All entries";

  return <section className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4">{formattedDate}:</h2>
      <div className="space-y-4">
        {entries.map(entry => <JournalEntry 
          key={entry.id} 
          id={entry.id} 
          content={entry.content} 
          date={entry.entry_date ? 
            new Date(entry.entry_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + 
            ' at ' + new Date(entry.entry_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
            new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
          onDelete={() => handleDelete(entry.id)} 
          onEdit={content => handleEdit(entry.id, content)} 
        />)}
      </div>
    </section>;
};
