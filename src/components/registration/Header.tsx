import React from "react";

export const Header: React.FC = () => {
  return (
    <div className="flex items-center h-[116px] bg-white px-10 py-0 border-2 border-solid border-black max-sm:h-20 max-sm:px-5 max-sm:py-0">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/45843aab2bdc4491756624ad4ebc4eedc6eb4350"
        className="w-[65px] h-[86px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] max-sm:w-10 max-sm:h-auto"
        alt="Logo"
      />
      <div className="ml-5">
        <div className="text-[#F00] text-4xl font-semibold max-sm:text-2xl">
          <span>V-FIRE</span>
          <span className="text-black text-xl ml-[5px] max-sm:text-base">
            INSPECT
          </span>
        </div>
      </div>
      <nav className="flex gap-[50px] ml-auto max-sm:hidden">
        <a href="#" className="text-black text-2xl font-semibold">
          HOME
        </a>
        <a href="#" className="text-black text-2xl font-semibold">
          FAQS
        </a>
        <a href="#" className="text-black text-2xl font-semibold">
          ABOUT
        </a>
      </nav>
    </div>
  );
};
