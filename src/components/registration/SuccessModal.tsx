
import React from "react";
import { useNavigate } from "react-router-dom";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBackToLogin = () => {
    onClose();
    navigate('/owner-login');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-[300px] text-center shadow-[0_4px_10px_rgba(0,0,0,0.1)] bg-white p-[30px] rounded-[10px] max-sm:w-[90%]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5945ffdfca552cbc887bd0ad39593bdd9452599"
          className="w-[50px] h-[50px] mt-0 mb-5 mx-auto"
          alt="Success"
        />
        <div className="text-base font-semibold mb-2.5">
          Thank you for registering!
        </div>
        <div className="text-xs mb-2.5">
          Your account is pending for approval.
        </div>
        <div className="text-xs mb-2.5">
          You will receive an email with your password once approved
        </div>
        <button
          onClick={handleBackToLogin}
          className="text-white text-xs font-bold cursor-pointer bg-[#FE623F] px-5 py-2 rounded-[10px] border-none"
        >
          BACK TO LOG IN
        </button>
      </div>
    </div>
  );
};
