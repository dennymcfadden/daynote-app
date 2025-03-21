
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import { resizeImage, createImagePreview, revokeImagePreview } from "@/utils/imageUtils";

interface TranscriptionViewProps {
  transcription: string;
  onTranscriptionChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  imageFile?: File | null;
  onImageChange?: (file: File | null) => void;
}

export const TranscriptionView: React.FC<TranscriptionViewProps> = ({
  transcription,
  onTranscriptionChange,
  onCancel,
  onSave,
  imageFile,
  onImageChange = () => {}
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Create preview when image file changes
    if (imageFile) {
      const url = createImagePreview(imageFile);
      setPreviewUrl(url);
      return () => revokeImagePreview(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      
      // Resize image and update state
      const resizedImage = await resizeImage(file);
      const resizedFile = new File([resizedImage], file.name, { type: 'image/jpeg' });
      onImageChange(resizedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    try {
      const resizedImage = await resizeImage(file);
      const resizedFile = new File([resizedImage], file.name, { type: 'image/jpeg' });
      onImageChange(resizedFile);
    } catch (error) {
      console.error('Error processing dropped image:', error);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl mx-auto px-4">
      <Textarea 
        className="min-h-[200px]" 
        value={transcription} 
        onChange={e => onTranscriptionChange(e.target.value)} 
        placeholder="Your entry..." 
      />
      
      {/* Image upload area */}
      <div 
        className={`mt-2 border-2 border-dashed rounded-md p-4 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'}
          ${previewUrl ? 'border-primary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-[200px] mx-auto rounded-md object-contain" 
            />
            <button 
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            className="py-4 cursor-pointer flex flex-col items-center gap-2"
            onClick={triggerFileInput}
          >
            <ImagePlus className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              Click to add an image or drag and drop
            </p>
            <p className="text-xs text-gray-400">
              Images will be resized to max 1920×1080px
            </p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      <div className="flex flex-col items-center gap-3 mt-2">
        <Button onClick={onSave} className="w-full">
          Save Entry
        </Button>
        <button 
          onClick={onCancel} 
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  );
};
