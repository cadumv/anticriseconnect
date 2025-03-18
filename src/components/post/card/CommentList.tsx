
import React from "react";
import { useCommentContext } from "./CommentContext";
import CommentItem from "./CommentItem";
import { Comment } from "@/types/post";

export function CommentList() {
  const { comments, liked, authorProfiles, handleLikeComment, setReplyTo } = useCommentContext();

  if (comments.length === 0) {
    return (
      <p className="text-gray-500 text-center py-2 text-sm">Seja o primeiro a comentar.</p>
    );
  }
  
  const renderComments = (comments: Comment[]) => {
    return comments.map(comment => {
      const profileInfo = comment.authorId ? authorProfiles[comment.authorId] : null;
      const avatarUrl = comment.authorAvatar || (profileInfo ? profileInfo.avatar_url : null);
      const authorName = comment.author !== 'Loading...' ? comment.author : (profileInfo ? profileInfo.name : 'Usuário');
      const isCommentLiked = liked[comment.id] || false;
      
      return (
        <CommentItem
          key={comment.id}
          comment={comment}
          avatarUrl={avatarUrl}
          authorName={authorName}
          liked={isCommentLiked}
          onLike={() => handleLikeComment(comment.id)}
          onReply={() => setReplyTo(comment)}
          depth={0}
          authorProfiles={authorProfiles}
          likedState={liked}
          onLikeReply={handleLikeComment}
          onReplyToReply={setReplyTo}
        />
      );
    });
  };

  return <div className="space-y-1">{renderComments(comments)}</div>;
}

export default CommentList;
