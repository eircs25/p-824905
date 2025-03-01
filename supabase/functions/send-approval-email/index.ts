
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  userId: string;
  action: "approve" | "reject";
  tempPassword?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { userId, action, tempPassword } = await req.json() as EmailRequest;

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user details
    const { data: userData, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("first_name, last_name, is_first_login")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // Get user email
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (authError) throw authError;

    const userEmail = authUser.user?.email;
    if (!userEmail) throw new Error("User email not found");

    // In a real implementation, we would send an actual email here
    // For this example, we'll just log it
    console.log(`Sending ${action} email to ${userEmail}`);

    let emailSubject, emailBody;

    if (action === "approve") {
      emailSubject = "Your Account Has Been Approved";
      emailBody = `
        Dear ${userData.first_name} ${userData.last_name},

        Your account has been approved by the administrator. 
        You can now log in using your email and the temporary password below:

        Temporary Password: ${tempPassword}

        Please visit the establishment owner login page at:
        ${req.headers.get("origin") || "https://yourapp.com"}/owner-login

        You will be prompted to change your password upon first login.

        Thank you,
        V-FIRE INSPECT Team
      `;
    } else {
      emailSubject = "Your Account Has Been Rejected";
      emailBody = `
        Dear ${userData.first_name} ${userData.last_name},

        We regret to inform you that your account application has been rejected by the administrator.
        
        If you have any questions or would like to reapply, please contact our support team.

        Thank you,
        V-FIRE INSPECT Team
      `;
    }

    // In a real application, you would integrate with an email service like Resend, SendGrid, etc.
    // For now, we'll just return success with the email content for demonstration
    return new Response(
      JSON.stringify({
        success: true,
        email: userEmail,
        subject: emailSubject,
        body: emailBody
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
