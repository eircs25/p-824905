
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/registration/Header';

const PendingApproval: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/owner-login');
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
      <main className="flex justify-center items-center p-10 max-sm:p-5">
        <div className="w-[500px] border bg-neutral-100 p-[30px] rounded-[20px] border-solid border-[#524F4F] text-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5945ffdfca552cbc887bd0ad39593bdd9452599"
            className="w-[70px] h-[70px] mt-0 mb-5 mx-auto"
            alt="Pending"
          />
          
          <div className="text-[#F00] text-[32px] font-bold mx-0 my-5 max-sm:text-2xl">
            ACCOUNT PENDING
          </div>
          
          <p className="text-lg mb-6">
            Your account is pending approval by an administrator.
          </p>
          
          <p className="mb-10">
            You will receive an email with login instructions once your account has been approved.
          </p>
          
          <button
            onClick={handleSignOut}
            className="text-white text-base font-semibold cursor-pointer bg-[#FE623F] px-[30px] py-2.5 rounded-[10px] border-none"
          >
            BACK TO LOGIN
          </button>
        </div>
      </main>
    </div>
  );
};

export default PendingApproval;
