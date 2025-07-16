import React from 'react';
import { Home, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isUsers = location.pathname === '/users';
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8 flex justify-center">
        <h2 className="text-xl font-semibold text-white text-center">Dashboard</h2>
      </div>
      <nav className="space-y-2">
        <div
          className={`px-4 py-3 rounded-lg flex items-center space-x-3 cursor-pointer transition-colors ${isDashboard ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          onClick={() => navigate('/dashboard')}
        >
          <Home size={20} />
          <span>Home</span>
        </div>
        <div
          className={`px-4 py-3 rounded-lg flex items-center space-x-3 cursor-pointer transition-colors ${isUsers ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          onClick={() => navigate('/users')}
        >
          <Users size={20} />
          <span>Users</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;