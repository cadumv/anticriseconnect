
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
  compact = false
}: UserPostsListProps) {
  return (
    <>
      {posts.length > 0 && posts.map((post) => (
        <div key={post.id} className="mb-4 rounded-lg overflow-hidden shadow-sm">
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
                compact={compact}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
