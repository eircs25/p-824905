
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/registration/Header';
import { toast } from 'sonner';
import { createAdminAccount } from '@/integrations/supabase/client';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Create admin account if it doesn't exist
    createAdminAccount()
      .then(result => {
        if (!result.success) {
          console.error('Failed to initialize admin account:', result.error);
        } else {
          console.log('Admin account initialization check completed');
        }
      })
      .catch(error => {
        console.error('Error during admin account initialization:', error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    // Check if username and password match the predefined admin credentials
    if (username !== 'BFPadmin' || password !== 'BFPValenzuela2025') {
      toast.error('Invalid username or password');
      return;
    }
    
    setLoading(true);
    
    try {
      // Sign in with the admin email (which is created by createAdminAccount function)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'bureauoffireprotectionph@gmail.com',
        password: 'BFPValenzuela2025'
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Failed to authenticate');
      }
      
      // Fetch the profile to confirm admin status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid the JSON error
      
      if (profileError) throw profileError;
      
      if (!profileData) {
        throw new Error('Profile not found');
      }
      
      if (profileData.role !== 'admin') {
        throw new Error('User does not have admin privileges');
      }
      
      toast.success('Successfully logged in');
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
      <main className="flex justify-center items-center p-10 max-sm:p-5">
        <div className="w-[400px] border bg-neutral-100 p-[30px] rounded-[20px] border-solid border-[#524F4F] text-center shadow-md">
          <div className="text-[#F00] text-[32px] font-bold mx-0 my-5 max-sm:text-2xl">
            ADMIN LOGIN
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md -space-y-px">
              <div className="mb-5">
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full h-[45px] text-base font-medium text-gray-700 bg-white px-5 py-0 rounded-[10px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F00] focus:border-transparent"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full h-[45px] text-base font-medium text-gray-700 bg-white px-5 py-0 rounded-[10px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F00] focus:border-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white text-base font-semibold cursor-pointer bg-[#FE623F] px-[30px] py-2.5 rounded-[10px] border-none hover:bg-[#e05735] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <a href="/login" className="text-[#FE623F] hover:underline">
              Regular Login
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
