
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://bnjpxqmeklfuouhqzepi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuanB4cW1la2xmdW91aHF6ZXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjM2OTcsImV4cCI6MjA1NjM5OTY5N30.QODvPCiKB75aouSnltV0cnHFfBPL-lzFv5QUD5-kNLY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
