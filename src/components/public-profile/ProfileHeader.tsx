
import { User as AuthUser } from "@supabase/supabase-js";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileStats } from "./ProfileStats";
import { ProfileActions } from "./ProfileActions";
import { useProfileStats } from "@/hooks/useProfileStats";

interface ProfileData {
  id: string;
  name: string;
  username?: string;
  engineering_type: string;
  avatar_url: string | null;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  currentUser: AuthUser | null;
  isFollowing: boolean;
  followLoading: boolean;
  isConnectionPending: boolean;
  isConnectionAccepted: boolean;
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
}

export const ProfileHeader = ({
  profile,
  currentUser,
  isFollowing,
  followLoading,
  isConnectionPending,
  isConnectionAccepted,
  onFollowToggle,
  onConnectionRequest,
}: ProfileHeaderProps) => {
  // Use our custom hook to get profile stats
  const { connections, followers, following } = useProfileStats(profile.id, currentUser);
  
  console.log(`ProfileHeader rendering stats - Connections: ${connections}, Followers: ${followers}, Following: ${following}`);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <ProfileInfo 
            name={profile.name}
            username={profile.username}
            engineeringType={profile.engineering_type}
          />
        </div>

        <div className="flex flex-row items-center gap-4">
          <ProfileStats 
            connections={connections}
            followers={followers}
            following={following}
            profileId={profile.id}
          />

          <ProfileActions 
            profileId={profile.id}
            currentUser={currentUser}
            isFollowing={isFollowing}
            followLoading={followLoading}
            isConnectionPending={isConnectionPending}
            isConnectionAccepted={isConnectionAccepted}
            onFollowToggle={onFollowToggle}
            onConnectionRequest={onConnectionRequest}
          />
        </div>
      </div>
    </div>
  );
}
