
import React, { useState, useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Sidebar from '@/components/admin/Sidebar';
import UserManagement from '@/components/admin/UserManagement';
import AdminHeader from '@/components/admin/AdminHeader';

const Dashboard: React.FC = () => {
  const { profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'admin')) {
      navigate('/login');
    }
  }, [profile, loading, navigate]);

  if (loading || !profile) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-[#FEF2E7]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader username={`${profile.first_name} ${profile.last_name}`} onLogout={signOut} />
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
