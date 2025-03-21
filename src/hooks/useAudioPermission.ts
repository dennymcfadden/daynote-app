
import { useState, useEffect } from "react";

export const useAudioPermission = () => {
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // Check for microphone permission status on component mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Check if the browser supports permissions API
        if (navigator.permissions && navigator.permissions.query) {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissionState(permissionStatus.state);
          
          // Listen for permission changes
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state);
            
            // Hide the prompt if permission is granted
            if (permissionStatus.state === 'granted') {
              setShowPermissionPrompt(false);
            }
          };
        }
      } catch (error) {
        console.log("Permission check not supported:", error);
      }
    };
    
    checkPermission();
  }, []);

  const updatePermissionState = async () => {
    if (navigator.permissions && navigator.permissions.query) {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionState(permissionStatus.state);
    }
  };

  return {
    permissionState,
    showPermissionPrompt,
    setShowPermissionPrompt,
    updatePermissionState
  };
};
