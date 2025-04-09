
import { supabase } from "@/lib/supabase";
import { ConnectionUser } from "./types";

/**
 * Fetches user profiles from Supabase by IDs
 */
export async function fetchUserProfiles(userIds: string[]): Promise<ConnectionUser[]> {
  if (userIds.length === 0) return [];
  
  try {
    // Ensure we only have string IDs and filter out any non-string values
    const validUserIds = userIds.filter(id => typeof id === 'string');
    
    if (validUserIds.length === 0) {
      console.log('No valid user IDs provided to fetchUserProfiles');
      return [];
    }
    
    console.log('Fetching profiles for user IDs:', validUserIds);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, engineering_type')
      .in('id', validUserIds);
    
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
