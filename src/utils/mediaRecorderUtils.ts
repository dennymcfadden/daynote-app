
/**
 * Utility functions for handling media recording
 */

export const getOptimalAudioConfig = (): {mimeType: string, options: MediaRecorderOptions} => {
  // Determine the best MIME type for the browser
  let mimeType = 'audio/webm';
  const options: MediaRecorderOptions = {};
  
  // Check if the browser supports the preferred MIME type
  if (MediaRecorder.isTypeSupported('audio/webm')) {
    options.mimeType = 'audio/webm';
  } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
    options.mimeType = 'audio/mp4';
    mimeType = 'audio/mp4';
  } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
    options.mimeType = 'audio/ogg';
    mimeType = 'audio/ogg';
  }
  
  return { mimeType, options };
};

export const getAudioConstraints = () => {
  // On iOS, we need to be more direct with the constraints
  return {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  };
};
