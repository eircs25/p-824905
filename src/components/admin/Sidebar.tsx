
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-[72px] bg-white shadow-md border-r border-gray-200 flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/45843aab2bdc4491756624ad4ebc4eedc6eb4350"
          className="w-[45px] h-[60px]"
          alt="Logo"
        />
      </div>
      
      {/* Navigation Links */}
      <nav className="flex flex-col gap-8 items-center">
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `rounded-lg p-3 ${isActive ? 'bg-[#FEF2E7]' : 'hover:bg-gray-100'}`
          }
        >
          <img
            src="/lovable-uploads/b6e69eba-72bf-48cd-bfd7-9eab46156b9f.png"
            className="w-6 h-6"
            alt="Users"
          />
        </NavLink>
        
        <NavLink 
          to="/admin/establishments" 
          className={({ isActive }) => 
            `rounded-lg p-3 ${isActive ? 'bg-[#FEF2E7]' : 'hover:bg-gray-100'}`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </NavLink>
        
        <NavLink 
          to="/admin/reports" 
          className={({ isActive }) => 
            `rounded-lg p-3 ${isActive ? 'bg-[#FEF2E7]' : 'hover:bg-gray-100'}`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </NavLink>
        
        <NavLink 
          to="/admin/settings" 
          className={({ isActive }) => 
            `rounded-lg p-3 ${isActive ? 'bg-[#FEF2E7]' : 'hover:bg-gray-100'}`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </NavLink>
      </nav>
      
      {/* Email Link at Bottom */}
      <div className="mt-auto">
        <NavLink 
          to="/admin/messages" 
          className={({ isActive }) => 
            `rounded-lg p-3 ${isActive ? 'bg-[#FEF2E7]' : 'hover:bg-gray-100'}`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
