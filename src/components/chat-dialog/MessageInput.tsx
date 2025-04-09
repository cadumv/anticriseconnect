
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { containsEmailOrPhone } from "./utils";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Check for email or phone number in the message
    if (containsEmailOrPhone(message)) {
      toast.error("Não é permitido enviar emails ou números de telefone nas mensagens. Esta funcionalidade está disponível apenas no plano premium.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      onSendMessage(message);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-end gap-2">
        <Textarea
          className="min-h-[60px] resize-none"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          type="submit" 
          size="icon" 
          onClick={handleSendMessage}
          disabled={isSubmitting || !message.trim()}
          className="flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-1 text-center">
        O envio de emails e números de telefone não é permitido.
        <br/>
        Disponível no plano premium.
      </p>
    </div>
  );
}
