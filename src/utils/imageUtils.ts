
/**
 * Utility functions for handling images
 */

/**
 * Resizes an image to fit within maximum dimensions while maintaining aspect ratio
 * @param file The image file to resize
 * @param maxWidth Maximum width (defaults to 1920px)
 * @param maxHeight Maximum height (defaults to 1080px)
 * @param quality JPEG quality (0-1, defaults to 0.85)
 * @returns A Promise resolving to a Blob of the resized image
 */
export const resizeImage = async (
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.85
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    img.onload = () => {
      // Calculate new dimensions to maintain aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      // Set canvas dimensions and draw the resized image
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert canvas to Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load image from file
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Creates a preview URL for an image file
 * @param file The image file to preview
 * @returns A URL that can be used for image preview
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Cleans up a preview URL to prevent memory leaks
 * @param url The preview URL to revoke
 */
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
