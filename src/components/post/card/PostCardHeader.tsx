
import React, { useEffect, useState } from "react";
import { MoreHorizontal, X, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

interface PostCardHeaderProps {
  post: {
    id?: string;
    author?: string;
    timestamp: string;
    company?: string;
    user_id?: string;
    date?: string;
  };
  saved?: Record<string, boolean>;
  onSave?: (postId: string) => void;
}

export function PostCardHeader({ post, saved, onSave }: PostCardHeaderProps) {
  const [userProfile, setUserProfile] = useState<{name?: string, avatar_url?: string, username?: string} | null>(null);
  
  const formattedDate = post.date || new Date(post.timestamp).toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'short'
  });
  
  const fetchUserProfile = async () => {
    if (!post.user_id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, avatar_url, username')
        .eq('id', post.user_id)
        .single();
      
      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [post.user_id]);
  
  const handleSaveFromMenu = () => {
    if (onSave && post.id) {
      onSave(post.id);
    }
  };

  return (
    <div className="p-4 pb-0">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userProfile?.avatar_url || "https://github.com/shadcn.png"} alt={post.author || userProfile?.name || "User"} />
            <AvatarFallback>{(userProfile?.name?.[0] || post.author?.[0] || "U").toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-semibold text-base leading-tight">{userProfile?.name || post.author}</h3>
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start rounded-none"
                  onClick={handleSaveFromMenu}
                >
                  {saved && post.id && saved[post.id] ? "Remover dos salvos" : "Salvar publicação"}
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
  );
}
