
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/registration/Header';
import { FormInput } from '@/components/registration/FormInput';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
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
          <div className="text-[#F00] text-[40px] font-bold text-center mx-0 my-10 max-sm:text-3xl">
            LOG IN
          </div>

          <FormInput
            label="Email"
            required
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            label="Password"
            required
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-right mb-5">
            <Link to="/forgot-password" className="text-[#88B7B9] underline">
              Forgot Password?
            </Link>
          </div>

          <div className="flex flex-col items-center gap-4 mt-10">
            <button
              type="submit"
              disabled={loading}
              className="text-white text-base font-semibold cursor-pointer bg-[#FE623F] px-[30px] py-2.5 rounded-[10px] border-none w-full"
            >
              {loading ? 'Logging in...' : 'LOG IN'}
            </button>
            
            <div className="text-base">
              <span>Don't have an Account? </span>
              <Link to="/" className="underline">
                Register
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
