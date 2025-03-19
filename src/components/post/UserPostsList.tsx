
import React, { useState } from "react";
import { PostCard } from "./PostCard";
import { AchievementCard } from "./AchievementCard";
import { Post } from "@/types/post";

interface UserPostsListProps {
  posts: Post[];
  userName: string;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
  onDelete?: (postId: string) => Promise<boolean> | boolean;
  onEdit?: (postId: string) => void;
  compact?: boolean;
}

export function UserPostsList({ 
  posts, 
  userName, 
  liked, 
  saved, 
  onLike, 
  onSave, 
  onShare,
  onDelete,
  onEdit,
  compact = false
}: UserPostsListProps) {
  const [deletedPostIds, setDeletedPostIds] = useState<string[]>([]);
  
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Nenhuma publicação encontrada
      </div>
    );
  }
  
  // Filter out deleted posts
  const visiblePosts = posts.filter(post => !deletedPostIds.includes(post.id));
  
  if (visiblePosts.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Nenhuma publicação encontrada
      </div>
    );
  }

  const handleDeletePost = async (postId: string) => {
    if (onDelete) {
      try {
        const deleted = await onDelete(postId);
        if (deleted) {
          setDeletedPostIds(prev => [...prev, postId]);
        }
        return deleted;
      } catch (error) {
        console.error("Error deleting post:", error);
        return false;
      }
    }
    return false;
  };

  return (
    <>
      {visiblePosts.map((post) => (
        <div key={post.id} className={`mb-3 rounded-lg overflow-hidden shadow-sm ${compact ? 'border border-gray-100' : ''}`}>
          {post.type === 'achievement' ? (
            <AchievementCard 
              post={post as any} 
              userName={userName} 
            />
          ) : (
            <div className="max-w-full">
              <PostCard 
                post={post as any} 
                liked={liked} 
                saved={saved} 
                onLike={onLike} 
                onSave={onSave} 
                onShare={onShare}
                onDelete={onDelete ? () => handleDeletePost(post.id) : undefined}
                onEdit={onEdit ? () => onEdit(post.id) : undefined}
                compact={compact}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
