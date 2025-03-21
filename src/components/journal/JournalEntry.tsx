
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon } from "lucide-react";

type JournalEntryProps = {
  id: string;
  content: string;
  date: string;
  imageUrl?: string | null;
  onDelete: () => void;
  onEdit: (content: string) => void;
};

export const JournalEntry: React.FC<JournalEntryProps> = ({
  id,
  content,
  date,
  imageUrl,
  onDelete,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [showImage, setShowImage] = useState(false);
  
  const handleSave = () => {
    onEdit(editContent);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };
  
  const toggleImage = () => {
    setShowImage(!showImage);
  };
  
  return (
    <div className="p-4 bg-transparent px-0">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">{date}</div>
        {imageUrl && (
          <button 
            onClick={toggleImage}
            className="flex items-center text-xs text-blue-600 hover:underline"
          >
            <ImageIcon size={14} className="mr-1" />
            {showImage ? "Hide Image" : "Show Image"}
          </button>
        )}
      </div>
      
      {imageUrl && showImage && (
        <div className="mt-2 mb-2">
          <img 
            src={imageUrl} 
            alt="Journal entry" 
            className="max-h-[200px] rounded-md object-contain mx-auto" 
          />
        </div>
      )}
      
      {isEditing ? (
        <Textarea 
          value={editContent} 
          onChange={e => setEditContent(e.target.value)} 
          className="w-full mt-2 mb-4" 
          rows={5} 
        />
      ) : (
        <div className="mt-2 mb-4 whitespace-pre-wrap">{content}</div>
      )}
      
      <div className="flex gap-2 mt-4">
        {isEditing ? (
          <>
            <button 
              onClick={handleCancel} 
              className="text-xs text-blue-600 hover:underline"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="text-xs text-blue-600 hover:underline ml-2"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)} 
              className="text-xs text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button 
              onClick={onDelete} 
              className="text-xs text-blue-600 hover:underline ml-2"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};
