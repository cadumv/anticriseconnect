
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserPostsList } from "@/components/post/UserPostsList";
import { CreatePostDialog } from "./activities/CreatePostDialog";
import { EditPostDialog } from "@/components/profile/EditPostDialog";
import { useProfilePosts } from "@/hooks/useProfilePosts";
import { useProfilePostInteractions } from "@/hooks/useProfilePostInteractions";

interface ProfileActivitiesProps {
  user: User;
}

export const ProfileActivities = ({ user }: ProfileActivitiesProps) => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { toast } = useToast();
  
  const {
    userPosts,
    isLoadingPosts: isLoading,
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
  
  const {
    liked,
    saved,
    handleLikePost,
    handleSavePost,
    handleSharePost,
    handleDeletePost
  } = useProfilePostInteractions(user);
  
  const handleDeleteSuccess = async (postId: string) => {
    const success = await handleDeletePost(postId);
    if (success) {
      updatePostsAfterDelete(postId);
    }
    return success;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Atividades</CardTitle>
        <div className="flex items-center gap-2">
          <CreatePostDialog 
            isOpen={isCreatingPost}
            onOpenChange={setIsCreatingPost}
            userId={user.id}
            onPostCreated={updatePostsAfterDelete}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => toast({
              title: "Editar atividades",
              description: "Você pode adicionar novas atividades clicando em 'Criar publicação'.",
            })}
          >
            <PencilLine className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : userPosts.length > 0 ? (
          <UserPostsList 
            posts={userPosts}
            userName={user.user_metadata?.name || "Usuário"}
            liked={liked}
            saved={saved}
            onLike={handleLikePost}
            onSave={handleSavePost}
            onShare={handleSharePost}
            onDelete={handleDeleteSuccess}
            onEdit={onEditPost}
            compact={true}
          />
        ) : (
          <p className="text-sm text-gray-500">
            Você ainda não publicou nada<br />
            As publicações que você compartilhar serão exibidas aqui.
          </p>
        )}
        
        {userPosts.length > 0 && (
          <div className="border-t mt-4 pt-2 text-right">
            <Button variant="link" className="text-xs text-blue-600 hover:underline p-0 h-auto">
              Exibir todas as atividades →
            </Button>
          </div>
        )}
        
        {/* Edit Post Dialog */}
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
