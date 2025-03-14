
import { useState } from "react";
import { PostCardHeader } from "./card/PostCardHeader";
import { PostCardContent } from "./card/PostCardContent";
import { PostCardMedia } from "./card/PostCardMedia";
import { PostCardActions } from "./card/PostCardActions";
import { CommentSection } from "./card/CommentSection";
import { ArticleDetailSheet } from "./card/ArticleDetailSheet";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
  compact?: boolean;
}

export function PostCard({ post, liked, saved, onLike, onSave, onShare, compact = false }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Array<{id: string, text: string, author: string, timestamp: string}>>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const loadComments = async () => {
    if (showComments) return; // Already open
    
    try {
      setIsLoadingComments(true);
      setShowComments(true);
      
      setTimeout(() => {
        setComments([
          {
            id: '1',
            text: 'Conteúdo muito interessante!',
            author: 'Maria Silva',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            text: 'Obrigado por compartilhar esse conhecimento.',
            author: 'João Costa',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
        setIsLoadingComments(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading comments:", error);
      setIsLoadingComments(false);
    }
  };
  
  // Create a shortened content preview for compact mode
  const contentPreview = post.content && post.content.length > 80 
    ? post.content.substring(0, 80) + '...' 
    : post.content;
  
  return (
    <div className={`rounded-md border bg-white shadow-sm ${compact ? 'text-sm' : ''}`}>
      <PostCardHeader 
        post={post} 
        saved={saved}
        onSave={onSave}
        compact={compact}
      />
      
      {!compact && <PostCardContent post={post} />}
      
      <PostCardMedia 
        imageUrl={post.imageUrl} 
        title={post.title} 
        compact={compact}
      />
      
      {compact && post.content && (
        <div className="px-3 py-1">
          <p className="text-gray-800 text-xs line-clamp-2">{contentPreview}</p>
        </div>
      )}
      
      {post.type === 'technical_article' && !compact && (
        <div className="px-4 mb-2">
          <ArticleDetailSheet 
            post={post} 
            liked={liked} 
            saved={saved} 
            onLike={onLike} 
            onSave={onSave} 
            onShare={onShare} 
          />
        </div>
      )}
      
      <PostCardActions 
        postId={post.id}
        likes={post.likes}
        shares={post.shares}
        comments={comments.length}
        liked={liked}
        saved={saved}
        onLike={onLike}
        onSave={onSave}
        onShare={onShare}
        onComment={loadComments}
        compact={compact}
      />
      
      {showComments && !compact && (
        <CommentSection 
          comments={comments} 
          isLoading={isLoadingComments}
          onCancel={() => setShowComments(false)}
        />
      )}
    </div>
  );
}
