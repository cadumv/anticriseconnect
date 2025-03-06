
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndqaokjyeimjspxlnzjq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcWFva2p5ZWltanNweGxuempxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjkxMTEsImV4cCI6MjA1Njg0NTExMX0.ceLZD-5ZckXp7UqmLNKvnglLnP1aHTKB3hVbn2PKTZ0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
