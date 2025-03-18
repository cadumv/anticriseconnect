
import React, { createContext, useContext } from "react";
import { Comment } from "@/types/post";
import { useComments, AuthorProfile } from "@/hooks/comments/useComments";

interface CommentContextType {
  comments: Comment[];
  isLoading: boolean;
  postId: string;
  liked: Record<string, boolean>;
  replyTo: Comment | null;
  authorProfiles: Record<string, AuthorProfile>;
  mentionUsers: {id: string, name: string}[];
  setReplyTo: (comment: Comment | null) => void;
  handleLikeComment: (commentId: string) => void;
  postComment: (text: string, parentId: string | null) => Promise<void>;
  organizeCommentsIntoThreads: (comments: Comment[]) => Comment[];
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useCommentContext must be used within a CommentProvider");
  }
  return context;
};

export const CommentProvider: React.FC<{
  children: React.ReactNode;
  initialComments: Comment[];
  initialLoading: boolean;
  postId: string;
}> = ({ children, initialComments, initialLoading, postId }) => {
  const {
    comments,
    isLoading,
    liked,
    replyTo,
    authorProfiles,
    mentionUsers,
    setReplyTo,
    handleLikeComment,
    postComment,
    organizeCommentsIntoThreads
  } = useComments(postId);

  const value = {
    comments,
    isLoading,
    postId,
    liked,
    replyTo,
    authorProfiles,
    mentionUsers,
    setReplyTo,
    handleLikeComment,
    postComment,
    organizeCommentsIntoThreads,
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};

export default CommentContext;
