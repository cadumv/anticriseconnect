
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Post } from "@/types/post";

interface ArticleFullContentProps {
  post: Post;
}

// Function to format text with markdown-like syntax
const formatText = (text: string) => {
  if (!text) return "";
  
  // Format bold text
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Format bullet lists (lines starting with •)
  formattedText = formattedText.split('\n').map(line => {
    if (line.trim().startsWith('•')) {
      return `<li>${line.trim().substring(1).trim()}</li>`;
    }
    return line;
  }).join('\n');
  
  // Wrap adjacent list items in <ul> tags
  let inList = false;
  const lines = formattedText.split('\n');
  formattedText = lines.map((line, index) => {
    if (line.startsWith('<li>')) {
      if (!inList) {
        inList = true;
        return '<ul>' + line;
      }
      return line;
    } else if (inList) {
      inList = false;
      return '</ul>' + line;
    }
    return line;
  }).join('\n');
  
  // Close any open list at the end
  if (inList) {
    formattedText += '</ul>';
  }
  
  // Convert newlines to <br> tags for HTML rendering
  formattedText = formattedText.replace(/\n/g, '<br>');
  
  return formattedText;
};

export function ArticleFullContent({ post }: ArticleFullContentProps) {
  const formattedDate = post.timestamp 
    ? new Date(post.timestamp).toLocaleDateString('pt-BR') 
    : '';
    
  // For technical articles, we should ensure we're using all available content 
  return (
    <div className="mt-4 space-y-6">
      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
        {post.author && <span className="font-medium">Autor: {post.author}</span>}
        {post.company && (
          <span className="font-medium">Empresa: {post.company}</span>
        )}
        {formattedDate && (
          <span>Data: {formattedDate}</span>
        )}
      </div>
      
      {post.title && (
        <h2 className="text-xl font-semibold">{post.title}</h2>
      )}
      
      {post.imageUrl && (
        <div className="py-2 max-w-xl mx-auto">
          <AspectRatio ratio={16 / 9}>
            <img 
              src={post.imageUrl} 
              alt={post.title || "Imagem do artigo"} 
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      )}
      
      {post.summary && (
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium mb-1">Resumo</h3>
          <div 
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ 
              __html: formatText(post.summary) 
            }}
          />
        </div>
      )}
      
      {post.mainContent && (
        <div>
          <h3 className="font-medium mb-2 text-lg">Conteúdo Principal</h3>
          <div 
            className="article-content space-y-4" 
            dangerouslySetInnerHTML={{ 
              __html: formatText(post.mainContent) 
            }}
          />
        </div>
      )}
      
      {!post.mainContent && post.content && (
        <div>
          <h3 className="font-medium mb-2 text-lg">Conteúdo</h3>
          <div 
            className="article-content space-y-4" 
            dangerouslySetInnerHTML={{ 
              __html: formatText(post.content) 
            }}
          />
        </div>
      )}
      
      {post.conclusions && (
        <div className="bg-gray-50 p-4 rounded-md mt-6">
          <h3 className="font-medium mb-1">Principais Conclusões</h3>
          <div 
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ 
              __html: formatText(post.conclusions) 
            }}
          />
        </div>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-1">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
