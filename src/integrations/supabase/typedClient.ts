
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Read the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a typed Supabase client
export const typedSupabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
