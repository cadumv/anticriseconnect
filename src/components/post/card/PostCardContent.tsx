
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArticleFullContent } from "./ArticleFullContent";
import { Post } from "@/types/post";

interface PostCardContentProps {
  post: {
    type?: 'post' | 'service' | 'technical_article' | 'achievement';
    excerpt?: string;
    content?: string;
    summary?: string;
    tags?: string[];
    title?: string;
    author?: string;
    company?: string;
    mainContent?: string;
    conclusions?: string;
    imageUrl?: string;
    timestamp?: string;
  };
}

export function PostCardContent({ post }: PostCardContentProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showArticleDialog, setShowArticleDialog] = useState(false);
  
  const maxContentLength = 280;
  const contentIsTruncated = (post.excerpt || post.content || '').length > maxContentLength;
  const displayContent = showFullContent 
    ? (post.excerpt || post.content || '') 
    : (post.excerpt || post.content || '').substring(0, maxContentLength);
  
  return (
    <div className="p-4">
      {post.type && post.type !== 'post' && post.type !== 'achievement' && (
        <div className="mb-2">
          <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
            {post.type === 'service' ? 'Serviço/Área de Atuação' : 
              post.type === 'technical_article' ? 'Artigo Técnico' : ''}
          </Badge>
        </div>
      )}
      
      <div className="whitespace-pre-line text-gray-800">
        {displayContent}
        
        {contentIsTruncated && !showFullContent && (
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-600" 
            onClick={() => setShowFullContent(true)}
          >
            ...ver mais
          </Button>
        )}
      </div>
      
      {post.type === 'technical_article' && post.summary && (
        <div className="bg-blue-50 p-3 rounded-md my-3">
          <p className="text-gray-700 font-medium">Resumo:</p>
          <p className="text-gray-600">{post.summary}</p>
        </div>
      )}
      
      {post.type !== 'achievement' && (
        <Button 
          variant="outline" 
          size="sm" 
          className="my-2 gap-2"
          onClick={() => setShowArticleDialog(true)}
        >
          <BookOpen size={16} />
          {post.type === 'technical_article' ? 'Ler artigo completo' : 'Ver publicação completa'}
        </Button>
      )}
      
      <div className="flex flex-wrap gap-2 my-3">
        {post.tags?.map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
            #{tag}
          </span>
        ))}
      </div>
      
      {/* Full Article Dialog */}
      <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{post.title || "Publicação completa"}</DialogTitle>
          </DialogHeader>
          <ArticleFullContent post={post as Post} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
