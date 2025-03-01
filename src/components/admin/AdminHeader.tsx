
import React from 'react';

interface AdminHeaderProps {
  username: string;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ username, onLogout }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-[#FE623F]">Admin Dashboard</h1>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{username}</div>
          <div className="text-xs text-gray-500">Admin</div>
        </div>
        
        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {username.split(' ').map(name => name[0]).join('').toUpperCase()}
          </span>
        </div>
        
        <button 
          onClick={onLogout}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
