
import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface PostCardHeaderProps {
  post: Post;
  compact?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onUserClick?: () => void;
}

export function PostCardHeader({ 
  post, 
  compact = false, 
  onDelete, 
  onEdit,
  onSave,
  onUserClick 
}: PostCardHeaderProps) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<{ name: string; avatar_url: string | null } | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (post.user_id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('id', post.user_id)
            .single();
          
          if (error) throw error;
          if (data) {
            setProfileData(data);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [post.user_id]);
  
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
  
  const handleUserProfileClick = () => {
    if (onUserClick) {
      onUserClick();
    } else if (post.user_id) {
      navigate(`/profile/${post.user_id}`);
    }
  };
  
  const handleEditPost = () => {
    if (onEdit) {
      onEdit();
    } else {
      toast({
        title: "Editar publicação",
        description: "Funcionalidade de edição será implementada em breve.",
      });
    }
  };
  
  const handleSavePost = () => {
    if (onSave) {
      onSave();
    } else {
      toast({
        title: "Salvar publicação",
        description: "Funcionalidade de salvamento será implementada em breve.",
      });
    }
  };
  
  const handleDeletePost = () => {
    if (onDelete) {
      onDelete();
    } else {
      toast({
        title: "Funcionalidade não disponível",
        description: "A exclusão de publicações não está disponível neste contexto.",
        variant: "destructive",
      });
    }
  };
  
  // Get display name: prioritize profile data, then post author, then fallback
  const displayName = profileData?.name || post.author || "Usuário";
  
  // Get avatar URL: prioritize profile data, then post metadata, then fallback to initial
  const avatarUrl = profileData?.avatar_url || post.metadata?.avatarUrl;
  
  const engineeringType = post.metadata?.engineeringType || post.company || "";
  
  return (
    <div className={`flex items-center justify-between px-4 ${compact ? 'py-2' : 'py-3'}`}>
      <div className="flex items-center space-x-3">
        <div onClick={handleUserProfileClick} className="cursor-pointer">
          <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : (
              <AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div>
          <div 
            className="font-semibold text-sm line-clamp-1 cursor-pointer hover:underline" 
            onClick={handleUserProfileClick}
          >
            {displayName}
          </div>
          
          <div className="text-xs text-gray-500 flex items-center">
            <span>{formattedDate}</span>
            
            {engineeringType && (
              <>
                <span className="mx-1">•</span>
                <span>Engenharia {engineeringType}</span>
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
      
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <div className="p-1 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="h-5 w-5 text-gray-500" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onDelete && (
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={handleDeletePost}
            >
              Apagar publicação
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={handleEditPost}
          >
            Editar publicação
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={handleSavePost}
          >
            Salvar publicação
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
