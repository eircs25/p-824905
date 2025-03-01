
import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <div className="bg-white px-[30px] py-5 flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/45843aab2bdc4491756624ad4ebc4eedc6eb4350"
          className="w-[40px] h-[50px]"
          alt="Logo"
        />
        <div className="text-[#F00] text-2xl font-semibold ml-2.5">
          <span>V-FIRE</span>
          <span className="text-black text-sm ml-[5px]">INSPECT</span>
        </div>
      </Link>
      <div className="flex gap-4">
        <Link to="/owner-login" className="text-[#FF6347] hover:underline">Login</Link>
        <Link to="/admin-login" className="text-gray-600 hover:underline">Admin</Link>
      </div>
    </div>
  );
};
