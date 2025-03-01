import React, { useState } from "react";
import { FormInput } from "./FormInput";
import { EstablishmentField } from "./EstablishmentField";
import { SuccessModal } from "./SuccessModal";

export const RegistrationForm: React.FC = () => {
  const [establishments, setEstablishments] = useState([0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const addEstablishment = () => {
    setEstablishments([...establishments, establishments.length]);
  };

  const removeEstablishment = (index: number) => {
    setEstablishments(establishments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-[605px] border bg-neutral-100 p-[30px] rounded-[20px] border-solid border-[#524F4F] max-md:w-full"
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ee06004c0875245644f1df0278e61e66cf96a47"
        className="absolute w-[88px] h-[131px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] right-5 -top-5"
        alt="Form Logo"
      />
      <div className="text-[#F00] text-[40px] font-bold text-center mx-0 my-10 max-sm:text-3xl">
        REGISTER ACCOUNT
      </div>

      <FormInput
        label="First Name"
        required
        placeholder="Enter First Name"
        icon={
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e12781821eeb5ac2a6a0c7a97069bf812d6d0fd"
            alt="Check"
            className="w-8 h-8"
          />
        }
      />

      <FormInput label="Middle Name" placeholder="Enter Middle Name" />

      <FormInput label="Last Name" required placeholder="Enter Last Name" />

      <FormInput
        label="Email"
        required
        type="email"
        placeholder="Enter Email"
      />

      <div className="h-px bg-black mx-0 my-[30px]" />

      {establishments.map((_, index) => (
        <div key={index} className="mb-5">
          <EstablishmentField
            index={index}
            onRemove={() => removeEstablishment(index)}
          />
        </div>
      ))}

      <div
        className="flex items-center gap-2.5 cursor-pointer mt-5"
        onClick={addEstablishment}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f645d48c08dc5e23210ab15f31fe2bb83aa9fd9f"
          className="w-[30px] h-[30px]"
          alt="Add"
        />
        <span>Add Another Establishment</span>
      </div>

      <div className="text-center text-sm font-semibold mx-0 my-5">
        <span>By continuing, you agree to V-Fire Inspect </span>
        <a href="#" className="text-[#88B7B9] underline">
          Terms and Conditions
        </a>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-base italic">
          <span>Already have an Account? </span>
          <a href="#" className="underline">
            Log in
          </a>
        </div>
        <button
          type="submit"
          className="text-white text-base font-semibold cursor-pointer bg-[#FE623F] px-[30px] py-2.5 rounded-[10px] border-none"
        >
          SIGN UP
        </button>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </form>
  );
};
