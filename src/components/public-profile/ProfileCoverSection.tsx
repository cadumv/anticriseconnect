
import { Button } from "@/components/ui/button";
import { Edit3, FileText } from "lucide-react";
import { ProfileActionButtons } from "./ProfileActionButtons";
import { ProfileData } from "@/types/profile";
import { User } from "@supabase/supabase-js";

interface ProfileCoverSectionProps {
  profile: ProfileData;
  user: User | null;
  isFollowing: boolean;
  followLoading: boolean;
  isConnectionPending: boolean;
  postCount: number;
  onFollowToggle: () => Promise<void>;
  onConnectionRequest: () => void;
}

export const ProfileCoverSection = ({
  profile,
  user,
  isFollowing,
  followLoading,
  isConnectionPending,
  postCount,
  onFollowToggle,
  onConnectionRequest
}: ProfileCoverSectionProps) => {
  return (
    <div className="rounded-lg overflow-hidden mb-6">
      <div className="h-36 bg-gradient-to-r from-blue-50 to-indigo-100 relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
          disabled={user?.id !== profile.id}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Editar capa
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row">
            <div className="relative -top-16 mb-2 sm:-top-16 sm:mb-0 sm:mr-4">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-blue-500">
                      {profile.name[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="sm:pt-4 sm:flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div className="-mt-12 sm:mt-0">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  {profile.engineering_type && (
                    <p className="text-gray-600 mt-1">{profile.engineering_type} • {" "}
                      <button 
                        className="text-blue-600 hover:underline"
                        onClick={onConnectionRequest}
                      >
                        Informações de contato
                      </button>
                    </p>
                  )}
                </div>
                
                <div className="mt-4 sm:mt-0 flex gap-2 flex-wrap">
                  {user && user.id !== profile.id && (
                    <ProfileActionButtons
                      isFollowing={isFollowing}
                      followLoading={followLoading}
                      isConnectionPending={isConnectionPending}
                      onFollowToggle={onFollowToggle}
                      onConnectionRequest={onConnectionRequest}
                      profileId={profile.id}
                      currentUserId={user?.id}
                      onCancelConnection={onConnectionRequest}
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{postCount || 0} publicações</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

