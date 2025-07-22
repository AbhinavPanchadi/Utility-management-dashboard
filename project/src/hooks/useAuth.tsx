import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthUser, LoginCredentials, AuthResponse } from '../types';
import { authAPI } from '../utils/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authAPI.getCurrentUser();
        let permsData = { roles: [], permissions: [] };
        try {
          permsData = await authAPI.getPermissions();
        } catch {}
        setUser({ ...userData, ...permsData });
        setRoles(permsData.roles);
        setPermissions(permsData.permissions);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setRoles([]);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authAPI.login(credentials.username, credentials.password);
      localStorage.setItem('token', response.access_token);
      const userData = await authAPI.getCurrentUser();
      let permsData = { roles: [], permissions: [] };
      try {
        permsData = await authAPI.getPermissions();
      } catch {}
      setUser({ ...userData, ...permsData });
      setRoles(permsData.roles);
      setPermissions(permsData.permissions);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setRoles([]);
    setPermissions([]);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    // Optionally expose roles and permissions if needed
    // roles,
    // permissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 