
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/registration/Header';

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to owner login as the default
    navigate('/owner-login');
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
      <main className="flex justify-center items-center p-10 max-sm:p-5">
        <div className="w-[400px] border bg-neutral-100 p-[30px] rounded-[20px] border-solid border-[#524F4F] text-center shadow-md">
          <div className="text-[#F00] text-[32px] font-bold mx-0 my-5 max-sm:text-2xl">
            REDIRECTING...
          </div>
          
          <div className="mt-4">
            <p className="text-gray-600">Please wait while we redirect you to the login page...</p>
          </div>
          
          <div className="mt-8 space-y-4">
            <a 
              href="/owner-login" 
              className="block w-full text-white text-base font-semibold cursor-pointer bg-[#FE623F] px-[30px] py-2.5 rounded-[10px] border-none hover:bg-[#e05735] transition-colors"
            >
              ESTABLISHMENT OWNER LOGIN
            </a>
            
            <a 
              href="/admin-login" 
              className="block w-full text-white text-base font-semibold cursor-pointer bg-[#333] px-[30px] py-2.5 rounded-[10px] border-none hover:bg-black transition-colors"
            >
              ADMIN LOGIN
            </a>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <p>
              Don't have an account?{' '}
              <a href="/" className="text-[#FE623F] hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
