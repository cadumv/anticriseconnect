
import React, { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { SmilePlus, Image } from "lucide-react";
import { EmojiPicker } from "../EmojiPicker";

interface CommentFormToolbarProps {
  showEmojiPicker: boolean;
  isUploading: boolean;
  comment: string;
  imagePreview: string | null;
  emojiButtonRef: RefObject<HTMLButtonElement>;
  onEmojiClick: () => void;
  onEmojiSelect: (emoji: string) => void;
  onCloseEmojiPicker: () => void;
  onImageClick: () => void;
  onPostComment: () => void;
}

export function CommentFormToolbar({
  showEmojiPicker,
  isUploading,
  comment,
  imagePreview,
  emojiButtonRef,
  onEmojiClick,
  onEmojiSelect,
  onCloseEmojiPicker,
  onImageClick,
  onPostComment
}: CommentFormToolbarProps) {
  return (
    <div className="flex justify-between items-center border-t border-gray-200 px-2 py-1">
      <div className="flex gap-1 relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={onEmojiClick}
          ref={emojiButtonRef}
          aria-label="Inserir emoji"
        >
          <SmilePlus size={18} />
        </Button>
        
        {showEmojiPicker && (
          <div data-emoji-picker>
            <EmojiPicker 
              onEmojiSelect={onEmojiSelect} 
              onClose={onCloseEmojiPicker} 
            />
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={onImageClick}
          disabled={isUploading}
          aria-label="Anexar imagem"
        >
          <Image size={18} />
        </Button>
      </div>
      
      <Button
        size="sm"
        variant="ghost"
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 h-8"
        disabled={(!comment.trim() && !imagePreview) || isUploading}
        onClick={onPostComment}
      >
        {isUploading ? "Carregando..." : "Publicar"}
      </Button>
    </div>
  );
}
