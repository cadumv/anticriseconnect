
import { supabase } from "@/lib/supabase";

/**
 * Get users the current user is following
 */
export function getFollowing(userId: string): string[] {
  try {
    if (!userId) {
      console.log('No userId provided to getFollowing');
      return [];
    }
    
    const followingData = localStorage.getItem(`following_${userId}`);
    if (followingData) {
      try {
        const userIds = JSON.parse(followingData);
        if (!Array.isArray(userIds)) {
          console.log('Following data is not an array:', userIds);
          return [];
        }
        return userIds.filter(id => typeof id === 'string');
      } catch (error) {
        console.error("Error parsing following data:", error);
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error("Error getting following data:", error);
    return [];
  }
}

/**
 * Find users who follow the current user
 */
export async function getFollowers(userId: string): Promise<string[]> {
  try {
    if (!userId) {
      console.log('No userId provided to getFollowers');
      return [];
    }
    
    const userIds: string[] = [];
    
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
    
    return userIds;
  } catch (error) {
    console.error("Error getting followers:", error);
    return [];
  }
}
