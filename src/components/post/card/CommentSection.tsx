
import React from "react";
import { Comment } from "@/types/post";
import { CommentProvider } from "./CommentContext";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import CommentLoading from "./CommentLoading";
import { Separator } from "@/components/ui/separator";

interface CommentSectionProps {
  comments: Comment[];
  isLoading: boolean;
  postId: string;
}

export function CommentSection({ comments: initialComments, isLoading: initialLoading, postId }: CommentSectionProps) {
  return (
    <div className="border-t">
      <CommentProvider 
        initialComments={initialComments} 
        initialLoading={initialLoading} 
        postId={postId}
      >
        <div className="p-3">
          <CommentForm />
          
          {initialLoading ? (
            <CommentLoading />
          ) : (
            <>
              <div className="flex justify-between items-center mt-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Mais relevantes</span>
                  <svg className="w-3 h-3 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
                  </svg>
                </div>
              </div>
              
              <CommentList />
            </>
          )}
          
          {!initialLoading && initialComments.length > 3 && (
            <button className="w-full text-sm py-2 hover:bg-gray-100 rounded-md flex items-center justify-center text-gray-600 font-medium mt-2">
              Carregar mais comentários
            </button>
          )}
        </div>
      </CommentProvider>
    </div>
  );
}
