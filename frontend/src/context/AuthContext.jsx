import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdmin = useCallback(async () => {
    const token = localStorage.getItem('ro_admin_token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await authAPI.me();
      setAdmin(res.data.data);
    } catch {
      localStorage.removeItem('ro_admin_token');
      localStorage.removeItem('ro_admin_user');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAdmin(); }, [loadAdmin]);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const { token, admin: adminData } = res.data.data;
    localStorage.setItem('ro_admin_token', token);
    localStorage.setItem('ro_admin_user', JSON.stringify(adminData));
    setAdmin(adminData);
    return adminData;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('ro_admin_token');
    localStorage.removeItem('ro_admin_user');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
