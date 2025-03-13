
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Bookmark, Share2, MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

interface PostCardProps {
  post: {
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
  };
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
}

export function PostCard({ post, liked, saved, onLike, onSave, onShare }: PostCardProps) {
  return (
    <div className="mb-6 pb-6 border-b last:border-0">
      <h3 className="text-lg font-medium mb-2">{post.title}</h3>
      <div className="flex gap-2 text-sm text-gray-500 mb-2">
        <span>{post.author}</span>
        <span>•</span>
        <span>{post.date}</span>
        {post.type && (
          <>
            <span>•</span>
            <span className="text-blue-600">
              {post.type === 'service' ? 'Serviço/Área de Atuação' : 
                post.type === 'technical_article' ? 'Artigo Técnico' : ''}
            </span>
          </>
        )}
        {post.company && (
          <>
            <span>•</span>
            <span>{post.company}</span>
          </>
        )}
      </div>
      
      {post.type === 'technical_article' && post.summary && (
        <div className="bg-blue-50 p-3 rounded-md mb-3">
          <p className="text-gray-700 font-medium">Resumo:</p>
          <p className="text-gray-600">{post.summary}</p>
        </div>
      )}
      
      {post.imageUrl && (
        <div className="mb-3">
          <img 
            src={post.imageUrl} 
            alt={post.title || "Imagem da publicação"} 
            className="rounded-md max-h-96 object-contain"
          />
        </div>
      )}
      
      <p className="text-gray-600 mb-3">{post.excerpt || post.content}</p>
      
      {post.type === 'technical_article' && (
        <ArticleDetailSheet post={post} liked={liked} saved={saved} onLike={onLike} onSave={onSave} onShare={onShare} />
      )}
      
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags?.map((tag) => (
          <span key={tag} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex gap-3 mt-4">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${liked[post.id] ? 'text-blue-600' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <ThumbsUp size={16} />
          <span>{post.likes || 0}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${saved[post.id] ? 'text-blue-600' : ''}`}
          onClick={() => onSave(post.id)}
        >
          <Bookmark size={16} />
          <span>{post.saves || 0}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onShare(post.id)}
        >
          <Share2 size={16} />
          <span>{post.shares || 0}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <MessageSquare size={16} />
          <span>0</span>
        </Button>
      </div>
    </div>
  );
}

interface ArticleDetailSheetProps {
  post: PostCardProps['post'];
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
}

function ArticleDetailSheet({ post, liked, saved, onLike, onSave, onShare }: ArticleDetailSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="mb-3">
          Ler artigo completo
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90%] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{post.title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex gap-2 text-sm text-gray-500">
            <span>{post.author}</span>
            {post.company && (
              <>
                <span>•</span>
                <span>{post.company}</span>
              </>
            )}
            <span>•</span>
            <span>{new Date(post.timestamp).toLocaleDateString('pt-BR')}</span>
          </div>
          
          {post.imageUrl && (
            <div className="py-2">
              <img 
                src={post.imageUrl} 
                alt={post.title || "Imagem do artigo"} 
                className="rounded-md max-h-96 object-contain mx-auto"
              />
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium mb-1">Resumo</h3>
            <p>{post.summary}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Conteúdo Principal</h3>
            <div className="whitespace-pre-line">
              {post.mainContent || post.content}
            </div>
          </div>
          
          {post.conclusions && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-1">Principais Conclusões</h3>
              <p>{post.conclusions}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${liked[post.id] ? 'text-blue-600' : ''}`}
                onClick={() => onLike(post.id)}
              >
                <ThumbsUp size={16} />
                <span>{post.likes || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${saved[post.id] ? 'text-blue-600' : ''}`}
                onClick={() => onSave(post.id)}
              >
                <Bookmark size={16} />
                <span>{post.saves || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => onShare(post.id)}
              >
                <Share2 size={16} />
                <span>{post.shares || 0}</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
