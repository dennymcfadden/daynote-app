
import { getJournalEntries, type JournalEntry } from "@/services/journalService";

/**
 * Formats journal entries into CSV format
 */
const formatEntriesAsCsv = (entries: JournalEntry[]): string => {
  // Define the CSV headers
  const headers = ["Date", "Content", "Created At", "Updated At"];
  
  // Format the headers row
  let csvContent = headers.join(",") + "\n";
  
  // Format each entry as a CSV row
  entries.forEach(entry => {
    // Format the date for display
    const entryDate = entry.entry_date 
      ? new Date(entry.entry_date).toLocaleDateString() 
      : "N/A";
    
    // Escape content to handle commas and quotes in the text
    const escapedContent = `"${entry.content.replace(/"/g, '""')}"`;
    
    // Format the timestamps
    const createdAt = new Date(entry.created_at).toLocaleString();
    const updatedAt = new Date(entry.updated_at).toLocaleString();
    
    // Add the row to the CSV
    csvContent += [entryDate, escapedContent, createdAt, updatedAt].join(",") + "\n";
  });
  
  return csvContent;
};

/**
 * Downloads all journal entries as a CSV file
 */
export const downloadJournalEntriesAsCsv = async (): Promise<void> => {
  try {
    // Fetch all journal entries
    const entries = await getJournalEntries();
    
    if (entries.length === 0) {
      throw new Error("No journal entries found");
    }
    
    // Format the entries as CSV
    const csvContent = formatEntriesAsCsv(entries);
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
    
    // Set up the download link
    link.href = url;
    link.setAttribute("download", `journal-entries-${date}.csv`);
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
  } catch (error) {
    console.error("Failed to download journal entries:", error);
    throw error;
  }
};
