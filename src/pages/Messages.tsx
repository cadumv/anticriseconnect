import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Search, ArrowLeft, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ChatDialog } from "@/components/chat-dialog/ChatDialog";
import { fetchConnectionUserIds, fetchUserProfiles } from "@/utils/connectionUtils";
import { ConnectionUser } from "@/utils/connectionUtils";

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
  const [connectedUsers, setConnectedUsers] = useState<ConnectionUser[]>([]);
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
      loadConnectedUsers();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const loadConnectedUsers = async () => {
    if (!user) return;
    
    try {
      const connectionIds = await fetchConnectionUserIds(user.id, "connections");
      
      if (connectionIds.length > 0) {
        const profiles = await fetchUserProfiles(connectionIds);
        setConnectedUsers(profiles);
      }
    } catch (error) {
      console.error("Error loading connected users:", error);
    }
  };

  const loadConversations = () => {
    setIsLoading(true);
    
    const storedConversations: Conversation[] = [];
    
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
        
        if (data) {
          data.forEach(profile => {
            const storageKey = `chat_history_${user?.id}_${profile.id}`;
            const chatHistory = localStorage.getItem(storageKey);
            
            if (chatHistory) {
              try {
                const messages = JSON.parse(chatHistory);
                if (messages.length > 0) {
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

  const filteredConnectedUsers = connectedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageDate = (timestamp: string) => {
    const msgDate = new Date(timestamp);
    const today = new Date();
    
    if (msgDate.toDateString() === today.toDateString()) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    if (msgDate.getFullYear() === today.getFullYear()) {
      return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
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
    loadConversations();
    loadConnectedUsers();
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
          ) : (
            <>
              {filteredConnectedUsers.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Conexões</h3>
                  <div className="space-y-2">
                    {filteredConnectedUsers.map(connectedUser => (
                      <div 
                        key={`user-${connectedUser.id}`}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                        onClick={() => handleOpenChat(connectedUser.id, connectedUser.name)}
                      >
                        <Avatar className="h-12 w-12 mr-3">
                          {connectedUser.avatar_url ? (
                            <img 
                              src={connectedUser.avatar_url}
                              alt={connectedUser.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-lg font-medium">
                              {connectedUser.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="font-medium truncate">{connectedUser.name}</p>
                            <UserPlus className="h-4 w-4 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {connectedUser.engineering_type || "Engenheiro"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredConversations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Conversas anteriores</h3>
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
                </div>
              )}

              {filteredConversations.length === 0 && filteredConnectedUsers.length === 0 && (
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
            </>
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
