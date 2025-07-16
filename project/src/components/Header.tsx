import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

const headerStyle: React.CSSProperties = {
  background: '#18181b',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  padding: '16px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  minHeight: 64,
  zIndex: 100,
};

const titleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: 1,
  color: '#22d3ee',
  textAlign: 'center',
  flex: 1,
  pointerEvents: 'none',
  userSelect: 'none',
};

const userButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: 16,
  outline: 'none',
  gap: 8,
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  marginTop: 8,
  width: 160,
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
  zIndex: 200,
  overflow: 'hidden',
};

const dropdownItemStyle: React.CSSProperties = {
  padding: '12px 20px',
  color: '#18181b',
  background: 'none',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  fontSize: 15,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const Header: React.FC = () => {
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
    <header style={headerStyle}>
      <div style={titleStyle}>
        <span style={{ color: '#4ade80' }}>Vidya</span>
        <span style={{ color: '#60a5fa', marginLeft: 2 }}>yug</span>
      </div>
      {user && (
        <div style={{ position: 'relative', marginLeft: 'auto' }} ref={dropdownRef}>
          <button
            style={userButtonStyle}
            onClick={() => setDropdownOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <span style={{ fontWeight: 600 }}>{user.username}</span>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div style={dropdownStyle}>
              <button
                style={dropdownItemStyle}
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </button>
              <button
                style={{ ...dropdownItemStyle, color: '#ef4444' }}
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