
import { supabase } from "@/lib/supabase";
import { ConnectionRequest } from "./types";

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
    
    const newRequest: ConnectionRequest = {
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

/**
 * Gets all accepted connection requests for a user
 */
export async function getAcceptedConnections(userId: string): Promise<string[]> {
  try {
    const userIds: string[] = [];
    
    // Find the user's outgoing accepted connections
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
    
    return userIds;
  } catch (error) {
    console.error("Error getting accepted connections:", error);
    return [];
  }
}
