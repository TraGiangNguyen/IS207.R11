import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('beautypals_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('beautypals_token') || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync / Verify profile on mount if token exists
  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('beautypals_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('[AUTH] Token validation failed:', err.message);
          logout();
        }
      }
      setIsLoading(false);
    }
    verifyAuth();
  }, [token]);

  const login = async (account, password) => {
    const res = await authService.login({ account, password });
    if (res.success && res.data) {
      const { user: userData, token: jwtToken } = res.data;
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('beautypals_token', jwtToken);
      localStorage.setItem('beautypals_user', JSON.stringify(userData));
      return res;
    }
    throw new Error(res.message || 'Đăng nhập thất bại.');
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    if (res.success && res.data) {
      const { user: userData, token: jwtToken } = res.data;
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('beautypals_token', jwtToken);
      localStorage.setItem('beautypals_user', JSON.stringify(userData));
      return res;
    }
    throw new Error(res.message || 'Đăng ký thất bại.');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('beautypals_token');
    localStorage.removeItem('beautypals_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
