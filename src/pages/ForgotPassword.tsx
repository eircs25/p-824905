
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/registration/Header';
import { FormInput } from '@/components/registration/FormInput';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (error) {
      // Error is handled in auth context
    } finally {
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
            FORGOT PASSWORD
          </div>

          {submitted ? (
            <div className="text-center p-5">
              <div className="text-xl font-semibold mb-4">Email Sent!</div>
              <p className="mb-6">Please check your email for a password reset link.</p>
              <Link 
                to="/login" 
                className="text-white text-base font-semibold cursor-pointer bg-[#FE623F] px-[30px] py-2.5 rounded-[10px] border-none"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-center mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <FormInput
                label="Email"
                required
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="flex flex-col items-center gap-4 mt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-white text-base font-semibold cursor-pointer bg-[#FE623F] px-[30px] py-2.5 rounded-[10px] border-none w-full"
                >
                  {loading ? 'Sending...' : 'SEND RESET LINK'}
                </button>
                
                <div className="text-base">
                  <Link to="/login" className="underline">
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
