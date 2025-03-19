
import { useEffect, useState } from "react";
import { Comment } from "@/types/post";
import { useCommentData } from "./useCommentData";
import { useCommentActions } from "./useCommentActions";
import { useCommentRealtime } from "./useCommentRealtime";
import { AuthorProfile } from "./types";

export interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  liked: Record<string, boolean>;
  replyTo: Comment | null;
  authorProfiles: Record<string, AuthorProfile>;
  mentionUsers: {id: string, name: string}[];
  setReplyTo: (comment: Comment | null) => void;
  handleLikeComment: (commentId: string) => void;
  postComment: (text: string, parentId: string | null) => Promise<void>;
  organizeCommentsIntoThreads: (comments: Comment[]) => Comment[];
}

export function useComments(postId: string): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Initialize the individual hooks
  const {
    comments: fetchedComments,
    isLoading,
    authorProfiles,
    liked: dataLiked,
    mentionUsers,
    organizeCommentsIntoThreads
  } = useCommentData(postId);
  
  // Setup realtime updates
  const { 
    setupRealtimeSubscription,
    updateCommentsWithNewComment 
  } = useCommentRealtime(
    postId, 
    setComments, 
    async (userIds) => {
      // We need to define a fetchUserProfiles function for the realtime hook
      try {
        // Implementation would go here, but we'll rely on the existing data hooks
        console.log("Would fetch profiles for users:", userIds);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    }
  );
  
  // Setup comment actions
  const {
    replyTo,
    setReplyTo,
    handleLikeComment,
    postComment,
    liked: actionsLiked
  } = useCommentActions(postId, updateCommentsWithNewComment);
  
  // Synchronize comments from the data hook
  useEffect(() => {
    setComments(fetchedComments);
  }, [fetchedComments]);
  
  // Setup realtime subscription
  useEffect(() => {
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, [postId]);
  
  return {
    comments,
    isLoading,
    liked: actionsLiked, // Use the liked state from useCommentActions
    replyTo,
    authorProfiles,
    mentionUsers,
    setReplyTo,
    handleLikeComment,
    postComment,
    organizeCommentsIntoThreads,
  };
}

// Use 'export type' instead of 'export' for re-exporting types
export type { AuthorProfile };
