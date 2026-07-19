import { useState } from 'react';
import api from '../services/api';
import normalizeUser from '../lib/normalizeUser';
import AuthContext from './authContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      return normalizeUser(JSON.parse(savedUser));
    }

    return null;
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const normalizedUser = normalizeUser(data.user);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    const normalizedUser = normalizeUser(data.user);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user: normalizeUser(user), setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
