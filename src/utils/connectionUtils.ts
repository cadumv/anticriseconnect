
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
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('id')
        .not('id', 'eq', userId);
      
      if (error) {
        console.error("Error fetching potential followers:", error);
        return [];
      }
      
      if (allUsers) {
        for (const potentialFollower of allUsers) {
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
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('id')
        .not('id', 'eq', userId);
      
      if (error) {
        console.error("Error fetching potential connections:", error);
        return userIds;
      }
      
      if (allUsers) {
        for (const otherUser of allUsers) {
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
    
    console.log(`Fetched ${type} user IDs:`, userIds);
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
    
    console.log('Fetched user profiles:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
}

/**
 * Saves a connection request
 */
export function saveConnectionRequest(
  senderId: string, 
  targetId: string, 
  message: string, 
  senderName: string
): boolean {
  try {
    // Save this connection request to localStorage
    const connectionKey = `connection_requests_${senderId}`;
    const existingRequests = localStorage.getItem(connectionKey);
    const requests = existingRequests ? JSON.parse(existingRequests) : [];
    
    // Check if request already exists
    const existingRequest = requests.find((req: any) => req.targetId === targetId);
    if (existingRequest) {
      return false;
    }
    
    const newRequest = {
      targetId,
      message,
      timestamp: new Date().toISOString(),
      status: 'pending',
      senderName
    };
    
    // Add to the requests array
    requests.push(newRequest);
    
    // Update localStorage
    localStorage.setItem(connectionKey, JSON.stringify(requests));
    return true;
  } catch (error) {
    console.error('Error saving connection request:', error);
    return false;
  }
}

/**
 * Updates a connection request status
 */
export function updateConnectionStatus(
  senderId: string, 
  targetId: string, 
  status: 'accepted' | 'declined'
): boolean {
  try {
    const connectionKey = `connection_requests_${senderId}`;
    const existingRequests = localStorage.getItem(connectionKey);
    
    if (!existingRequests) return false;
    
    const requests = JSON.parse(existingRequests);
    const updatedRequests = requests.map((req: any) => {
      if (req.targetId === targetId) {
        return { ...req, status };
      }
      return req;
    });
    
    localStorage.setItem(connectionKey, JSON.stringify(updatedRequests));
    return true;
  } catch (error) {
    console.error('Error updating connection status:', error);
    return false;
  }
}
