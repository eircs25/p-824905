
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/registration/Header';
import { toast } from 'sonner';
import { createAdminAccount } from '@/integrations/supabase/client';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Create admin account if it doesn't exist
    createAdminAccount()
      .then(result => {
        if (!result.success) {
          console.error('Failed to initialize admin account:', result.error);
        }
      })
      .catch(error => {
        console.error('Error during admin account initialization:', error);
      });
  }, []);

  useEffect(() => {
    // If user is already logged in and is an admin, redirect to admin dashboard
    if (!authLoading && profile && profile.role === 'admin') {
      navigate('/admin');
    }
  }, [profile, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    // Check if credentials match the predefined admin credentials
    if (username !== 'BFPadmin') {
      toast.error('Invalid username');
      return;
    }
    
    setLoading(true);
    
    try {
      // Always use the admin email for the actual authentication
      await signIn('bureauoffireprotectionph@gmail.com', password);
      // The redirection to admin dashboard will happen in the useEffect above
      // after the profile is fetched
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials or you do not have admin privileges');
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
