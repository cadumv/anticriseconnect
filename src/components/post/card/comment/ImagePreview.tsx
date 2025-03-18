
import React from "react";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

export function ImagePreview({ imageUrl, onRemove }: ImagePreviewProps) {
  return (
    <div className="px-3 py-2 border-t border-gray-200">
      <div className="relative inline-block">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="max-h-60 max-w-full rounded-md object-contain comment-image" 
        />
        <button 
          className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70"
          onClick={onRemove}
          aria-label="Remove image"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
