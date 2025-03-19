
import React from "react";
import { MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface PostActionsMenuProps {
  onDelete?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
}

export function PostActionsMenu({ 
  onDelete, 
  onEdit,
  onSave 
}: PostActionsMenuProps) {
  const handleEditPost = () => {
    if (onEdit) {
      onEdit();
    } else {
      toast({
        title: "Editar publicação",
        description: "Funcionalidade de edição será implementada em breve.",
      });
    }
  };
  
  const handleSavePost = () => {
    if (onSave) {
      onSave();
    } else {
      toast({
        title: "Salvar publicação",
        description: "Funcionalidade de salvamento será implementada em breve.",
      });
    }
  };
  
  const handleDeletePost = () => {
    if (onDelete) {
      onDelete();
    } else {
      toast({
        title: "Funcionalidade não disponível",
        description: "A exclusão de publicações não está disponível neste contexto.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="p-1 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onDelete && (
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 cursor-pointer"
            onClick={handleDeletePost}
          >
            Apagar publicação
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={handleEditPost}
        >
          Editar publicação
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={handleSavePost}
        >
          Salvar publicação
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
