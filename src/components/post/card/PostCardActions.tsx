
import React from "react";
import { ThumbsUp, Bookmark, Share2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostCardActionsProps {
  postId: string;
  likes?: number;
  shares?: number;
  comments?: number;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
  onComment: () => void;
}

export function PostCardActions({ 
  postId, 
  likes = 0, 
  shares = 0, 
  comments = 0, 
  liked, 
  saved,
  onLike,
  onSave,
  onShare,
  onComment
}: PostCardActionsProps) {
  return (
    <>
      <div className="px-4 pt-1 pb-1 flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
              <ThumbsUp className="h-2 w-2 text-white" />
            </div>
          </div>
          <span>{likes}</span>
        </div>
        
        <div className="flex gap-3">
          <span>{shares} compartilhamentos</span>
          <span>{comments} comentários</span>
        </div>
      </div>
      
      <div className="border-t">
        <div className="grid grid-cols-4 px-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center justify-center gap-2 rounded-md py-2",
              liked[postId] ? "text-blue-600" : "text-gray-600"
            )}
            onClick={() => onLike(postId)}
          >
            <ThumbsUp size={18} />
            <span className="font-medium">Gostei</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-center gap-2 rounded-md py-2 text-gray-600"
            onClick={onComment}
          >
            <MessageSquare size={18} />
            <span className="font-medium">Comentar</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-center gap-2 rounded-md py-2 text-gray-600"
            onClick={() => onShare(postId)}
          >
            <Share2 size={18} />
            <span className="font-medium">Compartilhar</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center justify-center gap-2 rounded-md py-2",
              saved[postId] ? "text-blue-600" : "text-gray-600"
            )}
            onClick={() => onSave(postId)}
          >
            <Bookmark size={18} />
            <span className="font-medium">Salvar</span>
          </Button>
        </div>
      </div>
    </>
  );
}
