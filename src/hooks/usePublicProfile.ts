
import { User } from "@supabase/supabase-js";
import { ProfileData, Publication } from "@/types/profile";
import { useProfileData } from "./profile/useProfileData";
import { usePublications } from "./profile/usePublications";
import { useFollowStatus } from "./profile/useFollowStatus";
import { useConnectionStatus } from "./profile/useConnectionStatus";

interface UsePublicProfileReturn {
  profile: ProfileData | null;
  publications: Publication[];
  loading: boolean;
  error: string;
  isFollowing: boolean;
  followLoading: boolean;
  isConnectionAccepted: boolean;
  handleFollowToggle: () => Promise<void>;
}

export const usePublicProfile = (id: string | undefined, user: User | null): UsePublicProfileReturn => {
  const { profile, loading, error } = useProfileData(id, user);
  const { publications } = usePublications(id);
  const { isFollowing, followLoading, handleFollowToggle } = useFollowStatus(id, user);
  const { isConnectionAccepted } = useConnectionStatus(id, user);

  return {
    profile,
    publications,
    loading,
    error,
    isFollowing,
    followLoading,
    isConnectionAccepted,
    handleFollowToggle
  };
};
