
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/registration/Header';
import { toast } from 'sonner';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in and is an admin, redirect to admin dashboard
    if (!authLoading && profile && profile.role === 'admin') {
      navigate('/admin');
    }
  }, [profile, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      await signIn(email, password);
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
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full h-[45px] text-base font-medium text-gray-700 bg-white px-5 py-0 rounded-[10px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F00] focus:border-transparent"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
