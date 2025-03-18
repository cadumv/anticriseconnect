
import React from "react";
import { Comment } from "@/types/post";
import CommentItem from "./CommentItem";

interface CommentRepliesProps {
  replies?: Comment[];
  depth: number;
  authorProfiles: Record<string, { avatar_url: string, name: string }>;
  likedState: Record<string, boolean>;
  onLikeReply: (commentId: string) => void;
  onReplyToReply: (comment: Comment) => void;
}

export function CommentReplies({
  replies,
  depth,
  authorProfiles,
  likedState,
  onLikeReply,
  onReplyToReply
}: CommentRepliesProps) {
  // Maximum nesting level allowed
  const MAX_DEPTH = 3;
  
  if (!replies || replies.length === 0) return null;
  
  return (
    <div className={`ml-8 mt-2 space-y-3 ${depth >= MAX_DEPTH ? 'pl-2 border-l-2 border-gray-200' : ''}`}>
      {replies.map(reply => {
        const profileInfo = reply.authorId ? authorProfiles[reply.authorId] : null;
        const replyAvatarUrl = reply.authorAvatar || (profileInfo ? profileInfo.avatar_url : null);
        const replyAuthorName = reply.author !== 'Loading...' ? reply.author : (profileInfo ? profileInfo.name : 'Usuário');
        const isReplyLiked = likedState[reply.id] || false;
        
        // If we've reached max depth, we'll flatten the replies
        if (depth >= MAX_DEPTH) {
          return (
            <CommentItem
              key={reply.id}
              comment={{...reply, replies: []}}
              avatarUrl={replyAvatarUrl}
              authorName={replyAuthorName}
              liked={isReplyLiked}
              onLike={() => onLikeReply(reply.id)}
              onReply={() => onReplyToReply(reply)}
              depth={depth + 1}
              authorProfiles={authorProfiles}
              likedState={likedState}
              onLikeReply={onLikeReply}
              onReplyToReply={onReplyToReply}
            />
          );
        } else {
          return (
            <CommentItem
              key={reply.id}
              comment={reply}
              avatarUrl={replyAvatarUrl}
              authorName={replyAuthorName}
              liked={isReplyLiked}
              onLike={() => onLikeReply(reply.id)}
              onReply={() => onReplyToReply(reply)}
              depth={depth + 1}
              authorProfiles={authorProfiles}
              likedState={likedState}
              onLikeReply={onLikeReply}
              onReplyToReply={onReplyToReply}
            />
          );
        }
      })}
    </div>
  );
}

export default CommentReplies;
