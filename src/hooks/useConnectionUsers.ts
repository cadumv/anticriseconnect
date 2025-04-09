
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
      if (!userId || !dialogOpen) return;
      
      setLoading(true);
      try {
        // First get the IDs based on connection type
        const userIds = await fetchConnectionUserIds(userId, type);
        
        // Then fetch the user profiles for those IDs
        if (userIds.length > 0) {
          const profiles = await fetchUserProfiles(userIds);
          setUsers(profiles);
        } else {
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
