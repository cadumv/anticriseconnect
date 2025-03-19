
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ConnectionRequestDialog } from "@/components/ConnectionRequestDialog";
import { ProfileLoadingState } from "@/components/public-profile/ProfileLoadingState";
import { ProfileErrorState } from "@/components/public-profile/ProfileErrorState";
import { Achievements } from "@/components/Achievements";
import { PublicationsList } from "@/components/public-profile/PublicationsList";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { BackToSearchButton } from "@/components/public-profile/BackToSearchButton";
import { ProfileContainer } from "@/components/public-profile/ProfileContainer";

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const {
    profile,
    publications,
    loading,
    error,
    isFollowing,
    followLoading,
    isConnectionAccepted,
    handleFollowToggle
  } = usePublicProfile(id, user);

  const handleConnectionRequest = () => {
    if (!user || !profile) return;
    setIsConnectionDialogOpen(true);
  };

  if (loading) {
    return <ProfileLoadingState />;
  }

  if (error || !profile) {
    return <ProfileErrorState error={error} />;
  }

  const handleSuccessfulFollowToggle = async () => {
    await handleFollowToggle();
    toast.success(isFollowing ? 
      `Você deixou de seguir ${profile.name}` : 
      `Você está seguindo ${profile.name}`
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-4">
        <BackToSearchButton />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <ProfileContainer 
            profile={profile}
            currentUser={user}
            isFollowing={isFollowing}
            followLoading={followLoading}
            isConnectionAccepted={isConnectionAccepted || id === "demo"}
            onFollowToggle={handleSuccessfulFollowToggle}
            onConnectionRequest={handleConnectionRequest}
          />
        </div>
      </div>

      <Achievements 
        showProfileSpecific={true} 
        profileId={profile.id} 
        isDemoProfile={id === "demo"} 
      />

      {user && profile && (
        <ConnectionRequestDialog
          isOpen={isConnectionDialogOpen}
          onClose={() => setIsConnectionDialogOpen(false)}
          targetProfileName={profile.name}
          targetProfileId={profile.id}
          currentUserId={user.id}
        />
      )}
    </div>
  );
};

export default PublicProfile;
