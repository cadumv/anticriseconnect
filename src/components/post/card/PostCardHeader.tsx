
import React, { useEffect, useState } from "react";
import { Post } from "@/types/post";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PostAvatar } from "./header/PostAvatar";
import { PostUserInfo } from "./header/PostUserInfo";
import { PostActionsMenu } from "./header/PostActionsMenu";
import { formatTimeAgo } from "./header/formatTimeUtils";

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
  
  // Format the date string to a more readable format
  const formattedDate = post.timestamp ? formatTimeAgo(post.timestamp) : '';
  
  const handleUserProfileClick = () => {
    if (onUserClick) {
      onUserClick();
    } else if (post.user_id) {
      navigate(`/profile/${post.user_id}`);
    }
  };
  
  // Get display name: prioritize profile data, then post author, then fallback
  const displayName = profileData?.name || post.author || "Usuário";
  
  // Get avatar URL: prioritize profile data, then post metadata, then fallback to initial
  const avatarUrl = profileData?.avatar_url || post.metadata?.avatarUrl;
  
  const engineeringType = post.metadata?.engineeringType || post.company || "";
  const visibility = post.metadata?.visibility as 'public' | 'private' | undefined;
  
  return (
    <div className={`flex items-center justify-between px-4 ${compact ? 'py-2' : 'py-3'}`}>
      <div className="flex items-center space-x-3">
        <PostAvatar 
          avatarUrl={avatarUrl} 
          displayName={displayName} 
          compact={compact}
          onClick={handleUserProfileClick}
        />
        
        <PostUserInfo 
          displayName={displayName}
          formattedDate={formattedDate}
          engineeringType={engineeringType}
          visibility={visibility}
          onClick={handleUserProfileClick}
        />
      </div>
      
      <PostActionsMenu 
        onDelete={onDelete}
        onEdit={onEdit}
        onSave={onSave}
      />
    </div>
  );
}
