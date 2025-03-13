
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { NewPostDialog } from "./NewPostDialog";
import { toast } from "@/hooks/use-toast";
import { UserPostsList } from "./post/UserPostsList";
import { DefaultPostsList } from "./post/DefaultPostsList";

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
      const postsKey = `user_posts_${user.id}`;
      const storedPosts = localStorage.getItem(postsKey);
      if (storedPosts) {
        setUserPosts(JSON.parse(storedPosts));
      }
      
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
    
    const newLiked = { ...liked, [postId]: !liked[postId] };
    setLiked(newLiked);
    localStorage.setItem(`user_liked_posts_${user.id}`, JSON.stringify(newLiked));
    
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
    
    const newSaved = { ...saved, [postId]: !saved[postId] };
    setSaved(newSaved);
    localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(newSaved));
    
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
  
  const defaultPosts = [
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
        <UserPostsList 
          posts={userPosts}
          userName={user?.user_metadata?.name || "Usuário"}
          liked={liked}
          saved={saved}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
        />
        
        <DefaultPostsList 
          posts={defaultPosts}
          isLoggedIn={!!user}
        />
      </CardContent>
    </Card>
  );
};
