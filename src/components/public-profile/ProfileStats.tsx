
import { useState } from "react";
import { ConnectionTypeIcon, ConnectionType } from "@/components/connections/ConnectionTypeIcon";
import { FollowingDialog } from "@/components/FollowingDialog";
import { ConnectionsDialog } from "@/components/ConnectionsDialog";

interface ProfileStatsProps {
  connections: number;
  followers: number;
  following: number;
  profileId?: string;
}

export const ProfileStats = ({ connections, followers, following, profileId }: ProfileStatsProps) => {
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
  
  return (
    <div className="flex items-center gap-4 text-sm mr-2">
      <ConnectionsDialog type="connections" count={connections} />
      <ConnectionsDialog type="followers" count={followers} />
      
      <div 
        onClick={() => setFollowingDialogOpen(true)}
        className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-1">
          <ConnectionTypeIcon type="following" />
          <span className="font-bold text-base">{following}</span>
        </div>
        <span className="text-gray-700 font-medium">seguindo</span>
      </div>
      
      {followingDialogOpen && (
        <FollowingDialog 
          isOpen={followingDialogOpen} 
          onClose={() => setFollowingDialogOpen(false)}
          userId={profileId}
        />
      )}
    </div>
  );
};
