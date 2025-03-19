
import React from "react";
import { Post } from "@/types/post";
import { User } from "@supabase/supabase-js";
import { OpportunityCard } from "./OpportunityCard";

interface OpportunitiesListProps {
  opportunities: Post[];
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
  user: User | null;
}

export function OpportunitiesList({
  opportunities,
  liked,
  saved,
  onLike,
  onSave,
  onShare,
  user
}: OpportunitiesListProps) {
  return (
    <div className="space-y-4">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          liked={liked}
          saved={saved}
          onLike={onLike}
          onSave={onSave}
          onShare={onShare}
          isOwner={user?.id === opportunity.user_id}
        />
      ))}
    </div>
  );
}
