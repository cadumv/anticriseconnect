
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { UserPostsList } from "@/components/post/UserPostsList";
import { Post } from "@/types/post";

interface SavedPostsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedPosts: Post[];
  userName: string;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
}

export function SavedPostsDrawer({
  open,
  onOpenChange,
  savedPosts,
  userName,
  liked,
  saved,
  onLike,
  onSave,
  onShare
}: SavedPostsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh] overflow-y-auto">
        <DrawerHeader className="text-left">
          <DrawerTitle>Publicações Salvas</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          {savedPosts.length > 0 ? (
            <UserPostsList 
              posts={savedPosts}
              userName={userName}
              liked={liked}
              saved={saved}
              onLike={onLike}
              onSave={onSave}
              onShare={onShare}
            />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Você ainda não salvou nenhuma publicação.</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
