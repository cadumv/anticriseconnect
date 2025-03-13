
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface CommentSectionProps {
  comments: Comment[];
  isLoading: boolean;
  onCancel: () => void;
}

export function CommentSection({ comments, isLoading, onCancel }: CommentSectionProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  
  const postComment = () => {
    if (!comment.trim() || !user) return;
    
    const newComment = {
      id: `temp-${Date.now()}`,
      text: comment,
      author: user.user_metadata?.name || "Usuário",
      timestamp: new Date().toISOString()
    };
    
    setLocalComments(prev => [newComment, ...prev]);
    setComment("");
    
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi publicado com sucesso."
    });
  };
  
  return (
    <div className="border-t p-4">
      <h4 className="font-medium mb-3">Comentários</h4>
      
      {user && (
        <div className="flex gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
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
          {localComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{comment.author[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-medium text-sm">{comment.author}</p>
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
          ))}
          
          {localComments.length === 0 && (
            <p className="text-gray-500 text-center py-2">Seja o primeiro a comentar.</p>
          )}
        </div>
      )}
    </div>
  );
}
