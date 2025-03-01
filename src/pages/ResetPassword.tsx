
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/registration/Header';
import { FormInput } from '@/components/registration/FormInput';
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in a first login scenario or via reset token
    if (!profile && !window.location.hash.includes('type=recovery')) {
      navigate('/login');
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      await updatePassword(password);
      // Navigation is handled in the auth context
    } catch (error) {
      // Error is handled in auth context
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
      <main className="flex justify-center items-center p-10 max-sm:p-5">
        <form 
          onSubmit={handleSubmit}
          className="w-[500px] border bg-neutral-100 p-[30px] rounded-[20px] border-solid border-[#524F4F]"
        >
          <div className="text-[#F00] text-[32px] font-bold text-center mx-0 my-10 max-sm:text-2xl">
            {profile?.is_first_login ? 'SET NEW PASSWORD' : 'RESET PASSWORD'}
          </div>

          <p className="text-center mb-6">
            {profile?.is_first_login 
              ? 'Please set a new password for your account.' 
              : 'Enter your new password below.'}
          </p>
          
          <FormInput
            label="New Password"
            required
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormInput
            label="Confirm Password"
            required
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="text-white text-base font-semibold cursor-pointer bg-[#FE623F] px-[30px] py-2.5 rounded-[10px] border-none w-full"
            >
              {loading ? 'Updating...' : 'UPDATE PASSWORD'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ResetPassword;
