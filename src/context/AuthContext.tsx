import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../lib/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  switchDemoRole: (role: 'customer' | 'super_admin' | 'order_manager' | 'content_manager') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      if (getStoredToken()) {
        const { user } = await api.getMe();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
      removeStoredToken();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const data = await api.register(payload);
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchProfile();
  };

  // Demo Switcher for fast evaluation
  const switchDemoRole = async (role: 'customer' | 'super_admin' | 'order_manager' | 'content_manager') => {
    const credentials = {
      customer: { email: 'customer@example.co.uk', password: 'Customer123!' },
      super_admin: { email: 'admin@customcarmats.co.uk', password: 'Admin123!' },
      order_manager: { email: 'orders@customcarmats.co.uk', password: 'Admin123!' },
      content_manager: { email: 'editor@customcarmats.co.uk', password: 'Admin123!' }
    }[role];

    if (credentials) {
      await login(credentials.email, credentials.password);
    }
  };

  const staffRoles = ['super_admin', 'admin', 'content_manager', 'order_manager'];
  const isStaff = user ? staffRoles.includes(user.role) : false;
  const isAdmin = user ? (user.role === 'super_admin' || user.role === 'admin') : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isStaff,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
