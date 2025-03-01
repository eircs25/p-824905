
import React, { useState } from "react";
import { FormInput } from "./FormInput";
import { EstablishmentField } from "./EstablishmentField";
import { SuccessModal } from "./SuccessModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Establishment {
  id: number;
  name: string;
  buildingPermitNo: string;
}

export const RegistrationForm: React.FC = () => {
  // Form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [establishments, setEstablishments] = useState<Establishment[]>([{ 
    id: 0, 
    name: "", 
    buildingPermitNo: "" 
  }]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateEstablishment = (index: number, field: keyof Establishment, value: string) => {
    const updatedEstablishments = [...establishments];
    updatedEstablishments[index] = {
      ...updatedEstablishments[index],
      [field]: value
    };
    setEstablishments(updatedEstablishments);
  };

  const addEstablishment = () => {
    setEstablishments([
      ...establishments, 
      { id: establishments.length, name: "", buildingPermitNo: "" }
    ]);
  };

  const removeEstablishment = (index: number) => {
    setEstablishments(establishments.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!firstName.trim()) {
      toast.error("First Name is required");
      return false;
    }
    
    if (!lastName.trim()) {
      toast.error("Last Name is required");
      return false;
    }
    
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    for (const est of establishments) {
      if (!est.name.trim()) {
        toast.error("Establishment Name is required");
        return false;
      }
      
      if (!est.buildingPermitNo.trim()) {
        toast.error("Building Permit Number is required");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Sign up user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: generateTemporaryPassword(), // Generate a temporary password
        options: {
          data: {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            role: 'establishment_owner',
          },
        },
      });

      if (error) throw error;

      // Wait for the trigger to create the profile in the database
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      setShowSuccess(true);
      
      // Reset form
      resetForm();
    } catch (error: any) {
      console.error('Registration error:', error.message);
      toast.error(error.error_description || error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const generateTemporaryPassword = () => {
    // This password is never used by the user; it's just a placeholder
    // The admin will set a temporary password later
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4);
  };

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setEstablishments([{ id: 0, name: "", buildingPermitNo: "" }]);
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
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        icon={
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e12781821eeb5ac2a6a0c7a97069bf812d6d0fd"
            alt="Check"
            className="w-8 h-8"
          />
        }
      />

      <FormInput 
        label="Middle Name" 
        placeholder="Enter Middle Name"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
      />

      <FormInput 
        label="Last Name" 
        required 
        placeholder="Enter Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <FormInput
        label="Email"
        required
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="h-px bg-black mx-0 my-[30px]" />

      {establishments.map((establishment, index) => (
        <div key={index} className="mb-5">
          <EstablishmentField
            index={index}
            onRemove={() => removeEstablishment(index)}
            name={establishment.name}
            buildingPermitNo={establishment.buildingPermitNo}
            onNameChange={(value) => updateEstablishment(index, 'name', value)}
            onPermitChange={(value) => updateEstablishment(index, 'buildingPermitNo', value)}
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

      <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-4">
        <div className="text-base italic">
          <span>Already have an Account? </span>
          <a href="/login" className="underline">
            Log in
          </a>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="text-white text-base font-semibold cursor-pointer bg-[#FE623F] px-[30px] py-2.5 rounded-[10px] border-none"
        >
          {loading ? 'SUBMITTING...' : 'SIGN UP'}
        </button>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </form>
  );
};
