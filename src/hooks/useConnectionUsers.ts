
import { useState, useEffect } from "react";
import { ConnectionUser, fetchConnectionUserIds, fetchUserProfiles } from "@/utils/connectionUtils";
import { ConnectionType } from "@/components/connections/ConnectionTypeIcon";

interface UseConnectionUsersProps {
  userId: string | undefined;
  type: ConnectionType;
  dialogOpen: boolean;
}

export function useConnectionUsers({ userId, type, dialogOpen }: UseConnectionUsersProps) {
  const [users, setUsers] = useState<ConnectionUser[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadUsers = async () => {
      if (!userId || !dialogOpen) return;
      
      setLoading(true);
      try {
        // Get user IDs based on connection type
        const userIds = await fetchConnectionUserIds(userId, type);
        
        // If we have user IDs, fetch their profile data
        if (userIds.length > 0) {
          const profiles = await fetchUserProfiles(userIds);
          setUsers(profiles);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [userId, type, dialogOpen]);
  
  return { users, loading };
}
