
import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { MentionInput } from "./MentionInput";
import { useCommentContext } from "./CommentContext";
import { ReplyHeader } from "./comment/ReplyHeader";
import { CommentFormToolbar } from "./comment/CommentFormToolbar";

export function CommentForm() {
  const { user } = useAuth();
  const { replyTo, authorProfiles, setReplyTo, mentionUsers, postComment } = useCommentContext();
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

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
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji: string) => {
    setComment(prev => prev + emoji);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  // Close emoji picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiButtonRef.current && 
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        const emojiPickerElement = document.querySelector('[data-emoji-picker]');
        if (emojiPickerElement && !emojiPickerElement.contains(event.target as Node)) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const getReplyAuthorName = () => {
    if (!replyTo) return '';
    return replyTo.authorId && authorProfiles[replyTo.authorId] 
      ? authorProfiles[replyTo.authorId].name 
      : replyTo.author;
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
          <ReplyHeader 
            author={getReplyAuthorName()}
            onCancel={handleCancelReply}
          />
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
            
            <CommentFormToolbar
              showEmojiPicker={showEmojiPicker}
              isUploading={isUploading}
              comment={comment}
              emojiButtonRef={emojiButtonRef}
              onEmojiClick={handleEmojiClick}
              onEmojiSelect={handleEmojiSelect}
              onCloseEmojiPicker={() => setShowEmojiPicker(false)}
              onPostComment={handlePostComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
