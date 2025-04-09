
import { Avatar } from "@/components/ui/avatar";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ChatHeaderProps {
  recipientName: string;
}

export function ChatHeader({ recipientName }: ChatHeaderProps) {
  return (
    <DialogHeader className="border-b p-4 flex flex-row items-center">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <div className="rounded-full bg-gray-200 h-full w-full flex items-center justify-center text-gray-700 font-semibold">
            {recipientName.charAt(0).toUpperCase()}
          </div>
        </Avatar>
        <div className="flex flex-col">
          <DialogTitle className="text-lg">{recipientName}</DialogTitle>
        </div>
      </div>
    </DialogHeader>
  );
}
