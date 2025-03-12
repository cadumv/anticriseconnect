
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, UserPlus, UserCheck, Handshake, Users, AtSign } from "lucide-react";
import { User as AuthUser } from "@supabase/supabase-js";

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
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
}

export const ProfileHeader = ({
  profile,
  currentUser,
  isFollowing,
  followLoading,
  onFollowToggle,
  onConnectionRequest,
}: ProfileHeaderProps) => {
  // Mock data for profile stats - in a real app, these would come from the database
  const connections = 12;
  const followers = 42;
  const following = 38;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={`Foto de ${profile.name}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-blue-500" />
            )}
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            {profile.username && (
              <div className="flex items-center text-gray-600 mt-1">
                <AtSign className="h-4 w-4 mr-1" />
                <span>{profile.username}</span>
              </div>
            )}
            {profile.engineering_type && (
              <Badge className="mt-2">{profile.engineering_type}</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          {/* Stats moved to be on the left side of the Follow button */}
          <div className="flex items-center gap-4 text-sm mr-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Handshake className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-base">{connections}</span>
              </div>
              <span className="text-gray-700 font-medium">conexões</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-base">{followers}</span>
              </div>
              <span className="text-gray-700 font-medium">seguidores</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <UserPlus className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-base">{following}</span>
              </div>
              <span className="text-gray-700 font-medium">seguindo</span>
            </div>
          </div>

          {currentUser && currentUser.id !== profile.id && (
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={isFollowing ? "outline" : "default"} 
                onClick={onFollowToggle}
                disabled={followLoading}
                className="gap-1"
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4" /> Seguindo
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" /> Seguir
                  </>
                )}
              </Button>
              <Button 
                onClick={onConnectionRequest}
                className="gap-1"
                variant="secondary"
              >
                <Handshake className="h-4 w-4" /> Conexão Anticrise
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
