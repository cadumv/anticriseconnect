
import { ConnectionType } from "./types";
import { getFollowing, getFollowers } from "./followerUtils";
import { getAcceptedConnections } from "./connectionRequestUtils";

/**
 * Fetches user IDs based on connection type
 */
export async function fetchConnectionUserIds(
  userId: string, 
  type: ConnectionType
): Promise<string[]> {
  try {
    console.log(`Fetching ${type} for user ${userId}`);
    
    switch (type) {
      case "following":
        return getFollowing(userId);
      case "followers":
        return await getFollowers(userId);
      case "connections":
        return await getAcceptedConnections(userId);
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching ${type} user IDs:`, error);
    return [];
  }
}
