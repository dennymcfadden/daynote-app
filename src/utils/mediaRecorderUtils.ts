
/**
 * Utility functions for handling media recording
 */

export const getOptimalAudioConfig = (): {mimeType: string, options: MediaRecorderOptions} => {
  // Determine if this is an iOS device
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  
  // Default values
  let mimeType = 'audio/webm';
  const options: MediaRecorderOptions = {};
  
  // iOS Safari often works better with audio/mp4
  if (isIOS) {
    if (MediaRecorder.isTypeSupported('audio/mp4')) {
      options.mimeType = 'audio/mp4';
      mimeType = 'audio/mp4';
    } else if (MediaRecorder.isTypeSupported('audio/aac')) {
      options.mimeType = 'audio/aac';
      mimeType = 'audio/aac';
    }
  } else {
    // For non-iOS devices, prefer webm if supported
    if (MediaRecorder.isTypeSupported('audio/webm')) {
      options.mimeType = 'audio/webm';
    } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
      options.mimeType = 'audio/mp4';
      mimeType = 'audio/mp4';
    } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
      options.mimeType = 'audio/ogg';
      mimeType = 'audio/ogg';
    }
  }
  
  // Log supported types for debugging
  console.log("Browser supported audio types:", {
    webm: MediaRecorder.isTypeSupported('audio/webm'),
    mp4: MediaRecorder.isTypeSupported('audio/mp4'),
    ogg: MediaRecorder.isTypeSupported('audio/ogg'),
    aac: MediaRecorder.isTypeSupported('audio/aac'),
    isIOS: isIOS
  });
  
  return { mimeType, options };
};

export const getAudioConstraints = () => {
  // iOS requires simpler constraints
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    return {
      audio: true
    };
  }
  
  // More detailed constraints for other platforms
  return {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  };
};
