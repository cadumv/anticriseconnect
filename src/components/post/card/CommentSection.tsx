
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  text: string;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  timestamp: string;
}

interface CommentSectionProps {
  comments: Comment[];
  isLoading: boolean;
  onCancel: () => void;
}

export function CommentSection({ comments: initialComments, isLoading, onCancel }: CommentSectionProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(initialComments);
  const [authorProfiles, setAuthorProfiles] = useState<Record<string, { avatar_url: string, name: string }>>({});
  
  // Fetch profile pictures for all authors in comments
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        if (initialComments.length === 0) return;
        
        // Get unique author IDs
        const authorIds = Array.from(new Set(initialComments
          .filter(comment => comment.authorId)
          .map(comment => comment.authorId)
        ));
        
        if (authorIds.length === 0) return;
        
        // Fetch profiles for these authors
        const { data, error } = await supabase
          .from('profiles')
          .select('id, avatar_url, name')
          .in('id', authorIds as string[]);
        
        if (error) throw error;
        
        // Create a lookup map of author ID to avatar URL
        const profileMap: Record<string, { avatar_url: string, name: string }> = {};
        data?.forEach(profile => {
          profileMap[profile.id] = { 
            avatar_url: profile.avatar_url || '', 
            name: profile.name || 'Usuário' 
          };
        });
        
        setAuthorProfiles(profileMap);
      } catch (error) {
        console.error('Error fetching author profiles:', error);
      }
    };
    
    fetchProfiles();
  }, [initialComments]);
  
  const postComment = () => {
    if (!comment.trim() || !user) return;
    
    const newComment: Comment = {
      id: `temp-${Date.now()}`,
      text: comment,
      author: user.user_metadata?.name || "Usuário",
      authorId: user.id,
      authorAvatar: user.user_metadata?.avatar_url,
      timestamp: new Date().toISOString()
    };
    
    setLocalComments(prev => [newComment, ...prev]);
    setComment("");
    
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi publicado com sucesso."
    });
  };
  
  return (
    <div className="border-t p-4">
      <h4 className="font-medium mb-3">Comentários</h4>
      
      {user && (
        <div className="flex gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user.user_metadata?.avatar_url} 
              alt={user.user_metadata?.name || "Usuário"}
            />
            <AvatarFallback>{(user.user_metadata?.name?.[0] || "U").toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea 
              placeholder="Adicione um comentário..." 
              className="w-full mb-2 min-h-[60px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onCancel}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button 
                size="sm"
                onClick={postComment}
                disabled={!comment.trim()}
              >
                Publicar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {localComments.map((comment) => {
            // Get profile info if available
            const profileInfo = comment.authorId ? authorProfiles[comment.authorId] : null;
            const avatarUrl = comment.authorAvatar || (profileInfo ? profileInfo.avatar_url : null);
            const authorName = comment.author || (profileInfo ? profileInfo.name : 'Usuário');
            
            return (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={authorName} />
                  ) : (
                    <AvatarFallback>{authorName[0].toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium text-sm">{authorName}</p>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>
                      {new Date(comment.timestamp).toLocaleDateString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <button className="hover:text-blue-600">Responder</button>
                    <button className="hover:text-blue-600">Curtir</button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {localComments.length === 0 && (
            <p className="text-gray-500 text-center py-2">Seja o primeiro a comentar.</p>
          )}
        </div>
      )}
    </div>
  );
}
