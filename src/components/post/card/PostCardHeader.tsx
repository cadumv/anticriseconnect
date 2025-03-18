
import React, { useEffect, useState } from "react";
import { MoreHorizontal, X, ExternalLink, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface PostCardHeaderProps {
  post: {
    id?: string;
    author?: string;
    timestamp: string;
    company?: string;
    user_id?: string;
    date?: string;
  };
  compact?: boolean;
  onDelete?: () => void;
}

export function PostCardHeader({ post, compact = false, onDelete }: PostCardHeaderProps) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{name?: string, avatar_url?: string, username?: string} | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isPostCreator = user && post.user_id === user.id;
  
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
  
  const handleDelete = async () => {
    if (!post.id || !user) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Publicação excluída",
        description: "Sua publicação foi excluída com sucesso.",
      });
      
      if (onDelete) onDelete();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Erro ao excluir publicação",
        description: "Não foi possível excluir sua publicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [post.user_id]);

  return (
    <div className={`p-4 ${compact ? 'pb-2' : 'pb-0'}`}>
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className={compact ? "h-10 w-10" : "h-12 w-12"}>
            <AvatarImage 
              src={userProfile?.avatar_url || "https://github.com/shadcn.png"} 
              alt={post.author || userProfile?.name || "User"} 
            />
            <AvatarFallback>{(userProfile?.name?.[0] || post.author?.[0] || "U").toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} leading-tight`}>{userProfile?.name || post.author}</h3>
            <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>{post.company || "Engenheiro"}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{formattedDate}</span>
              <span>•</span>
              <ExternalLink size={14} className="text-gray-500" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {isPostCreator && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className={compact ? "h-7 w-7" : "h-8 w-8"}>
                  <MoreHorizontal className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-gray-500`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="flex flex-col">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start rounded-none text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 size={16} />
                    <span>Excluir publicação</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          {!compact && !isPostCreator && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir publicação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
