import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Search, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ChatDialog } from "@/components/ChatDialog";

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string | null;
  lastMessage: string;
  timestamp: string;
}

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<{
    recipientId: string;
    recipientName: string;
    isOpen: boolean;
  } | null>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [user, navigate]);

  const loadConversations = () => {
    setIsLoading(true);
    
    // In a real app, this would fetch conversations from the backend
    // For this demo, we'll use localStorage to simulate conversations
    
    const storedConversations: Conversation[] = [];
    
    // Get all users from the profiles table to create sample conversations
    supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .not("id", "eq", user?.id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching profiles:", error);
          setIsLoading(false);
          return;
        }
        
        // For each profile, check if we have a chat history with them
        if (data) {
          data.forEach(profile => {
            const storageKey = `chat_history_${user?.id}_${profile.id}`;
            const chatHistory = localStorage.getItem(storageKey);
            
            if (chatHistory) {
              try {
                const messages = JSON.parse(chatHistory);
                if (messages.length > 0) {
                  // Get the last message to display in the conversation list
                  const lastMsg = messages[messages.length - 1];
                  
                  storedConversations.push({
                    id: `conv_${profile.id}`,
                    recipientId: profile.id,
                    recipientName: profile.name,
                    recipientAvatar: profile.avatar_url,
                    lastMessage: lastMsg.content.length > 30 ? 
                      `${lastMsg.content.substring(0, 30)}...` : 
                      lastMsg.content,
                    timestamp: lastMsg.timestamp
                  });
                }
              } catch (err) {
                console.error("Error parsing chat history:", err);
              }
            }
          });
          
          // Sort conversations by timestamp (newest first)
          storedConversations.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          setConversations(storedConversations);
        }
        
        setIsLoading(false);
      });
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageDate = (timestamp: string) => {
    const msgDate = new Date(timestamp);
    const today = new Date();
    
    // If message is from today, show time only
    if (msgDate.toDateString() === today.toDateString()) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If message is from this year, show month and day
    if (msgDate.getFullYear() === today.getFullYear()) {
      return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show date with year
    return msgDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleOpenChat = (recipientId: string, recipientName: string) => {
    setSelectedChat({
      recipientId,
      recipientName,
      isOpen: true
    });
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    loadConversations(); // Reload conversations to update last messages
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Mensagens</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Conversas</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversa..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center">
              <div className="animate-pulse text-muted-foreground">Carregando conversas...</div>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="space-y-2">
              {filteredConversations.map(conversation => (
                <div 
                  key={conversation.id}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => handleOpenChat(conversation.recipientId, conversation.recipientName)}
                >
                  <Avatar className="h-12 w-12 mr-3">
                    {conversation.recipientAvatar ? (
                      <img 
                        src={conversation.recipientAvatar}
                        alt={conversation.recipientName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-lg font-medium">
                        {conversation.recipientName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium truncate">{conversation.recipientName}</p>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatMessageDate(conversation.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center flex flex-col items-center gap-4">
              <MessageCircle className="h-10 w-10 text-gray-300" />
              <div className="text-muted-foreground">
                {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa iniciada"}
              </div>
              {!searchTerm && (
                <p className="text-sm text-gray-500 max-w-xs">
                  Visite os perfis dos profissionais e inicie uma conversa para conectar-se
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedChat && (
        <ChatDialog
          isOpen={selectedChat.isOpen}
          onClose={handleCloseChat}
          recipientId={selectedChat.recipientId}
          recipientName={selectedChat.recipientName}
        />
      )}
    </div>
  );
};

export default Messages;
