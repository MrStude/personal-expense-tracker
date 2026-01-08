// src/hooks/useAuth.js
import { useState, useCallback } from 'react';
import { apiPost } from '../lib/api.js';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  //  LOGIN
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await apiPost('/auth/login', { email, password });

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  // REGISTER
  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await apiPost('/auth/register', {
        name,
        email,
        password,
      });

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  //  LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
  };
}
