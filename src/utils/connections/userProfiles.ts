
import { supabase } from "@/lib/supabase";
import { ConnectionUser } from "./types";

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
