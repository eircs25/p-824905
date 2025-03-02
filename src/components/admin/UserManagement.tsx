import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const UserManagement: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch pending users
      const { data: pendingUsers, error: pendingError } = await supabase
        .from('profiles')
        .select('*, establishments(*)')
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      
      // Fetch approved users
      const { data: approvedUsers, error: approvedError } = await supabase
        .from('profiles')
        .select('*, establishments(*)')
        .eq('status', 'approved')
        .eq('role', 'establishment_owner');
      
      if (approvedError) throw approvedError;
      
      // Get the count of establishments for each owner
      const { data: establishmentCounts, error: countsError } = await supabase
        .from('establishments')
        .select('owner_id, count(*)')
        .groupBy('owner_id');
      
      if (countsError) throw countsError;
      
      // Create a map of owner_id to establishment count
      const countsMap = (establishmentCounts || []).reduce((acc, item) => {
        // Safely access properties with type checking
        if (item && typeof item === 'object' && 'owner_id' in item && 'count' in item) {
          acc[item.owner_id as string] = item.count as number;
        }
        return acc;
      }, {} as Record<string, number>);
      
      // Process and set state
      setPendingUsers(pendingUsers || []);
      setApprovedUsers(approvedUsers?.map(user => ({
        ...user,
        establishmentCount: countsMap[user.id] || 0
      })) || []);
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Pending Users</h2>
      <ul>
        {pendingUsers.map(user => (
          <li key={user.id}>{user.first_name} {user.last_name}</li>
        ))}
      </ul>
      <h2>Approved Users</h2>
      <ul>
        {approvedUsers.map(user => (
          <li key={user.id}>
            {user.first_name} {user.last_name} - Establishments: {user.establishmentCount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
