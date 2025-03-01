
import React from "react";

interface EstablishmentFieldProps {
  onRemove?: () => void;
  index: number;
  name: string;
  buildingPermitNo: string;
  onNameChange: (value: string) => void;
  onPermitChange: (value: string) => void;
}

export const EstablishmentField: React.FC<EstablishmentFieldProps> = ({
  onRemove,
  index,
  name,
  buildingPermitNo,
  onNameChange,
  onPermitChange
}) => {
  return (
    <div className="flex gap-5 max-md:flex-col">
      <div className="flex-1 relative">
        <div className="text-black text-xl font-semibold mb-2.5">
          <span>Establishment Name</span>
          <span className="text-[#F00]">*</span>
        </div>
        <input
          type="text"
          placeholder="Est Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full h-[55px] text-xl font-semibold text-[#9B9B9B] bg-[#E2E2E2] px-5 py-0 rounded-[20px] border-none max-sm:h-[45px] max-sm:text-base"
        />
      </div>
      <div className="flex-1 relative">
        <div className="text-black text-xl font-semibold mb-2.5">
          <span>Building permit No.</span>
          <span className="text-[#F00]">*</span>
        </div>
        <input
          type="text"
          placeholder="Bldg No."
          value={buildingPermitNo}
          onChange={(e) => onPermitChange(e.target.value)}
          className="w-full h-[55px] text-xl font-semibold text-[#9B9B9B] bg-[#E2E2E2] px-5 py-0 rounded-[20px] border-none max-sm:h-[45px] max-sm:text-base"
        />
        {index > 0 && (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b3412fe7392223ca5b428cae5913d4338a09b26d"
            className="absolute -translate-y-2/4 w-[30px] h-[30px] cursor-pointer right-2.5 top-2/4"
            alt="Remove"
            onClick={onRemove}
          />
        )}
      </div>
    </div>
  );
};
