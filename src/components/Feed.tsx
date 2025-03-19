
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { NewPostDialog } from "./NewPostDialog";
import { UserPostsList } from "./post/UserPostsList";
import { DefaultPostsList } from "./post/DefaultPostsList";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { ShareDialog } from "./ShareDialog";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { SavedPostsDrawer } from "./feed/SavedPostsDrawer";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";

export const Feed = () => {
  const { user } = useAuth();
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string>("");
  
  const {
    userPosts,
    savedPosts,
    liked,
    saved,
    isLoading,
    setLiked,
    setSaved,
    fetchPosts,
    fetchSavedPosts
  } = useFeedPosts(user);

  const {
    handleLike,
    handleSave,
    handleShare,
    handleDelete,
    completeShareAction
  } = usePostInteractions(
    user,
    userPosts,
    liked,
    saved,
    setLiked,
    setSaved,
    fetchSavedPosts
  );
  
  const onShare = (postId: string) => {
    setCurrentPostId(postId);
    setShareDialogOpen(true);
  };

  const onShareComplete = (userIds: string[]) => {
    completeShareAction(currentPostId, userIds);
  };
  
  const onDeletePost = async (postId: string) => {
    const success = await handleDelete(postId);
    if (success) {
      // After successful deletion, refresh the feed
      fetchPosts();
    }
    return success;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Feed de publicações</CardTitle>
          <div className="flex items-center gap-2">
            {user && savedPosts.length > 0 && (
              <Drawer open={showSavedDrawer} onOpenChange={setShowSavedDrawer}>
                <DrawerTrigger asChild onClick={() => setShowSavedDrawer(true)}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Bookmark size={16} />
                    <span>Salvos ({savedPosts.length})</span>
                  </Button>
                </DrawerTrigger>
              </Drawer>
            )}
            {user && <NewPostDialog onPostCreated={fetchPosts} />}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <UserPostsList 
                posts={userPosts}
                userName={user?.user_metadata?.name || "Usuário"}
                liked={liked}
                saved={saved}
                onLike={handleLike}
                onSave={handleSave}
                onShare={onShare}
                onDelete={onDeletePost}
              />
              
              {userPosts.length === 0 && (
                <DefaultPostsList 
                  posts={[]} 
                  isLoggedIn={!!user}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Saved Posts Drawer */}
      {user && (
        <SavedPostsDrawer
          open={showSavedDrawer}
          onOpenChange={setShowSavedDrawer}
          user={user}
          savedPosts={savedPosts}
          userName={user?.user_metadata?.name || "Usuário"}
          liked={liked}
          saved={saved}
          onLike={handleLike}
          onSave={handleSave}
          onShare={onShare}
        />
      )}
      
      {/* Share Dialog */}
      {shareDialogOpen && (
        <ShareDialog 
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          onShare={onShareComplete}
          postId={currentPostId}
        />
      )}
    </>
  );
};
