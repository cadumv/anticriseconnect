
import { User } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserPostsList } from "@/components/post/UserPostsList";
import { useProfilePostInteractions } from "@/hooks/useProfilePostInteractions";
import { useProfilePosts } from "@/hooks/useProfilePosts";
import { EditPostDialog } from "./EditPostDialog";
import { PostsLoadingState, EmptyPostsState } from "./ProfilePostsStates";

interface ProfilePostsProps {
  user: User;
}

export const ProfilePosts = ({ user }: ProfilePostsProps) => {
  // Post data and editing functionality
  const {
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
    resetEditState
  } = useProfilePosts(user);
  
  // Post interactions using our custom hook
  const { 
    liked, 
    saved, 
    handleLikePost, 
    handleSavePost, 
    handleSharePost,
    handleDeletePost 
  } = useProfilePostInteractions(user);

  // Delete post handler with local state update
  const onDeletePost = async (postId: string) => {
    if (!user) return false;
    
    const success = await handleDeletePost(postId);
    if (success) {
      updatePostsAfterDelete(postId);
    }
    return success;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Minhas Publicações</CardTitle>
        <CardDescription>Publicações que você compartilhou</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingPosts ? (
          <PostsLoadingState />
        ) : userPosts.length > 0 ? (
          <UserPostsList
            posts={userPosts}
            userName={user.user_metadata?.name || "Usuário"}
            liked={liked}
            saved={saved}
            onLike={handleLikePost}
            onSave={handleSavePost}
            onShare={handleSharePost}
            onDelete={onDeletePost}
            onEdit={onEditPost}
          />
        ) : (
          <EmptyPostsState />
        )}
        
        <EditPostDialog
          isOpen={isEditingPost}
          onOpenChange={setIsEditingPost}
          content={editPostContent}
          onChange={setEditPostContent}
          onSave={saveEditedPost}
          isSubmitting={isSubmitting}
          onCancel={resetEditState}
        />
      </CardContent>
    </Card>
  );
};
