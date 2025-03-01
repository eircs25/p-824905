
import { supabase } from '@/integrations/supabase/client';

export const updateAdminEmail = async () => {
  try {
    // Call the Edge Function to update the admin email
    const { data, error } = await supabase.functions.invoke('update-admin-email');
    
    if (error) {
      console.error('Error updating admin email:', error);
      return { success: false, error };
    }
    
    console.log('Admin email updated successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error updating admin email:', error);
    return { success: false, error };
  }
};

// Execute the function when this script is run
updateAdminEmail();
