// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ndqaokjyeimjspxlnzjq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcWFva2p5ZWltanNweGxuempxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjkxMTEsImV4cCI6MjA1Njg0NTExMX0.ceLZD-5ZckXp7UqmLNKvnglLnP1aHTKB3hVbn2PKTZ0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);