
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Engineer {
  id: string;
  name: string;
  engineering_type: string;
  avatar_url?: string | null;
}

interface Category {
  name: string;
  count: number;
}

export const useDiscoveryData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredEngineers, setFeaturedEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCategories();
    fetchFeaturedEngineers();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('engineering_type')
        .not('engineering_type', 'is', null);

      if (error) throw error;

      // Count occurrences of each engineering type
      const counts: { [key: string]: number } = {};
      data.forEach(profile => {
        if (profile.engineering_type) {
          counts[profile.engineering_type] = (counts[profile.engineering_type] || 0) + 1;
        }
      });

      // Convert to array and sort by count
      const categoriesArray = Object.entries(counts).map(([name, count]) => ({
        name,
        count
      }));

      console.log('Categories fetched:', categoriesArray);
      setCategories(categoriesArray.sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedEngineers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, engineering_type, avatar_url')
        .not('name', 'is', null)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      console.log('Featured engineers fetched:', data);
      setFeaturedEngineers(data || []);
    } catch (error) {
      console.error('Error fetching featured engineers:', error);
      setFeaturedEngineers([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    featuredEngineers,
    loading
  };
};
