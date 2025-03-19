
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Engineer {
  id: string;
  name: string;
  username?: string;
  engineering_type: string;
  professional_description: string;
  avatar_url: string | null;
}

export const useSearchEngineers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Engineer[]>([]);
  const [initialUsers, setInitialUsers] = useState<Engineer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Load initial users when component mounts
  useEffect(() => {
    fetchInitialUsers();
  }, []);

  // Real-time search as user types
  useEffect(() => {
    const handleSearchDebounced = setTimeout(() => {
      if (searchTerm && searchTerm.length >= 2) {
        handleSearch();
      } else if (searchTerm.length === 0) {
        setSearchResults([]);
        setSearchPerformed(false);
      }
    }, 300);

    return () => clearTimeout(handleSearchDebounced);
  }, [searchTerm]);

  const fetchInitialUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, engineering_type, professional_description, avatar_url')
        .not('name', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      console.log('Initial users loaded:', data);
      setInitialUsers(data || []);
    } catch (error) {
      console.error("Error fetching initial users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }
    
    setIsLoading(true);
    setSearchPerformed(true);
    try {
      const cleanedSearchTerm = searchTerm.startsWith('@') 
        ? searchTerm.substring(1) 
        : searchTerm;
      
      // Build the query
      let query = supabase
        .from('profiles')
        .select('id, name, username, engineering_type, professional_description, avatar_url');
      
      // Different search based on if it's a username search (with @) or general search
      if (searchTerm.startsWith('@')) {
        query = query.ilike('username', `%${cleanedSearchTerm}%`);
      } else {
        // Use OR to search across multiple fields
        query = query.or(`name.ilike.%${searchTerm}%,engineering_type.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
      }
      
      // Only get profiles with a name (to filter out incomplete profiles)
      const { data, error } = await query.not('name', 'is', null);
      
      if (error) throw error;
      
      console.log('Search results:', data);
      setSearchResults(data || []);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which users to display
  const usersToDisplay = searchTerm.length >= 2 ? searchResults : initialUsers;

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    initialUsers,
    isLoading,
    handleSearch,
    usersToDisplay,
    searchPerformed
  };
};
