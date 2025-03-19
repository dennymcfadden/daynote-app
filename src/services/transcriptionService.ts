
/**
 * Service for handling audio transcription using OpenAI's Whisper API
 */

export async function transcribeAudio(audioBlob: Blob, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("OpenAI API key is required for transcription");
  }

  try {
    // Create form data to send the audio file
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    
    // Send to OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Transcription API error:', errorData);
      throw new Error(`Transcription failed: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}
