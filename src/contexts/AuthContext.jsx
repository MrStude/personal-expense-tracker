import React, { createContext } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const AuthContext = createContext(undefined);

export { AuthContext };

export function AuthProvider({ children }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}