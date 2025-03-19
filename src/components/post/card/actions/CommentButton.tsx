
import React from "react";
import { MessageSquare } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface CommentButtonProps {
  onComment: () => void;
}

export function CommentButton({ onComment }: CommentButtonProps) {
  return (
    <ActionButton
      onClick={onComment}
      icon={MessageSquare}
      label="Comentar"
    />
  );
}
