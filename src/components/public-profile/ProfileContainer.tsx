
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileDetails } from "./ProfileDetails";
import { ProfileContact } from "./ProfileContact";
import { ProfileData } from "@/types/profile";

interface ProfileContainerProps {
  profile: ProfileData;
  currentUser: any;
  isFollowing: boolean;
  followLoading: boolean;
  isConnectionAccepted: boolean;
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
}

export const ProfileContainer = ({
  profile,
  currentUser,
  isFollowing,
  followLoading,
  isConnectionAccepted,
  onFollowToggle,
  onConnectionRequest
}: ProfileContainerProps) => {
  return (
    <Card>
      <CardHeader className="pb-0">
        <ProfileHeader 
          profile={profile}
          currentUser={currentUser}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onFollowToggle={onFollowToggle}
          onConnectionRequest={onConnectionRequest}
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
            isConnectionAccepted={isConnectionAccepted}
          />
        </div>
      </CardContent>
    </Card>
  );
};
