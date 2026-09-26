import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('teamup_token');
    if (!token) {
      setLoading(false);
      return;
    }
    profileService
      .getMyProfile()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('teamup_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem('teamup_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('teamup_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
