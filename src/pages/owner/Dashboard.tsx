
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Establishment } from '@/types/database';
import { toast } from 'sonner';

const OwnerDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstablishments = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('establishments')
          .select('*')
          .eq('owner_id', user.id);
        
        if (error) throw error;
        
        setEstablishments(data || []);
      } catch (error: any) {
        console.error('Error fetching establishments:', error.message);
        toast.error('Failed to load establishments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEstablishments();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {profile?.first_name} {profile?.last_name}!
      </h1>
      <p>Your User ID: {user?.id}</p>
      <p>Your Email: {user?.email}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Establishments:</h2>
      {establishments.length > 0 ? (
        <ul>
          {establishments.map((establishment) => (
            <li key={establishment.id} className="mb-2">
              {establishment.name} - Building Permit: {establishment.building_permit_no}
            </li>
          ))}
        </ul>
      ) : (
        <p>No establishments found.</p>
      )}

      <button
        onClick={() => signOut()}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Sign Out
      </button>
    </div>
  );
};

export default OwnerDashboard;
