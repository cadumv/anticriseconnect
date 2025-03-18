
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Handshake } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface ProfileActionsProps {
  profileId: string;
  currentUser: User | null;
  isFollowing: boolean;
  followLoading: boolean;
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
}

export const ProfileActions = ({
  profileId,
  currentUser,
  isFollowing,
  followLoading,
  onFollowToggle,
  onConnectionRequest,
}: ProfileActionsProps) => {
  if (!currentUser || currentUser.id === profileId) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={isFollowing ? "outline" : "default"} 
        onClick={onFollowToggle}
        disabled={followLoading}
        className="gap-1"
      >
        {isFollowing ? (
          <>
            <UserCheck className="h-4 w-4" /> Seguindo
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" /> Seguir
          </>
        )}
      </Button>
      <Button 
        onClick={onConnectionRequest}
        className="gap-1"
        variant="secondary"
      >
        <Handshake className="h-4 w-4" /> Conexão Anticrise
      </Button>
    </div>
  );
};
