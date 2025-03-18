
import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { MentionInput } from "./MentionInput";
import { useCommentContext } from "./CommentContext";
import { SmilePlus, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EmojiPicker } from "./EmojiPicker";

export function CommentForm() {
  const { user } = useAuth();
  const { replyTo, authorProfiles, setReplyTo, mentionUsers, postComment } = useCommentContext();
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  if (!user) {
    return null;
  }

  const handlePostComment = () => {
    if (!comment.trim() && !imagePreview) return;
    
    // Include the image markup in the comment if we have a preview
    let finalComment = comment;
    if (imagePreview) {
      finalComment += `\n<img src="${imagePreview}" alt="Uploaded image" class="comment-image" />`;
    }
    
    postComment(finalComment, replyTo?.id || null);
    setComment("");
    setImagePreview(null);
    setReplyTo(null);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setComment("");
    setImagePreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && (comment.trim() || imagePreview)) {
      e.preventDefault();
      handlePostComment();
    }
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji: string) => {
    setComment(prev => prev + emoji);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione um arquivo de imagem");
      return;
    }

    try {
      setIsUploading(true);
      // In a real implementation, you would upload the image to a server
      // and get back a URL to insert into the comment
      
      // Create an object URL for the image preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      
      toast.success(`Imagem "${file.name}" anexada ao comentário`);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao carregar a imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Close emoji picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiButtonRef.current && 
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        const emojiPickerElement = document.querySelector('[data-emoji-picker]');
        if (emojiPickerElement && !emojiPickerElement.contains(event.target as Node)) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="flex gap-2 w-full">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage 
          src={user.user_metadata?.avatar_url} 
          alt={user.user_metadata?.name || "Usuário"}
        />
        <AvatarFallback>{(user.user_metadata?.name?.[0] || "U").toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 w-full">
        {replyTo && (
          <div className="bg-gray-100 p-2 mb-2 rounded-md flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Respondendo a <span className="font-medium">{
                replyTo.authorId && authorProfiles[replyTo.authorId] 
                  ? authorProfiles[replyTo.authorId].name 
                  : replyTo.author
              }</span>
            </span>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={handleCancelReply}
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="w-full rounded-md border border-gray-300 bg-white hover:border-gray-400 focus-within:border-gray-500 transition-colors">
          <div className="w-full">
            <MentionInput
              users={mentionUsers}
              value={comment}
              onChange={setComment}
              onKeyDown={handleKeyDown}
              placeholder={replyTo ? "Escreva uma resposta..." : "Adicionar comentário..."}
              className="w-full rounded-t-md px-3 py-2 bg-transparent border-none focus:ring-0 min-h-[38px] text-sm resize-none"
              ref={commentInputRef}
            />
            
            {imagePreview && (
              <div className="px-3 py-2 border-t border-gray-200">
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-60 max-w-full rounded-md object-contain" 
                  />
                  <button 
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70"
                    onClick={() => setImagePreview(null)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center border-t border-gray-200 px-2 py-1">
              <div className="flex gap-1 relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                  onClick={handleEmojiClick}
                  ref={emojiButtonRef}
                  aria-label="Inserir emoji"
                >
                  <SmilePlus size={18} />
                </Button>
                
                {showEmojiPicker && (
                  <div data-emoji-picker>
                    <EmojiPicker 
                      onEmojiSelect={handleEmojiSelect} 
                      onClose={() => setShowEmojiPicker(false)} 
                    />
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                  onClick={handleImageClick}
                  disabled={isUploading}
                  aria-label="Anexar imagem"
                >
                  <Image size={18} />
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 h-8"
                disabled={(!comment.trim() && !imagePreview) || isUploading}
                onClick={handlePostComment}
              >
                {isUploading ? "Carregando..." : "Publicar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
