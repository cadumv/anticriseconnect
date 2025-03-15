
import React from "react";
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
  onDelete?: (postId: string) => void;
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
  compact = false
}: UserPostsListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Nenhuma publicação encontrada
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
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
                onDelete={onDelete ? () => onDelete(post.id) : undefined}
                compact={compact}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
