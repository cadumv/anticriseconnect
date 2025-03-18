
import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { MentionInput } from "./MentionInput";
import { useCommentContext } from "./CommentContext";
import { SmilePlus, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CommentForm() {
  const { user } = useAuth();
  const { replyTo, authorProfiles, setReplyTo, mentionUsers, postComment } = useCommentContext();
  const [comment, setComment] = useState("");
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return null;
  }

  const handlePostComment = () => {
    if (!comment.trim()) return;
    
    postComment(comment, replyTo?.id || null);
    setComment("");
    setReplyTo(null);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && comment.trim()) {
      e.preventDefault();
      handlePostComment();
    }
  };

  const handleEmojiClick = () => {
    // In a real implementation, this would open an emoji picker
    // For now, we'll add a simple emoji to demonstrate
    setComment(prev => prev + " 😊");
    toast.info("Emoji picker would open here");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        toast.success(`Selected image: ${file.name}`);
        // In a real implementation, you would upload the image and add it to the comment
        // For now, we'll just mention the image name in the comment
        setComment(prev => prev + ` [Image: ${file.name}]`);
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage 
          src={user.user_metadata?.avatar_url} 
          alt={user.user_metadata?.name || "Usuário"}
        />
        <AvatarFallback>{(user.user_metadata?.name?.[0] || "U").toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 w-full">
        {replyTo && (
          <div className="bg-gray-100 p-2 mb-2 rounded-md flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Respondendo a <span className="font-medium">{
                replyTo.authorId && authorProfiles[replyTo.authorId] 
                  ? authorProfiles[replyTo.authorId].name 
                  : replyTo.author
              }</span>
            </span>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={handleCancelReply}
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="w-full rounded-md border border-gray-300 bg-white hover:border-gray-400 focus-within:border-gray-500 transition-colors">
          <div className="w-full">
            <MentionInput
              users={mentionUsers}
              value={comment}
              onChange={setComment}
              onKeyDown={handleKeyDown}
              placeholder={replyTo ? "Escreva uma resposta..." : "Adicionar comentário..."}
              className="w-full rounded-t-md px-3 py-2 bg-transparent border-none focus:ring-0 min-h-[38px] text-sm resize-none"
              ref={commentInputRef}
            />
            
            <div className="flex justify-between items-center border-t border-gray-200 px-2 py-1">
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                  onClick={handleEmojiClick}
                >
                  <SmilePlus size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                  onClick={handleImageClick}
                >
                  <Image size={18} />
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 h-8"
                disabled={!comment.trim()}
                onClick={handlePostComment}
              >
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
