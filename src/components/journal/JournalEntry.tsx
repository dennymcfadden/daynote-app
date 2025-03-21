
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  onEdit,
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
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="text-sm text-gray-500 mb-2">{date}</div>
      
      {isEditing ? (
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full mt-2 mb-4"
          rows={5}
        />
      ) : (
        <div className="mt-2 mb-4 whitespace-pre-wrap">{content}</div>
      )}
      
      <div className="flex justify-end gap-2 mt-4">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
