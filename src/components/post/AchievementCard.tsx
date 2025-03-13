
import React from "react";
import { Trophy } from "lucide-react";

interface AchievementCardProps {
  post: {
    id: string;
    content?: string;
    timestamp: string;
    type: 'achievement';
  };
  userName: string;
}

export function AchievementCard({ post, userName }: AchievementCardProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
        <Trophy className="h-5 w-5" />
      </div>
      <div>
        <div className="flex gap-2 text-sm text-gray-500 mb-1">
          <span>{userName}</span>
          <span>•</span>
          <span>{new Date(post.timestamp).toLocaleDateString('pt-BR')}</span>
        </div>
        <p className="text-gray-600">{post.content}</p>
      </div>
    </div>
  );
}
