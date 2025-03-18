
import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { MentionInput } from "./MentionInput";
import { useCommentContext } from "./CommentContext";
import { SmilePlus, Image } from "lucide-react";

export function CommentForm() {
  const { user } = useAuth();
  const { replyTo, authorProfiles, setReplyTo, mentionUsers, postComment } = useCommentContext();
  const [comment, setComment] = useState("");
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

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
        
        <div className="w-full rounded-full border border-gray-300 bg-gray-100 hover:border-gray-400 focus-within:border-gray-400 transition-colors">
          <div className="flex items-center pr-2 w-full">
            <MentionInput
              users={mentionUsers}
              value={comment}
              onChange={setComment}
              onKeyDown={handleKeyDown}
              placeholder={replyTo ? "Escreva uma resposta..." : "Adicionar comentário..."}
              className="w-full rounded-full px-3 py-2 bg-transparent border-none focus:ring-0 min-h-[38px] text-sm resize-none"
              ref={commentInputRef}
            />
            
            <div className="flex gap-1 flex-shrink-0">
              <button 
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                disabled={!comment.trim()}
                onClick={handlePostComment}
              >
                <SmilePlus size={18} />
              </button>
              <button className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
                <Image size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
