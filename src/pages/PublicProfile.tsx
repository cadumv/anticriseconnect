
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ConnectionRequestDialog } from "@/components/ConnectionRequestDialog";
import { ProfileLoadingState } from "@/components/public-profile/ProfileLoadingState";
import { ProfileErrorState } from "@/components/public-profile/ProfileErrorState";
import { Achievements } from "@/components/Achievements";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { BackToSearchButton } from "@/components/public-profile/BackToSearchButton";
import { useProfilePostInteractions } from "@/hooks/useProfilePostInteractions";
import { ProfileCoverSection } from "@/components/public-profile/ProfileCoverSection";
import { ProfileContentSection } from "@/components/public-profile/ProfileContentSection";
import { ProfileSidebarSection } from "@/components/public-profile/ProfileSidebarSection";

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  
  const {
    profile,
    publications,
    publicationLoading,
    userPosts,
    postsLoading,
    loading,
    error,
    isFollowing,
    followLoading,
    isConnectionAccepted,
    isConnectionPending,
    handleFollowToggle
  } = usePublicProfile(id, user);

  // For post interactions
  const { 
    liked, 
    saved, 
    handleLikePost, 
    handleSavePost, 
    handleSharePost 
  } = useProfilePostInteractions(user);

  const handleConnectionRequest = useCallback(() => {
    if (!user || !profile) return;
    setIsConnectionDialogOpen(true);
  }, [user, profile]);

  const handleSuccessfulFollowToggle = useCallback(async () => {
    await handleFollowToggle();
    if (profile) {
      toast.success(isFollowing ? 
        `Você deixou de seguir ${profile.name}` : 
        `Você está seguindo ${profile.name}`
      );
    }
  }, [handleFollowToggle, isFollowing, profile]);

  if (loading) {
    return <ProfileLoadingState />;
  }

  if (error || !profile) {
    return <ProfileErrorState error={error} />;
  }

  // Calculate total achievement points
  const totalPoints = profile?.achievements?.reduce((total, achievement) => {
    return total + (achievement.completed ? achievement.points || 0 : 0);
  }, 0) || 0;

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center mb-4">
        <BackToSearchButton />
      </div>

      <div>
        {/* Profile Cover and Info Section */}
        <ProfileCoverSection 
          profile={profile}
          user={user}
          isFollowing={isFollowing}
          followLoading={followLoading}
          postCount={profile.postCount || 0}
          onFollowToggle={handleSuccessfulFollowToggle}
          onConnectionRequest={handleConnectionRequest}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Section */}
          <div className="lg:col-span-2">
            <ProfileContentSection 
              profile={profile}
              publications={publications}
              publicationLoading={publicationLoading}
              userPosts={userPosts}
              postsLoading={postsLoading}
              isConnectionAccepted={isConnectionAccepted}
              isConnectionPending={isConnectionPending}
              onOpenConnectionDialog={() => setIsConnectionDialogOpen(true)}
              liked={liked}
              saved={saved}
              onLikePost={handleLikePost}
              onSavePost={handleSavePost}
              onSharePost={handleSharePost}
            />
          </div>
          
          {/* Sidebar Section */}
          <ProfileSidebarSection 
            achievements={profile?.achievements} 
            totalPoints={totalPoints}
          />
        </div>
      </div>

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
