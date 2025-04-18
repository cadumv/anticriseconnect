
import React from "react";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { CommentProvider } from "./CommentContext";
import { Comment } from "@/types/post";

interface CommentSectionProps {
  comments: Comment[];
  isLoading: boolean;
  postId: string;
}

export function CommentSection({ comments, isLoading, postId }: CommentSectionProps) {
  return (
    <CommentProvider
      initialComments={comments}
      initialLoading={isLoading}
      postId={postId}
    >
      <div className="border-t border-gray-200 pt-4 px-4 pb-3 w-full">
        <CommentList />
        <div className="mt-4 w-full">
          <CommentForm />
        </div>
      </div>
    </CommentProvider>
  );
}

export default CommentSection;
