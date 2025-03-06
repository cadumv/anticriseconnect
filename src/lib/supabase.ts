
import { createClient } from '@supabase/supabase-js';

// These variables need to be set in your Supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please connect your Lovable project to Supabase.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
