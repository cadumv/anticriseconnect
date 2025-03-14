
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { UserPostsList } from "@/components/post/UserPostsList";
import { User } from "@supabase/supabase-js";
import { Post } from "@/types/post";
import { DrawerLoader } from "./DrawerLoader";
import { EmptyPostsState } from "./EmptyPostsState";
import { useSavedPosts } from "@/hooks/useSavedPosts";
import { useSavedPostInteractions } from "@/hooks/useSavedPostInteractions";

interface SavedPostsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  savedPosts?: Post[];
  userName?: string;
  liked?: Record<string, boolean>;
  saved?: Record<string, boolean>;
  onLike?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function SavedPostsDrawer({
  open,
  onOpenChange,
  user,
  savedPosts: propsSavedPosts,
  userName: propsUserName,
  liked: propsLiked,
  saved: propsSaved,
  onLike: propsOnLike,
  onSave: propsOnSave,
  onShare: propsOnShare
}: SavedPostsDrawerProps) {
  // Use custom hooks to manage state and interactions
  const {
    savedPosts,
    isLoading,
    liked,
    saved,
    setLiked,
    setSaved,
    fetchSavedPosts
  } = useSavedPosts(user, open, propsSavedPosts, propsLiked, propsSaved);
  
  const { handleLike, handleSave, handleShare } = useSavedPostInteractions(
    user,
    savedPosts,
    liked,
    saved,
    setLiked,
    setSaved,
    fetchSavedPosts,
    { onLike: propsOnLike, onSave: propsOnSave, onShare: propsOnShare }
  );

  // Determine which props to use (passed in or from hooks)
  const displaySavedPosts = propsSavedPosts || savedPosts;
  const displayUserName = propsUserName || (user?.user_metadata?.name || "Usuário");
  const displayLiked = propsLiked || liked;
  const displaySaved = propsSaved || saved;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh] overflow-y-auto">
        <DrawerHeader className="text-left pb-1">
          <DrawerTitle className="text-xl font-bold">Publicações Salvas</DrawerTitle>
        </DrawerHeader>
        <div className="px-3 pb-4">
          {isLoading ? (
            <DrawerLoader />
          ) : displaySavedPosts.length > 0 ? (
            <div className="space-y-2 py-1">
              <UserPostsList 
                posts={displaySavedPosts}
                userName={displayUserName}
                liked={displayLiked}
                saved={displaySaved}
                onLike={propsOnLike || handleLike}
                onSave={propsOnSave || handleSave}
                onShare={propsOnShare || handleShare}
                compact={true}
              />
            </div>
          ) : (
            <EmptyPostsState />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
