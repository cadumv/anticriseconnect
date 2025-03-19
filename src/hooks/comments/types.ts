
import { Comment } from "@/types/post";

export interface AuthorProfile {
  avatar_url: string;
  name: string;
}

export interface UseCommentDataReturn {
  comments: Comment[];
  isLoading: boolean;
  authorProfiles: Record<string, AuthorProfile>;
  liked: Record<string, boolean>;
  mentionUsers: {id: string, name: string}[];
  organizeCommentsIntoThreads: (comments: Comment[]) => Comment[];
}

export interface UseCommentActionsReturn {
  replyTo: Comment | null;
  setReplyTo: (comment: Comment | null) => void;
  handleLikeComment: (commentId: string) => void;
  postComment: (text: string, parentId: string | null) => Promise<void>;
  liked: Record<string, boolean>;
}

export interface UseCommentRealtimeReturn {
  setupRealtimeSubscription: () => () => void;
  updateCommentsWithNewComment: (newComment: Comment) => void;
}
