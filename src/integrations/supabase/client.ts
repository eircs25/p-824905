
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://bnjpxqmeklfuouhqzepi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuanB4cW1la2xmdW91aHF6ZXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjM2OTcsImV4cCI6MjA1NjM5OTY5N30.QODvPCiKB75aouSnltV0cnHFfBPL-lzFv5QUD5-kNLY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Function to create an admin account
export const createAdminAccount = async () => {
  try {
    // Check if admin user exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .eq('status', 'approved');

    if (checkError) {
      console.error('Error checking admin existence:', checkError);
      return { success: false, error: checkError };
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('Admin account already exists');
      return { success: true, message: 'Admin account already exists' };
    }

    // Look for existing user with the admin email
    const { data: existingAuth, error: existingAuthError } = await supabase.auth
      .admin.listUsers();

    // Filter users manually to find the admin email
    const existingUser = existingAuth?.users?.find(
      user => user.email === 'bureauoffireprotectionph@gmail.com'
    );

    if (existingAuthError) {
      console.error('Error checking existing admin auth:', existingAuthError);
      return { success: false, error: existingAuthError };
    }

    // If user exists in auth but not in profiles table with admin role
    if (existingUser) {
      // Update the existing user's profile
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .upsert({
          id: existingUser.id,
          role: 'admin',
          status: 'approved',
          first_name: 'BFP',
          last_name: 'Admin',
          is_first_login: false
        });

      if (profileUpdateError) {
        console.error('Error updating existing user to admin:', profileUpdateError);
        return { success: false, error: profileUpdateError };
      }

      console.log('Existing user updated to admin successfully');
      return { success: true };
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
        .upsert({
          id: authData.user.id,
          role: 'admin',
          status: 'approved',
          first_name: 'BFP',
          last_name: 'Admin',
          is_first_login: false
        });

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
