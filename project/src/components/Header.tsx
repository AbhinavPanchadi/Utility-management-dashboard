import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="bg-zinc-900 shadow flex items-center justify-between px-4 md:px-8 py-4 min-h-[64px] relative z-10">
      {/* Mobile/tablet menu button (below lg) */}
      <button
        className="lg:hidden mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
        onClick={onMenuClick}
        aria-label="Open sidebar menu"
      >
        <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="text-2xl md:text-3xl font-bold tracking-wide text-center flex-1 select-none pointer-events-none">
        <span className="text-emerald-400">Vidya</span>
        <span className="text-blue-400 ml-1">yug</span>
      </div>
      {user && (
        <div className="relative ml-auto" ref={dropdownRef}>
          <button
            className="flex items-center bg-blue-600 text-white rounded px-4 py-2 font-medium text-base gap-2 focus:outline-none"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <span className="font-semibold">{user.username}</span>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-20 overflow-hidden">
              <button
                className="w-full text-left px-5 py-3 text-zinc-900 hover:bg-zinc-100 text-[15px]"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-5 py-3 text-red-500 hover:bg-zinc-100 text-[15px]"
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