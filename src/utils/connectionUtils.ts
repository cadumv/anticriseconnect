
import { supabase } from "@/lib/supabase";

export interface ConnectionUser {
  id: string;
  name: string;
  avatar_url: string | null;
  engineering_type: string | null;
}

/**
 * Fetches user IDs based on connection type
 */
export async function fetchConnectionUserIds(
  userId: string, 
  type: "connections" | "followers" | "following"
): Promise<string[]> {
  let userIds: string[] = [];
  
  try {
    if (type === "following") {
      // Get users the current user is following
      const followingData = localStorage.getItem(`following_${userId}`);
      if (followingData) {
        try {
          userIds = JSON.parse(followingData);
          if (!Array.isArray(userIds)) {
            userIds = [];
          }
        } catch (error) {
          console.error("Error parsing following data:", error);
          userIds = [];
        }
      }
    } else if (type === "followers") {
      // Find users who follow the current user
      const allUsers = await supabase.from('profiles').select('id').not('id', 'eq', userId);
      if (allUsers.data) {
        for (const potentialFollower of allUsers.data) {
          const followingData = localStorage.getItem(`following_${potentialFollower.id}`);
          if (followingData) {
            try {
              const followingList = JSON.parse(followingData);
              if (Array.isArray(followingList) && followingList.includes(userId)) {
                userIds.push(potentialFollower.id);
              }
            } catch (error) {
              console.error("Error parsing follower data:", error);
            }
          }
        }
      }
    } else if (type === "connections") {
      // Find mutual connections (accepted requests)
      const userConnectionKey = `connection_requests_${userId}`;
      const userRequests = localStorage.getItem(userConnectionKey);
      
      if (userRequests) {
        try {
          const parsedUserRequests = JSON.parse(userRequests);
          // Get IDs of users with accepted connection requests
          for (const request of parsedUserRequests) {
            if (request.status === 'accepted') {
              userIds.push(request.targetId);
            }
          }
        } catch (error) {
          console.error("Error parsing connection requests:", error);
        }
      }
      
      // Also check for requests made to the current user that were accepted
      const allUsers = await supabase.from('profiles').select('id').not('id', 'eq', userId);
      if (allUsers.data) {
        for (const otherUser of allUsers.data) {
          const connectionKey = `connection_requests_${otherUser.id}`;
          const existingRequests = localStorage.getItem(connectionKey);
          
          if (existingRequests) {
            try {
              const requests = JSON.parse(existingRequests);
              const acceptedRequest = requests.find((req: any) => 
                req.targetId === userId && req.status === 'accepted'
              );
              
              if (acceptedRequest && !userIds.includes(otherUser.id)) {
                userIds.push(otherUser.id);
              }
            } catch (error) {
              console.error("Error parsing connection data:", error);
            }
          }
        }
      }
    }
    
    return userIds;
  } catch (error) {
    console.error(`Error fetching ${type} user IDs:`, error);
    return [];
  }
}

/**
 * Fetches user profiles from Supabase by IDs
 */
export async function fetchUserProfiles(userIds: string[]): Promise<ConnectionUser[]> {
  if (userIds.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, engineering_type')
      .in('id', userIds);
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
}
