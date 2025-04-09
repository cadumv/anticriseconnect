
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Minimize2 } from "lucide-react";
import { ConversationList } from "./conversation/ConversationList";
import { MessageList } from "./conversation/MessageList";
import { MessageInput } from "./conversation/MessageInput";
import { ConversationHeader } from "./conversation/ConversationHeader";
import { EmptyConversation } from "./conversation/EmptyConversation";
import { useChatData } from "./hooks/useChatData";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function ChatDrawer({ isOpen, onClose, userId }: ChatDrawerProps) {
  const {
    conversations,
    messages,
    searchTerm,
    isLoading,
    activeChat,
    setSearchTerm,
    handleSelectChat,
    handleSendMessage,
    setActiveChat,
    activeConversation
  } = useChatData(userId);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh] max-h-[85vh] rounded-t-xl">
        <div className="h-full flex flex-col">
          <DrawerHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-semibold">Mensagens</DrawerTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DrawerHeader>
          
          <div className="flex flex-1 overflow-hidden">
            {/* Conversation List */}
            <div className={`w-full sm:w-1/3 border-r ${activeChat ? 'hidden sm:block' : 'block'}`}>
              <ConversationList
                conversations={conversations}
                isLoading={isLoading}
                searchTerm={searchTerm}
                activeChat={activeChat}
                onSearchChange={setSearchTerm}
                onSelectChat={handleSelectChat}
              />
            </div>
            
            {/* Chat Area */}
            <div className={`w-full sm:w-2/3 flex flex-col ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
              {activeChat ? (
                <>
                  {activeConversation && (
                    <ConversationHeader
                      recipientName={activeConversation.recipientName}
                      recipientAvatar={activeConversation.recipientAvatar}
                      onBack={() => setActiveChat(null)}
                    />
                  )}
                  
                  <MessageList 
                    messages={messages} 
                    activeConversation={activeConversation}
                  />
                  
                  <MessageInput onSendMessage={handleSendMessage} />
                </>
              ) : (
                <EmptyConversation />
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
