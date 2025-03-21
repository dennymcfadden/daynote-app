
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { JournalEntry } from "./JournalEntry";
import { getJournalEntries, deleteJournalEntry, updateJournalEntry, type JournalEntry as JournalEntryType } from "@/services/journalService";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface JournalEntriesProps {
  selectedDate?: Date;
}

export const JournalEntries: React.FC<JournalEntriesProps> = ({ selectedDate }) => {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const fetchEntries = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getJournalEntries();
      setEntries(data);
      
      if (selectedDate) {
        filterEntriesByMonthAndDay(data, selectedDate);
      } else {
        setFilteredEntries([]);
      }
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      handleError("Fetching Entries", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterEntriesByMonthAndDay = (allEntries: JournalEntryType[], date: Date) => {
    const month = date.getMonth();
    const day = date.getDate();
    
    const filtered = allEntries.filter(entry => {
      if (!entry.entry_date) return false;
      
      const entryDate = new Date(entry.entry_date);
      return entryDate.getMonth() === month && entryDate.getDate() === day;
    });
    
    setFilteredEntries(filtered);
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    } else {
      setEntries([]);
      setFilteredEntries([]);
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (selectedDate && entries.length > 0) {
      filterEntriesByMonthAndDay(entries, selectedDate);
    } else if (!selectedDate) {
      setFilteredEntries([]);
    }
  }, [selectedDate, entries]);

  const handleDelete = async (id: string) => {
    try {
      await deleteJournalEntry(id);
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      
      if (selectedDate) {
        filterEntriesByMonthAndDay(updatedEntries, selectedDate);
      } else {
        setFilteredEntries(updatedEntries);
      }
      
      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted"
      });
    } catch (error) {
      handleError("Deleting Entry", error);
    }
  };

  const handleEdit = async (id: string, content: string) => {
    try {
      const updatedEntry = await updateJournalEntry(id, content);
      const updatedEntries = entries.map(entry => entry.id === id ? updatedEntry : entry);
      setEntries(updatedEntries);
      
      if (selectedDate) {
        filterEntriesByMonthAndDay(updatedEntries, selectedDate);
      } else {
        setFilteredEntries(updatedEntries);
      }
      
      toast({
        title: "Entry Updated",
        description: "Your journal entry has been updated"
      });
    } catch (error) {
      handleError("Updating Entry", error);
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

  if (filteredEntries.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">
        {selectedDate ? 
          `No entries for this day` : 
          ""}
      </div>;
  }

  const formattedDate = selectedDate ? 
    selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) + " (across all years)" : 
    "";

  return <section className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4">On this day:</h2>
      <div className="space-y-4">
        {filteredEntries.map(entry => <JournalEntry 
          key={entry.id} 
          id={entry.id} 
          content={entry.content} 
          date={entry.entry_date ? 
            new Date(entry.entry_date).getFullYear().toString() : 
            new Date(entry.created_at).getFullYear().toString()} 
          onDelete={() => handleDelete(entry.id)} 
          onEdit={content => handleEdit(entry.id, content)} 
        />)}
      </div>
    </section>;
};
