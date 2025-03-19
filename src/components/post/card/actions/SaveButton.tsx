
import React from "react";
import { Bookmark } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface SaveButtonProps {
  postId: string;
  isSaved: boolean;
  onSave: (postId: string) => void;
}

export function SaveButton({ postId, isSaved, onSave }: SaveButtonProps) {
  return (
    <ActionButton
      onClick={() => onSave(postId)}
      icon={Bookmark}
      label="Salvar"
      isActive={isSaved}
      activeColor="text-blue-500"
    />
  );
}
