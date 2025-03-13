
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Bookmark, Share2, MessageSquare, MoreHorizontal, ExternalLink, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [showFullContent, setShowFullContent] = useState(false);
  const formattedDate = post.date || new Date(post.timestamp).toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'short'
  });
  
  const maxContentLength = 280;
  const contentIsTruncated = (post.excerpt || post.content || '').length > maxContentLength;
  const displayContent = showFullContent 
    ? (post.excerpt || post.content || '') 
    : (post.excerpt || post.content || '').substring(0, maxContentLength);
  
  return (
    <div className="rounded-md border bg-white shadow-sm">
      {/* Header - Author Info */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" alt={post.author || "User"} />
              <AvatarFallback>{post.author?.[0] || "U"}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-base leading-tight">{post.author}</h3>
              <p className="text-sm text-gray-500">{post.company || "Engenheiro"}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>{formattedDate}</span>
                <span>•</span>
                <ExternalLink size={14} className="text-gray-500" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="flex flex-col">
                  <Button variant="ghost" size="sm" className="justify-start rounded-none">
                    Salvar publicação
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start rounded-none">
                    Denunciar
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start rounded-none">
                    Não quero ver isso
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Post Type Tag */}
        {post.type && (
          <div className="mb-2">
            <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
              {post.type === 'service' ? 'Serviço/Área de Atuação' : 
                post.type === 'technical_article' ? 'Artigo Técnico' : ''}
            </Badge>
          </div>
        )}
        
        {/* Content/Excerpt */}
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
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 my-3">
          {post.tags?.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Media */}
      {post.imageUrl && (
        <div className="mb-3">
          <AspectRatio ratio={16/9}>
            <img 
              src={post.imageUrl} 
              alt={post.title || "Imagem da publicação"} 
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      )}
      
      {/* Article Detail Link */}
      {post.type === 'technical_article' && (
        <div className="px-4 mb-2">
          <ArticleDetailSheet post={post} liked={liked} saved={saved} onLike={onLike} onSave={onSave} onShare={onShare} />
        </div>
      )}
      
      {/* Engagement Metrics */}
      <div className="px-4 pt-1 pb-1 flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
              <ThumbsUp className="h-2 w-2 text-white" />
            </div>
          </div>
          <span>{post.likes || 0}</span>
        </div>
        
        <div className="flex gap-3">
          <span>{post.shares || 0} compartilhamentos</span>
          <span>0 comentários</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="border-t">
        <div className="grid grid-cols-4 px-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center justify-center gap-2 rounded-md py-2",
              liked[post.id] ? "text-blue-600" : "text-gray-600"
            )}
            onClick={() => onLike(post.id)}
          >
            <ThumbsUp size={18} />
            <span className="font-medium">Gostei</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-center gap-2 rounded-md py-2 text-gray-600"
          >
            <MessageSquare size={18} />
            <span className="font-medium">Comentar</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-center gap-2 rounded-md py-2 text-gray-600"
            onClick={() => onShare(post.id)}
          >
            <Share2 size={18} />
            <span className="font-medium">Compartilhar</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center justify-center gap-2 rounded-md py-2",
              saved[post.id] ? "text-blue-600" : "text-gray-600"
            )}
            onClick={() => onSave(post.id)}
          >
            <Bookmark size={18} />
            <span className="font-medium">Salvar</span>
          </Button>
        </div>
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
