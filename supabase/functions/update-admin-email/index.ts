
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
    });
  }

  try {
    // Create a Supabase client with the service role key (admin privileges)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get users with admin role
    const { data: adminProfiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .single();

    if (profileError) {
      throw new Error(`Error finding admin profile: ${profileError.message}`);
    }

    if (!adminProfiles) {
      throw new Error("Admin profile not found");
    }

    // Update the admin user's email
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      adminProfiles.id,
      { email: "bureauoffireprotectionph@gmail.com" }
    );

    if (updateError) {
      throw new Error(`Error updating admin email: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin email updated successfully",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 400,
      }
    );
  }
});
