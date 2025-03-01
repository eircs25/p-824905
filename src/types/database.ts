
// Custom database types for the application
// This augments the read-only types from src/integrations/supabase/types.ts

export type Profile = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  role: 'admin' | 'establishment_owner' | 'fire_inspector';
  status: 'pending' | 'approved' | 'rejected';
  is_first_login: boolean;
}

export type Establishment = {
  id: string;
  name: string;
  owner_id: string;
  building_permit_no: string;
  status: 'active' | 'inactive';
  created_at: string;
  certificate_expiry?: string;
}

// Define database schema for better type checking
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id'> & { id?: string };
        Update: Partial<Profile>;
      };
      establishments: {
        Row: Establishment;
        Insert: Omit<Establishment, 'id' | 'created_at'> & { id?: string };
        Update: Partial<Establishment>;
      };
    };
  };
}
