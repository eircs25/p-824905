
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  userId: string;
  tempPassword: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { userId, tempPassword }: EmailRequest = await req.json();
    
    // Get user information
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      throw new Error('User not found');
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      throw new Error('Profile not found');
    }
    
    // In a real application, you would use a service like SendGrid, AWS SES, or Resend
    // to send an actual email with the temporary password
    
    // For demonstration purposes, we're just logging the email
    console.log(`
      To: ${user.user?.email}
      Subject: Your V-Fire Inspect Account is Approved
      
      Hello ${profile.first_name} ${profile.last_name},
      
      Your account has been approved! You can now log in to the V-Fire Inspect system.
      
      Your temporary password is: ${tempPassword}
      
      Please log in at: https://your-app-url.com/login
      
      You will be prompted to change your password after your first login.
      
      Thank you,
      V-Fire Inspect Team
    `);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email would be sent in production environment" 
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
