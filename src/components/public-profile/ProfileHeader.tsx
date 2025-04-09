
import { User as AuthUser } from "@supabase/supabase-js";
import { ProfileAvatar } from "./ProfileAvatar";
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
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
}

export const ProfileHeader = ({
  profile,
  currentUser,
  isFollowing,
  followLoading,
  isConnectionPending,
  onFollowToggle,
  onConnectionRequest,
}: ProfileHeaderProps) => {
  // Use our custom hook to get profile stats
  const { connections, followers, following } = useProfileStats(profile.id, currentUser);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProfileAvatar 
            avatarUrl={profile.avatar_url} 
            name={profile.name} 
          />
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
          />

          <ProfileActions 
            profileId={profile.id}
            currentUser={currentUser}
            isFollowing={isFollowing}
            followLoading={followLoading}
            isConnectionPending={isConnectionPending}
            onFollowToggle={onFollowToggle}
            onConnectionRequest={onConnectionRequest}
          />
        </div>
      </div>
    </div>
  );
};
