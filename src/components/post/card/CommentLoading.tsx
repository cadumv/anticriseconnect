
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CommentLoading() {
  return (
    <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default CommentLoading;
