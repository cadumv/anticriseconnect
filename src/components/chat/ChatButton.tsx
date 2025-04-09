
import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChatDrawer } from "./ChatDrawer";

export const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          {isChatOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageSquare className="h-5 w-5" />
          )}
        </Button>
      </div>

      <ChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        userId={user.id} 
      />
    </>
  );
};
