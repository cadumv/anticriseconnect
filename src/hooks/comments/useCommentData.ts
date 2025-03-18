
import { useState, useEffect } from "react";
import { Comment } from "@/types/post";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { AuthorProfile, UseCommentDataReturn } from "./types";

export function useCommentData(postId: string): UseCommentDataReturn {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authorProfiles, setAuthorProfiles] = useState<Record<string, AuthorProfile>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [mentionUsers, setMentionUsers] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    // Load liked comments from localStorage
    if (user) {
      const likedCommentsKey = `user_liked_comments_${user.id}`;
      const storedLikes = localStorage.getItem(likedCommentsKey);
      if (storedLikes) {
        setLiked(JSON.parse(storedLikes));
      }
    }
    
    fetchProfiles();
    fetchComments();
  }, [postId, user?.id]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .limit(100);
      
      if (error) throw error;
      
      if (data) {
        setMentionUsers(data.map(p => ({ id: p.id, name: p.name || 'Usuário' })));
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };
  
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
          created_at,
          parent_id,
          post_id,
          likes
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform comments to our Comment type
      const formattedComments: Comment[] = data.map(comment => ({
        id: comment.id,
        text: comment.text,
        author: 'Loading...',
        authorId: comment.user_id,
        timestamp: comment.created_at,
        parentId: comment.parent_id,
        likes: comment.likes || 0,
        post_id: comment.post_id
      }));
      
      // Organize comments into a thread structure with parent and replies
      const threadedComments = organizeCommentsIntoThreads(formattedComments);
      
      setComments(threadedComments);
      
      // Fetch user profiles for all comments and replies
      const userIds = Array.from(new Set(
        data.map(c => c.user_id)
      ));
      
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

  const fetchUserProfiles = async (userIds: string[]) => {
    try {
      if (userIds.length === 0) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, avatar_url, name')
        .in('id', userIds);
      
      if (error) throw error;
      
      const profileMap: Record<string, AuthorProfile> = {};
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

  const organizeCommentsIntoThreads = (comments: Comment[]): Comment[] => {
    const topLevelComments: Comment[] = [];
    const replyMap: Record<string, Comment[]> = {};
    
    // Group replies by parent ID
    comments.forEach(comment => {
      if (comment.parentId) {
        if (!replyMap[comment.parentId]) {
          replyMap[comment.parentId] = [];
        }
        replyMap[comment.parentId].push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });
    
    // Add replies to their parent comments
    const addRepliesToComments = (commentsList: Comment[]): Comment[] => {
      return commentsList.map(comment => {
        const replies = replyMap[comment.id] || [];
        return {
          ...comment,
          replies: addRepliesToComments(replies)
        };
      });
    };
    
    return addRepliesToComments(topLevelComments);
  };

  return {
    comments,
    isLoading,
    authorProfiles,
    liked,
    mentionUsers,
    organizeCommentsIntoThreads,
  };
}
