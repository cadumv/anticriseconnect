
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
  postId: string; // Add postId to know which post the comments belong to
}

export function CommentSection({ comments: initialComments, isLoading: initialLoading, onCancel, postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [authorProfiles, setAuthorProfiles] = useState<Record<string, { avatar_url: string, name: string }>>({});
  
  // Fetch comments from the database
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id,
            text,
            user_id,
            created_at
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to match our Comment interface
        const formattedComments: Comment[] = data.map(comment => ({
          id: comment.id,
          text: comment.text,
          author: 'Loading...', // Will be replaced when we fetch profiles
          authorId: comment.user_id,
          timestamp: comment.created_at
        }));
        
        setLocalComments(formattedComments);
        
        // Fetch user profiles for the comments
        const userIds = Array.from(new Set(formattedComments.map(c => c.authorId)));
        if (userIds.length > 0) {
          await fetchUserProfiles(userIds as string[]);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: "Erro ao carregar comentários",
          description: "Não foi possível carregar os comentários deste post.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComments();
    
    // Set up realtime subscription for new comments
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'comments',
          filter: `post_id=eq.${postId}`
        }, 
        (payload) => {
          console.log('New comment:', payload);
          const newComment = payload.new as any;
          
          // Only add the comment if it's not from the current user (we've already added it locally)
          if (newComment.user_id !== user?.id) {
            const commentData: Comment = {
              id: newComment.id,
              text: newComment.text,
              author: 'Loading...', // Will be replaced when we fetch the profile
              authorId: newComment.user_id,
              timestamp: newComment.created_at
            };
            
            setLocalComments(prev => [commentData, ...prev]);
            
            // Fetch the user profile for this comment
            fetchUserProfiles([newComment.user_id]);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);
  
  // Fetch profile pictures for all authors in comments
  const fetchUserProfiles = async (userIds: string[]) => {
    try {
      if (userIds.length === 0) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, avatar_url, name')
        .in('id', userIds);
      
      if (error) throw error;
      
      // Create a lookup map of author ID to avatar URL and name
      const profileMap: Record<string, { avatar_url: string, name: string }> = {};
      data?.forEach(profile => {
        profileMap[profile.id] = { 
          avatar_url: profile.avatar_url || '', 
          name: profile.name || 'Usuário' 
        };
      });
      
      setAuthorProfiles(prev => ({...prev, ...profileMap}));
    } catch (error) {
      console.error('Error fetching author profiles:', error);
    }
  };
  
  const postComment = async () => {
    if (!comment.trim() || !user || !postId) return;
    
    try {
      // Save the comment to the database
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          text: comment
        })
        .select('id, created_at')
        .single();
      
      if (error) throw error;
      
      // Add the comment to the local state
      const newComment: Comment = {
        id: data.id,
        text: comment,
        author: user.user_metadata?.name || "Usuário",
        authorId: user.id,
        authorAvatar: user.user_metadata?.avatar_url,
        timestamp: data.created_at
      };
      
      setLocalComments(prev => [newComment, ...prev]);
      setComment("");
      
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado com sucesso."
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Erro ao adicionar comentário",
        description: "Não foi possível publicar seu comentário. Tente novamente.",
        variant: "destructive"
      });
    }
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
            const authorName = comment.author !== 'Loading...' ? comment.author : (profileInfo ? profileInfo.name : 'Usuário');
            
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
