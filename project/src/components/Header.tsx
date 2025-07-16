import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-gray-800 shadow p-4 flex items-center justify-between relative">
      <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
        <h1 className="text-2xl font-bold animate-bounce select-none">
          <span className="text-green-400">Vidhya</span>
          <span className="text-blue-400">yug</span>
        </h1>
      </div>
      {user && (
        <div className="relative ml-auto" ref={dropdownRef}>
          <button
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <span>{user.username}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10">
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={e => { e.preventDefault(); setDropdownOpen(false); }}
              >
                Profile
              </a>
              <button
                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header; 