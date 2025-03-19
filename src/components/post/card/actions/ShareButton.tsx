
import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ShareOptions } from "./ShareOptions";

interface ShareButtonProps {
  postId: string;
  onShare: (postId: string) => void;
}

export function ShareButton({ postId, onShare }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <ActionButton
            onClick={() => setOpen(true)}
            icon={Share2}
            label="Compartilhar"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <ShareOptions 
          postId={postId} 
          onShare={onShare}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
