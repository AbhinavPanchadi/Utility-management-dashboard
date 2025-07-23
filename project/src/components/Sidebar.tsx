import React from 'react';
import { Home, Users, Shield, BarChart3, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

// Custom hook to detect if screen is lg or larger
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(() => window.innerWidth >= 1024);
  React.useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}

const Sidebar: React.FC<SidebarProps> = ({ open = false, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isUsers = location.pathname === '/users';
  const isAdmin = user?.roles?.includes('Admin');
  const isAnalytics = location.pathname === '/analytics';

  const [closing, setClosing] = React.useState(false);
  const navTargetRef = React.useRef<string | null>(null);
  const isDesktop = useIsDesktop();

  React.useEffect(() => {
    if (open) {
      setClosing(false);
      navTargetRef.current = null;
    }
    // If open becomes true, reset closing state
  }, [open]);

  // Only trigger close animation if sidebar is open and not already closing
  const handleClose = () => {
    if (!closing && open) {
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        if (onClose) onClose();
        // After sidebar is closed, navigate if needed
        if (navTargetRef.current) {
          navigate(navTargetRef.current);
          navTargetRef.current = null;
        }
      }, 250); // match animation duration
    }
  };

  const handleNavigation = (path: string) => {
    if (isDesktop) {
      // On desktop, navigate immediately
      navigate(path);
    } else {
      // On mobile/tablet, close sidebar and then navigate
      navTargetRef.current = path;
      handleClose();
    }
  };

  // Permission checks
  const isSuperAdmin = user?.roles?.includes('Super-Admin');
  const canViewHome = user?.permissions?.includes('home_dashboard');
  const canViewUsers = user?.permissions?.includes('user_dashboard');
  const canViewAdmin = isAdmin || isSuperAdmin; // Only Admins or Super-Admins see Admin page
  const canViewAnalytics = user?.permissions?.includes('analytics_dashboard');

  // Sidebar content
  const content = (
    <aside className="bg-zinc-900 text-white w-64 h-screen p-8 flex flex-col shadow-2xl z-40 border-r border-zinc-800 fixed top-0 left-0 transition-all duration-300">
      <div className="mb-8 text-xl font-semibold text-center tracking-wide text-sky-400 select-none">Dashboard</div>
      <nav className="flex flex-col gap-3">
        {canViewHome && (
          <button
            className={`flex items-center gap-3 px-5 py-3 rounded-lg transition font-medium text-base focus:outline-none ${isDashboard ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-zinc-800'}`}
            onClick={() => handleNavigation('/dashboard')}
            aria-current={isDashboard ? 'page' : undefined}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
        )}
        {canViewUsers && (
          <button
            className={`flex items-center gap-3 px-5 py-3 rounded-lg transition font-medium text-base focus:outline-none ${isUsers ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-zinc-800'}`}
            onClick={() => handleNavigation('/users')}
            aria-current={isUsers ? 'page' : undefined}
          >
            <Users size={20} />
            <span>Users</span>
          </button>
        )}
        {canViewAdmin && (
          <button
            className={`flex items-center gap-3 px-5 py-3 rounded-lg transition font-medium text-base focus:outline-none ${isAdmin ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-zinc-800'}`}
            onClick={() => handleNavigation('/admin')}
            aria-current={isAdmin ? 'page' : undefined}
          >
            <Shield size={20} />
            <span>Admin</span>
          </button>
        )}
        {canViewAnalytics && (
          <button
            className={`flex items-center gap-3 px-5 py-3 rounded-lg transition font-medium text-base focus:outline-none ${isAnalytics ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-zinc-800'}`}
            onClick={() => handleNavigation('/analytics')}
            aria-current={isAnalytics ? 'page' : undefined}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
        )}
      </nav>
    </aside>
  );

  // Tablet/mobile overlay (below lg)
  return (
    <>
      {/* Desktop sidebar (lg and up) */}
      <div className="hidden lg:block">
        {content}
      </div>
      {/* Mobile/tablet sidebar overlay (below lg) */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={handleClose} />
          {/* Sidebar panel */}
          <div className={`relative w-64 min-h-full bg-zinc-900 shadow-2xl border-r border-zinc-800 ${closing ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}>
            <button
              className="absolute top-4 right-4 text-slate-300 hover:text-white p-2 rounded focus:outline-none"
              onClick={handleClose}
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;