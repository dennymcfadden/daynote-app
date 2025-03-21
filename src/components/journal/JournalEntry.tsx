
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type JournalEntryProps = {
  id: string;
  content: string;
  date: string;
  onDelete: () => void;
  onEdit: (content: string) => void;
};

export const JournalEntry: React.FC<JournalEntryProps> = ({
  id,
  content,
  date,
  onDelete,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  
  const handleSave = () => {
    onEdit(editContent);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };
  
  return (
    <div className="p-4 bg-transparent px-0">
      <div className="text-sm text-gray-500 mb-2">{date}</div>
      
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
