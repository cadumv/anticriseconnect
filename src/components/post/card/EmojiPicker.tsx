
import React from "react";
import { Button } from "@/components/ui/button";

// Common emoji categories
const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"]
  },
  {
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👋", "🤚", "🖐️", "✋", "🖖"]
  },
  {
    name: "Hearts",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘"]
  },
  {
    name: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🦄"]
  }
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 w-64 p-2 z-50">
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {EMOJI_CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-1">
            <h3 className="text-xs font-medium text-gray-500 px-2">{category.name}</h3>
            <div className="flex flex-wrap">
              {category.emojis.map((emoji) => (
                <button
                  key={emoji}
                  className="hover:bg-gray-100 rounded p-1 cursor-pointer text-xl"
                  onClick={() => {
                    onEmojiSelect(emoji);
                    onClose();
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose} 
          className="text-xs text-gray-500"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
