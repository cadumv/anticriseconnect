
import { useState, useEffect } from "react";
import { 
  ConnectionUser, 
  ConnectionType, 
  fetchConnectionUserIds, 
  fetchUserProfiles 
} from "@/utils/connections";

interface UseConnectionUsersProps {
  userId: string | undefined;
  type: ConnectionType;
  dialogOpen: boolean;
}

interface UseConnectionUsersReturn {
  users: ConnectionUser[];
  loading: boolean;
}

export const useConnectionUsers = ({ 
  userId, 
  type, 
  dialogOpen 
}: UseConnectionUsersProps): UseConnectionUsersReturn => {
  const [users, setUsers] = useState<ConnectionUser[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId) {
        console.log('No userId provided to useConnectionUsers hook');
        return;
      }
      
      if (!dialogOpen && type !== "following") {
        // Don't fetch if dialog not open (except for following which is shown on homepage)
        return;
      }
      
      setLoading(true);
      try {
        console.log(`Fetching ${type} for user ${userId}`);
        
        // First get the IDs based on connection type
        const userIds = await fetchConnectionUserIds(userId, type);
        console.log(`Got ${userIds.length} ${type} user IDs:`, userIds);
        
        // Then fetch the user profiles for those IDs
        if (userIds.length > 0) {
          const profiles = await fetchUserProfiles(userIds);
          console.log(`Fetched ${profiles.length} user profiles`);
          setUsers(profiles);
        } else {
          console.log(`No ${type} found for user ${userId}`);
          setUsers([]);
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [userId, type, dialogOpen]);
  
  return { users, loading };
};
