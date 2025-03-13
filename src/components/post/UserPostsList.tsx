
import React from "react";
import { PostCard } from "./PostCard";
import { AchievementCard } from "./AchievementCard";

interface Post {
  id: string;
  title?: string;
  author?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  content?: string;
  type?: 'achievement' | 'post' | 'service' | 'technical_article';
  achievementId?: string;
  timestamp: string;
  imageUrl?: string;
  summary?: string;
  conclusions?: string;
  mainContent?: string;
  company?: string;
  likes?: number;
  saves?: number;
  shares?: number;
}

interface AchievementPost {
  id: string;
  content?: string;
  timestamp: string;
  type: 'achievement';
}

interface StandardPost {
  id: string;
  title?: string;
  author?: string;
  date?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  type?: 'service' | 'technical_article';
  timestamp: string;
  imageUrl?: string;
  summary?: string;
  mainContent?: string;
  conclusions?: string;
  company?: string;
  likes?: number;
  saves?: number;
  shares?: number;
}

interface UserPostsListProps {
  posts: Post[];
  userName: string;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
}

export function UserPostsList({ 
  posts, 
  userName, 
  liked, 
  saved, 
  onLike, 
  onSave, 
  onShare 
}: UserPostsListProps) {
  return (
    <>
      {posts.length > 0 && posts.map((post) => (
        <div key={post.id} className="mb-4 rounded-lg overflow-hidden shadow-sm">
          {post.type === 'achievement' ? (
            <AchievementCard 
              post={post as AchievementPost} 
              userName={userName} 
            />
          ) : (
            <PostCard 
              post={post as StandardPost} 
              liked={liked} 
              saved={saved} 
              onLike={onLike} 
              onSave={onSave} 
              onShare={onShare} 
            />
          )}
        </div>
      ))}
    </>
  );
}
