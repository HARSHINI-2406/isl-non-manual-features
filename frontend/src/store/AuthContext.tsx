import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string, role: string) => Promise<void>;
  logout: () => void;
  updateUser: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token by fetching fresh profile
        try {
          const res = await api.get('/users/profile');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Token verification failed", err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password, remember_me: rememberMe });
      const { access_token, user: userData } = res.data;
      
      setToken(access_token);
      setUser(userData);
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string, role: string) => {
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        confirm_password: confirmPassword,
        role
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    api.post('/auth/logout').catch(() => {});
  };

  const updateUser = (name: string, email: string) => {
    if (user) {
      const updated = { ...user, name, email };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
