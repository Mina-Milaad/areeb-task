// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // undefined = “still loading”, null = “no user”, {…} = user
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    setUser(stored || null);
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/signin', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
