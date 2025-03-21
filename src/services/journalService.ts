
import { supabase } from "@/integrations/supabase/client";

export type JournalEntry = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export const saveJournalEntry = async (content: string) => {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({ content })
    .select()
    .single();

  if (error) throw error;
  return data as JournalEntry;
};

export const getJournalEntries = async () => {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("created_at", { ascending: false });

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

  const formData = new FormData();
  formData.append("audio", audioBlob);

  const response = await fetch(`${supabase.supabaseUrl}/functions/v1/transcribe`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to transcribe audio");
  }

  const result = await response.json();
  return result.transcription;
};
