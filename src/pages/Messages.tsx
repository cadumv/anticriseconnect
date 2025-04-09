
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { ChatDialog } from "@/components/chat-dialog/ChatDialog";
import { MessageSearch } from "@/components/messages/MessageSearch";
import { ConversationList } from "@/components/messages/ConversationList";
import { ConnectedUsersList } from "@/components/messages/ConnectedUsersList";
import { EmptyMessageState } from "@/components/messages/EmptyMessageState";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    conversations,
    connectedUsers,
    searchTerm,
    isLoading,
    selectedChat,
    handleOpenChat,
    handleCloseChat,
    handleSearchChange
  } = useMessages(user?.id);

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
          <MessageSearch 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center">
              <div className="animate-pulse text-muted-foreground">Carregando conversas...</div>
            </div>
          ) : (
            <>
              {/* Conversations first */}
              <ConversationList 
                conversations={conversations}
                searchTerm={searchTerm}
                onSelectChat={handleOpenChat}
              />

              {/* Connected users after conversations */}
              <ConnectedUsersList 
                users={connectedUsers}
                searchTerm={searchTerm}
                onSelectChat={handleOpenChat}
              />

              {/* Empty state when no results found */}
              {conversations.length === 0 && connectedUsers.length === 0 && (
                <EmptyMessageState searchTerm={searchTerm} />
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
