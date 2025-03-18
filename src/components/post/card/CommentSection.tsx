
import React from "react";
import { Comment } from "@/types/post";
import { CommentProvider } from "./CommentContext";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import CommentLoading from "./CommentLoading";

interface CommentSectionProps {
  comments: Comment[];
  isLoading: boolean;
  postId: string;
}

export function CommentSection({ comments: initialComments, isLoading: initialLoading, postId }: CommentSectionProps) {
  return (
    <div className="border-t p-4">
      <h4 className="font-medium mb-3">Comentários</h4>
      
      <CommentProvider 
        initialComments={initialComments} 
        initialLoading={initialLoading} 
        postId={postId}
      >
        <CommentForm />
        
        {initialLoading ? (
          <CommentLoading />
        ) : (
          <CommentList />
        )}
      </CommentProvider>
    </div>
  );
}
