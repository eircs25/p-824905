import React from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  required,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="mb-5">
      <div className="text-black text-xl font-semibold mb-2.5">
        <span>{label}</span>
        {required && <span className="text-[#F00]">*</span>}
      </div>
      <div className="relative">
        <input
          className={cn(
            "w-full h-[55px] text-xl font-semibold text-[#9B9B9B] bg-[#E2E2E2] px-5 py-0 rounded-[20px] border-none",
            "max-sm:h-[45px] max-sm:text-base",
            className,
          )}
          {...props}
        />
        {icon && (
          <div className="absolute -translate-y-2/4 right-2.5 top-2/4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
