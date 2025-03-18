
import { ConnectionsDialog } from "../ConnectionsDialog";

interface ProfileHeaderStatsProps {
  connections: number;
  followers: number;
  following: number;
}

export const ProfileHeaderStats = ({ connections, followers, following }: ProfileHeaderStatsProps) => {
  return (
    <div className="flex items-center gap-4 text-sm mt-2 sm:mt-0 mx-auto sm:mx-0">
      <ConnectionsDialog type="connections" count={connections} />
      <ConnectionsDialog type="followers" count={followers} />
      <ConnectionsDialog type="following" count={following} />
    </div>
  );
};
