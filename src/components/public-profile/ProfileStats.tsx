
import { ConnectionTypeIcon, ConnectionType } from "@/components/connections/ConnectionTypeIcon";

interface ProfileStatsProps {
  connections: number;
  followers: number;
  following: number;
}

export const ProfileStats = ({ connections, followers, following }: ProfileStatsProps) => {
  return (
    <div className="flex items-center gap-4 text-sm mr-2">
      <StatItem type="connections" count={connections} />
      <StatItem type="followers" count={followers} />
      <StatItem type="following" count={following} />
    </div>
  );
};

interface StatItemProps {
  type: ConnectionType;
  count: number;
}

const StatItem = ({ type, count }: StatItemProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1">
        <ConnectionTypeIcon type={type} />
        <span className="font-bold text-base">{count}</span>
      </div>
      <span className="text-gray-700 font-medium">
        {type === "connections" ? "conexões" : 
         type === "followers" ? "seguidores" : "seguindo"}
      </span>
    </div>
  );
};
