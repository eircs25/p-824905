
import React, { useState, useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Sidebar from '@/components/admin/Sidebar';
import UserManagement from '@/components/admin/UserManagement';
import AdminHeader from '@/components/admin/AdminHeader';

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          navigate('/admin-login');
          return;
        }
        
        // Check if user is admin
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (!profileData || profileData.role !== 'admin') {
          toast.error('You do not have admin access');
          navigate('/admin-login');
          return;
        }
        
        setProfile(profileData);
      } catch (error: any) {
        console.error('Error checking admin status:', error.message);
        toast.error('Failed to verify admin status');
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/admin-login');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#FEF2E7]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          username={`${profile.first_name} ${profile.last_name}`} 
          onLogout={handleSignOut} 
        />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<UserManagement />} />
            <Route path="/users" element={<UserManagement />} />
            {/* Add more admin routes as needed */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
