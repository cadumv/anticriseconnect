
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileDetails } from "./ProfileDetails";
import { ProfileContact } from "./ProfileContact";
import { ProfileEducation } from "./ProfileEducation";
import { ProfileExperience } from "./ProfileExperience";
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
    <div className="space-y-6">
      <Card className="shadow-sm">
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
          <ProfileDetails 
            description={profile.professional_description || ''}
            areasOfExpertise={profile.areas_of_expertise || []}
          />
        </CardContent>
      </Card>
      
      {/* Education Section */}
      {profile.education && profile.education.length > 0 && (
        <ProfileEducation education={profile.education} />
      )}
      
      {/* Experience Section */}
      {profile.experiences && profile.experiences.length > 0 && (
        <ProfileExperience experience={profile.experiences} />
      )}
      
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <ProfileContact 
            profileId={profile.id}
            profileName={profile.name}
            isConnectionAccepted={isConnectionAccepted}
          />
        </CardContent>
      </Card>
    </div>
  );
};
