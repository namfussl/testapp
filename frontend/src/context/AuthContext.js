import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      setToken(savedToken);
      // Optionally fetch current user info
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { access_token, user: userData } = response.data;
    
    localStorage.setItem('access_token', access_token);
    setToken(access_token);
    setUser(userData);
    
    return userData;
  };

  const register = async (email, password, fullName) => {
    const response = await authService.register(email, password, fullName);
    const userData = response.data;
    
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
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
