
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type JournalEntry = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  entry_date?: string;
};

export const saveJournalEntry = async (content: string, entryDate: Date = new Date()) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) {
    throw new Error("Authentication required");
  }
  
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({ 
      content,
      user_id: sessionData.session.user.id,
      entry_date: entryDate.toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data as JournalEntry;
};

export const getJournalEntries = async (date?: Date) => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    return [];
  }
  
  let query = supabase
    .from("journal_entries")
    .select("*");
  
  // If a date is provided, filter by that date
  if (date) {
    // Convert date to ISO string and match the date part only
    const dateStr = date.toISOString().split('T')[0];
    query = query.filter('entry_date', 'gte', `${dateStr}T00:00:00.000Z`)
                .filter('entry_date', 'lt', `${dateStr}T23:59:59.999Z`);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data as JournalEntry[];
};

export const updateJournalEntry = async (id: string, content: string) => {
  const { data, error } = await supabase
    .from("journal_entries")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as JournalEntry;
};

export const deleteJournalEntry = async (id: string) => {
  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  // Get the auth token for the current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Authentication required for transcription");
  }

  // Create a new FormData object for sending the audio file
  const formData = new FormData();
  
  // Create a file with explicit filename and extension to ensure proper format
  const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });
  formData.append("audio", file);

  console.log("Sending audio file:", file.name, file.type, file.size);

  // Use the correct way to access Supabase URL
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://idmkiqcvfifohecxqihj.supabase.co";
  const response = await fetch(`${supabaseUrl}/functions/v1/transcribe`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to transcribe audio";
    try {
      const errorData = await response.json();
      console.error("Transcription error details:", errorData);
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      console.error("Could not parse error response:", e);
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result.transcription;
};
