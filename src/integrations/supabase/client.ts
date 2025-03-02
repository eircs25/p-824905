
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://bnjpxqmeklfuouhqzepi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuanB4cW1la2xmdW91aHF6ZXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjM2OTcsImV4cCI6MjA1NjM5OTY5N30.QODvPCiKB75aouSnltV0cnHFfBPL-lzFv5QUD5-kNLY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Function to create an admin account
export const createAdminAccount = async () => {
  try {
    // Check if admin user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .eq('status', 'approved')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking admin existence:', checkError);
      return { success: false, error: checkError };
    }

    if (existingUser) {
      console.log('Admin account already exists');
      return { success: true, message: 'Admin account already exists' };
    }

    // Create admin user
    console.log('Creating admin account...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: 'bureauoffireprotectionph@gmail.com',
      password: 'BFPValenzuela2025',
      options: {
        data: {
          role: 'admin',
          first_name: 'BFP',
          last_name: 'Admin',
        }
      }
    });

    if (signUpError) {
      console.error('Error creating admin user:', signUpError);
      return { success: false, error: signUpError };
    }

    if (authData.user) {
      // Set admin profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          status: 'approved',
          first_name: 'BFP',
          last_name: 'Admin',
          is_first_login: false
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Error setting admin profile:', profileError);
        return { success: false, error: profileError };
      }

      console.log('Admin account created successfully');
      return { success: true };
    }

    return { success: false, error: 'Failed to create admin user' };
  } catch (error) {
    console.error('Unexpected error creating admin:', error);
    return { success: false, error };
  }
};
