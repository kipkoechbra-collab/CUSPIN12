import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const me = await api.getMe();
          setUser(me);
        } catch (err) {
          console.error('Session restoration failed:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: any): Promise<User> => {
    const res = await api.login(data);
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    setUser(res.user);
    return res.user;
  };

  const register = async (data: any): Promise<User> => {
    const res = await api.register(data);
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isVendor = user?.role === 'VENDOR';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isVendor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
