// src/hooks/useAuth.js
import { useState, useCallback } from 'react';
import { apiPost } from '../lib/api.js';

export function useAuth() {
  const [user, setUser] = useState(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('pendingAuthUser');

    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // ✅ LOGIN
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await apiPost('/auth/login', { email, password });

      sessionStorage.setItem('pendingAuthUser', JSON.stringify(data.user));

      setIsLoading(false);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return null;
    }
  }, []);

  // ✅ REGISTER
  const register = useCallback(async (name, email, password, phone) => {
    setIsLoading(true);
    try {
      const data = await apiPost('/auth/register', {
        name,
        email,
        password,
        phone,
      });

      sessionStorage.setItem('pendingAuthUser', JSON.stringify(data.user));

      setIsLoading(false);
      return data.user;
    } catch (error) {
      console.error('Register error:', error);
      setIsLoading(false);
      return null;
    }
  }, []);

  const completeOtpLogin = useCallback((verifiedUser) => {
    const userToStore =
      verifiedUser || JSON.parse(sessionStorage.getItem('pendingAuthUser'));

    if (!userToStore) return false;

    setUser(userToStore);
    sessionStorage.setItem('user', JSON.stringify(userToStore));
    sessionStorage.removeItem('pendingAuthUser');
    return true;
  }, []);

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('pendingAuthUser');
    localStorage.removeItem('user');
    localStorage.removeItem('pendingAuthUser');
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    register,
    completeOtpLogin,
    logout,
    isLoading,
    setUser, // expose setUser for profile updates
  };
}
