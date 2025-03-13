
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Trophy, ThumbsUp, Bookmark, Share2, MessageSquare } from "lucide-react";
import { NewPostDialog } from "./NewPostDialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { toast } from "@/hooks/use-toast";

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

export const Feed = () => {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (user) {
      // Load user posts including shared achievements
      const postsKey = `user_posts_${user.id}`;
      const storedPosts = localStorage.getItem(postsKey);
      if (storedPosts) {
        setUserPosts(JSON.parse(storedPosts));
      }
      
      // Load liked and saved status
      const likedKey = `user_liked_posts_${user.id}`;
      const savedKey = `user_saved_posts_${user.id}`;
      const storedLiked = localStorage.getItem(likedKey);
      const storedSaved = localStorage.getItem(savedKey);
      
      if (storedLiked) setLiked(JSON.parse(storedLiked));
      if (storedSaved) setSaved(JSON.parse(storedSaved));
    }
  }, [user]);
  
  const handleLike = (postId: string) => {
    if (!user) return;
    
    // Update local liked state
    const newLiked = { ...liked, [postId]: !liked[postId] };
    setLiked(newLiked);
    localStorage.setItem(`user_liked_posts_${user.id}`, JSON.stringify(newLiked));
    
    // Update post likes count
    const updatedPosts = userPosts.map(post => {
      if (post.id === postId) {
        const currentLikes = post.likes || 0;
        return { 
          ...post, 
          likes: liked[postId] ? Math.max(0, currentLikes - 1) : currentLikes + 1 
        };
      }
      return post;
    });
    
    setUserPosts(updatedPosts);
    localStorage.setItem(`user_posts_${user.id}`, JSON.stringify(updatedPosts));
  };
  
  const handleSave = (postId: string) => {
    if (!user) return;
    
    // Update local saved state
    const newSaved = { ...saved, [postId]: !saved[postId] };
    setSaved(newSaved);
    localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(newSaved));
    
    // Update post saves count
    const updatedPosts = userPosts.map(post => {
      if (post.id === postId) {
        const currentSaves = post.saves || 0;
        return { 
          ...post, 
          saves: saved[postId] ? Math.max(0, currentSaves - 1) : currentSaves + 1 
        };
      }
      return post;
    });
    
    setUserPosts(updatedPosts);
    localStorage.setItem(`user_posts_${user.id}`, JSON.stringify(updatedPosts));
    
    toast({
      title: saved[postId] ? "Artigo removido" : "Artigo salvo",
      description: saved[postId] 
        ? "O artigo foi removido dos seus salvos" 
        : "O artigo foi salvo e você pode acessá-lo depois",
    });
  };
  
  const handleShare = (postId: string) => {
    if (!user) return;
    
    // Update post shares count
    const updatedPosts = userPosts.map(post => {
      if (post.id === postId) {
        const currentShares = post.shares || 0;
        return { ...post, shares: currentShares + 1 };
      }
      return post;
    });
    
    setUserPosts(updatedPosts);
    localStorage.setItem(`user_posts_${user.id}`, JSON.stringify(updatedPosts));
    
    toast({
      title: "Compartilhado",
      description: "O artigo foi compartilhado com sucesso",
    });
  };
  
  const posts = [
    {
      id: "1",
      title: "Engenheiro Civil busca parceria para projeto residencial",
      author: "Carlos Silva",
      date: "Há 2 dias",
      excerpt: "Busco engenheiro eletricista para colaboração em projeto residencial de alto padrão na zona sul.",
      tags: ["Civil", "Residencial", "Parceria"]
    },
    {
      id: "2",
      title: "Vaga para engenheiro mecânico em projeto industrial",
      author: "Marina Oliveira",
      date: "Há 5 dias",
      excerpt: "Empresa de grande porte busca engenheiro mecânico com experiência em projetos industriais.",
      tags: ["Mecânica", "Industrial", "Vaga"]
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Feed de Projetos</CardTitle>
        {user && <NewPostDialog />}
      </CardHeader>
      <CardContent>
        {/* User achievement posts */}
        {userPosts.length > 0 && userPosts.map((post) => (
          <div key={post.id} className="mb-6 pb-6 border-b last:border-0">
            {post.type === 'achievement' ? (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex gap-2 text-sm text-gray-500 mb-1">
                    <span>{user?.user_metadata?.name || "Usuário"}</span>
                    <span>•</span>
                    <span>{new Date(post.timestamp).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p className="text-gray-600">{post.content}</p>
                </div>
              </div>
            ) : (
              <>
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
                              onClick={() => handleLike(post.id)}
                            >
                              <ThumbsUp size={16} />
                              <span>{post.likes || 0}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`flex items-center gap-1 ${saved[post.id] ? 'text-blue-600' : ''}`}
                              onClick={() => handleSave(post.id)}
                            >
                              <Bookmark size={16} />
                              <span>{post.saves || 0}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleShare(post.id)}
                            >
                              <Share2 size={16} />
                              <span>{post.shares || 0}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
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
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbsUp size={16} />
                    <span>{post.likes || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 ${saved[post.id] ? 'text-blue-600' : ''}`}
                    onClick={() => handleSave(post.id)}
                  >
                    <Bookmark size={16} />
                    <span>{post.saves || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleShare(post.id)}
                  >
                    <Share2 size={16} />
                    <span>{post.shares || 0}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    <span>0</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        
        {/* Default posts */}
        {posts.map((post) => (
          <div key={post.id} className="mb-6 pb-6 border-b last:border-0">
            <h3 className="text-lg font-medium mb-2">{post.title}</h3>
            <div className="flex gap-2 text-sm text-gray-500 mb-2">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
            <p className="text-gray-600 mb-3">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags?.map((tag) => (
                <span key={tag} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">Ver detalhes</Button>
              {user && <Button size="sm" variant="ghost">Contatar</Button>}
            </div>
          </div>
        ))}
        
        {!user && (
          <div className="text-center py-4 mt-4 border-t">
            <p className="text-gray-500 mb-4">Faça login para ver mais projetos e interagir com outros engenheiros</p>
            <div className="flex gap-2 justify-center">
              <Link to="/login">
                <Button size="sm">Entrar</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="outline">Cadastrar</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
