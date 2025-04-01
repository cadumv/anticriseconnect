
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConversationHeaderProps {
  recipientName: string;
  recipientAvatar: string | null;
  onBack: () => void;
}

export function ConversationHeader({ recipientName, recipientAvatar, onBack }: ConversationHeaderProps) {
  return (
    <div className="p-3 border-b flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="sm:hidden mr-2" onClick={onBack}>
          <X className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8 mr-2">
          {recipientAvatar ? (
            <img 
              src={recipientAvatar}
              alt={recipientName}
              className="h-full w-full object-contain" // Changed from object-cover to object-contain
              style={{ objectFit: "contain" }}
            />
          ) : (
            <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-sm font-medium">
              {recipientName.charAt(0).toUpperCase()}
            </div>
          )}
        </Avatar>
        <span className="font-medium">{recipientName}</span>
      </div>
    </div>
  );
}
