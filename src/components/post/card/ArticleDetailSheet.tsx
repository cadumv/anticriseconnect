
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ThumbsUp, Bookmark, Share2 } from "lucide-react";
import { Post } from "@/types/post";

interface ArticleDetailSheetProps {
  post: Post;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
}

export function ArticleDetailSheet({ post, liked, saved, onLike, onSave, onShare }: ArticleDetailSheetProps) {
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
            <div className="py-2 max-w-md mx-auto">
              <AspectRatio ratio={1}>
                <img 
                  src={post.imageUrl} 
                  alt={post.title || "Imagem do artigo"} 
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>
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
