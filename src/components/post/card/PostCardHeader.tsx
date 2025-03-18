
import React from "react";
import { Post } from "@/types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";

interface PostCardHeaderProps {
  post: Post;
  compact?: boolean;
  onDelete?: () => void;
  onUserClick?: () => void;
}

export function PostCardHeader({ post, compact = false, onDelete, onUserClick }: PostCardHeaderProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mes`;
    return `${Math.floor(diffInSeconds / 31536000)}a`;
  };
  
  // Format the date string to a more readable format
  const formattedDate = post.timestamp ? formatTimeAgo(post.timestamp) : '';
  
  return (
    <div className={`flex items-center justify-between px-4 ${compact ? 'py-2' : 'py-3'}`}>
      <div className="flex items-center space-x-2">
        <div onClick={onUserClick} className="cursor-pointer">
          <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
            {post.metadata?.avatarUrl ? (
              <AvatarImage src={post.metadata.avatarUrl} alt={post.author || "Autor"} />
            ) : (
              <AvatarFallback>{post.author ? post.author[0].toUpperCase() : "U"}</AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div>
          <div 
            className="font-medium text-sm line-clamp-1 cursor-pointer hover:underline" 
            onClick={onUserClick}
          >
            {post.author || "Usuário"}
          </div>
          
          <div className="text-xs text-gray-500 flex items-center">
            <span>{formattedDate}</span>
            
            {post.company && (
              <>
                <span className="mx-1">•</span>
                <span>{post.company}</span>
              </>
            )}
            
            {post.metadata?.visibility && (
              <>
                <span className="mx-1">•</span>
                <span>
                  {post.metadata.visibility === 'public' ? (
                    <svg 
                      className="h-3 w-3 inline"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  ) : (
                    <svg 
                      className="h-3 w-3 inline"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M17 9V7a5 5 0 0 0-10 0v2"></path>
                      <rect x="7" y="9" width="10" height="12" rx="1"></rect>
                    </svg>
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {onDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="p-1 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={onDelete}
            >
              Apagar publicação
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Editar publicação
            </DropdownMenuItem>
            <DropdownMenuItem>
              Salvar publicação
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
