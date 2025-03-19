
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ConnectionRequestDialog } from "@/components/ConnectionRequestDialog";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileDetails } from "@/components/public-profile/ProfileDetails";
import { ProfileContact } from "@/components/public-profile/ProfileContact";
import { ProfileLoadingState } from "@/components/public-profile/ProfileLoadingState";
import { ProfileErrorState } from "@/components/public-profile/ProfileErrorState";
import { Achievements } from "@/components/Achievements";
import { PublicationsList } from "@/components/public-profile/PublicationsList";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { useState } from "react";

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
        <Link to="/search">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar para busca
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <ProfileHeader 
            profile={profile}
            currentUser={user}
            isFollowing={isFollowing}
            followLoading={followLoading}
            onFollowToggle={handleSuccessfulFollowToggle}
            onConnectionRequest={handleConnectionRequest}
          />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <ProfileDetails 
              description={profile.professional_description || ''}
              areasOfExpertise={profile.areas_of_expertise || []}
            />
            
            <ProfileContact 
              profileId={profile.id}
              profileName={profile.name}
              isConnectionAccepted={isConnectionAccepted || id === "demo"}
            />
          </div>
        </CardContent>
      </Card>

      <Achievements showProfileSpecific={true} profileId={profile.id} isDemoProfile={id === "demo"} />
      
      <PublicationsList publications={publications} />

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
