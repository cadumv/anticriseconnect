
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
    metadata?: any; // Add metadata field
  };
}

export function PostCardContent({ post }: PostCardContentProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showArticleDialog, setShowArticleDialog] = useState(false);
  
  const maxContentLength = 280;
  let displayContent = '';
  
  // Get content from either direct properties or metadata
  const metadata = post.metadata || {};
  const postType = post.type || metadata.type || 'post';
  const postTitle = post.title || metadata.title;
  const postAuthor = post.author || metadata.author;
  const postCompany = post.company || metadata.company;
  const postSummary = post.summary || metadata.summary;
  const postMainContent = post.mainContent || metadata.mainContent;
  const postConclusions = post.conclusions || metadata.conclusions;
  const postTags = post.tags || metadata.tags || [];
  
  // For technical articles, prioritize showing the summary if available
  if (postType === 'technical_article') {
    displayContent = postSummary || post.excerpt || post.content || '';
  } else {
    displayContent = post.excerpt || post.content || '';
  }
  
  const contentIsTruncated = displayContent.length > maxContentLength;
  const truncatedContent = contentIsTruncated 
    ? displayContent.substring(0, maxContentLength) 
    : displayContent;
  
  const displayedContent = showFullContent ? displayContent : truncatedContent;

  // Debug info - log when opening a technical article to check its fields
  const handleOpenFullArticle = () => {
    console.log("Opening post:", {
      type: postType,
      title: postTitle,
      summary: postSummary,
      mainContent: postMainContent,
      conclusions: postConclusions,
      content: post.content,
      metadata: post.metadata
    });
    setShowArticleDialog(true);
  };
  
  return (
    <div className="p-4">
      {postType && postType !== 'post' && postType !== 'achievement' && (
        <div className="mb-2">
          <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
            {postType === 'service' ? 'Serviço/Área de Atuação' : 
              postType === 'technical_article' ? 'Artigo Técnico' : ''}
          </Badge>
        </div>
      )}
      
      {postTitle && (
        <h3 className="font-medium text-lg mb-2">{postTitle}</h3>
      )}
      
      {postAuthor && postType === 'technical_article' && (
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Autor:</span> {postAuthor}
          {postCompany && ` • ${postCompany}`}
        </div>
      )}
      
      <div className="whitespace-pre-line text-gray-800">
        {displayedContent}
        
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
      
      {postType === 'technical_article' && postSummary && (
        <div className="bg-blue-50 p-3 rounded-md my-3">
          <p className="text-gray-700 font-medium">Resumo:</p>
          <p className="text-gray-600">{postSummary}</p>
        </div>
      )}
      
      {postType !== 'achievement' && (
        <Button 
          variant="outline" 
          size="sm" 
          className="my-2 gap-2"
          onClick={handleOpenFullArticle}
        >
          <BookOpen size={16} />
          {postType === 'technical_article' ? 'Ler artigo completo' : 'Ver publicação completa'}
        </Button>
      )}
      
      <div className="flex flex-wrap gap-2 my-3">
        {postTags?.map((tag: string) => (
          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
            #{tag}
          </span>
        ))}
      </div>
      
      {/* Full Article Dialog */}
      <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{postTitle || "Publicação completa"}</DialogTitle>
            <DialogDescription>
              Visualize todos os detalhes desta publicação
            </DialogDescription>
          </DialogHeader>
          <ArticleFullContent post={{
            ...post,
            type: postType,
            title: postTitle,
            author: postAuthor,
            company: postCompany,
            summary: postSummary,
            mainContent: postMainContent,
            conclusions: postConclusions,
            tags: postTags
          } as Post} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
