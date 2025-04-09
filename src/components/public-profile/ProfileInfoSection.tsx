
import { Badge } from "@/components/ui/badge";
import { ProfileData } from "@/types/profile";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileInfoSectionProps {
  profile: ProfileData;
}

export const ProfileInfoSection = ({ profile }: ProfileInfoSectionProps) => {
  return (
    <div className="flex items-center gap-4">
      <ProfileAvatar 
        avatarUrl={profile.avatar_url} 
        name={profile.name}
      />
      <div className="text-left">
        <div>
          {profile.engineering_type && (
            <div className="mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              {profile.engineering_type}
            </div>
          )}
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          {profile.username && (
            <div className="flex items-center text-gray-600 mt-1">
              <span className="mr-1">@</span>
              <span>{profile.username}</span>
            </div>
          )}
        </div>
        
        {profile.professional_description && (
          <p className="mt-2 text-sm text-gray-700">{profile.professional_description}</p>
        )}
      </div>
    </div>
  );
};
