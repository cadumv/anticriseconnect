
import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MentionInput } from "./MentionInput";
import { useCommentContext } from "./CommentContext";

export function CommentForm() {
  const { user } = useAuth();
  const { replyTo, authorProfiles, setReplyTo, mentionUsers, postComment } = useCommentContext();
  const [comment, setComment] = useState("");
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  if (!user) {
    return null;
  }

  const handlePostComment = () => {
    postComment(comment, replyTo?.id || null);
    setComment("");
    setReplyTo(null);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setComment("");
  };

  return (
    <div className="flex gap-3 mb-4">
      <Avatar className="h-8 w-8">
        <AvatarImage 
          src={user.user_metadata?.avatar_url} 
          alt={user.user_metadata?.name || "Usuário"}
        />
        <AvatarFallback>{(user.user_metadata?.name?.[0] || "U").toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        {replyTo && (
          <div className="bg-gray-100 p-2 mb-2 rounded-md flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Respondendo a <span className="font-medium">{
                replyTo.authorId && authorProfiles[replyTo.authorId] 
                  ? authorProfiles[replyTo.authorId].name 
                  : replyTo.author
              }</span>
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancelReply}
              className="h-7 px-2"
            >
              Cancelar
            </Button>
          </div>
        )}
        
        <MentionInput
          users={mentionUsers}
          value={comment}
          onChange={setComment}
          placeholder={replyTo ? "Escreva uma resposta..." : "Adicione um comentário..."}
          className="w-full mb-2 min-h-[60px]"
          ref={commentInputRef}
        />
        
        <div className="flex justify-end">
          <Button 
            size="sm"
            onClick={handlePostComment}
            disabled={!comment.trim()}
          >
            Publicar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
