
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Post } from "@/types/post";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useProfilePosts = (user: User) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!user) return;
    
    setIsLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform posts to match Post interface
      const formattedPosts = data.map(post => {
        const metadata = post.metadata || {};
        
        return {
          id: post.id,
          content: post.content,
          timestamp: post.created_at,
          imageUrl: post.image_url,
          likes: post.likes || 0,
          saves: post.saves || 0,
          shares: post.shares || 0,
          user_id: post.user_id,
          metadata: post.metadata,
          type: metadata.type || 'post',
          title: metadata.title,
          author: metadata.author || user.user_metadata?.name || "Usuário",
          date: new Date(post.created_at).toLocaleDateString('pt-BR')
        };
      });
      
      setUserPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Start editing a post
  const onEditPost = (postId: string) => {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      setCurrentPostId(postId);
      setEditPostContent(post.content || "");
      setIsEditingPost(true);
    }
  };

  // Save the edited post
  const saveEditedPost = async () => {
    if (!currentPostId || !editPostContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content: editPostContent })
        .eq('id', currentPostId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUserPosts(prev => prev.map(post => 
        post.id === currentPostId 
          ? { ...post, content: editPostContent }
          : post
      ));
      
      toast({
        title: "Publicação atualizada",
        description: "Sua publicação foi atualizada com sucesso.",
      });
      
      resetEditState();
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Erro ao atualizar publicação",
        description: "Não foi possível atualizar sua publicação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update posts after deletion
  const updatePostsAfterDelete = (postId: string) => {
    setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  // Reset edit dialog state
  const resetEditState = () => {
    setIsEditingPost(false);
    setCurrentPostId(null);
    setEditPostContent("");
  };

  // Fetch posts when user changes
  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  return {
    userPosts,
    isLoadingPosts,
    isEditingPost,
    editPostContent,
    isSubmitting,
    setIsEditingPost,
    setEditPostContent,
    onEditPost,
    saveEditedPost,
    updatePostsAfterDelete,
    resetEditState,
    fetchUserPosts
  };
};
