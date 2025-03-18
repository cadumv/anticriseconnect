
import React from "react";

interface ReplyHeaderProps {
  author: string;
  onCancel: () => void;
}

export function ReplyHeader({ author, onCancel }: ReplyHeaderProps) {
  return (
    <div className="bg-gray-100 p-2 mb-2 rounded-md flex justify-between items-center">
      <span className="text-sm text-gray-600">
        Respondendo a <span className="font-medium">{author}</span>
      </span>
      <button 
        className="text-gray-500 hover:text-gray-700"
        onClick={onCancel}
      >
        ✕
      </button>
    </div>
  );
}
