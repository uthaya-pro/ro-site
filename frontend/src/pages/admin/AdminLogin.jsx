import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FaWater, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/helpers';
import './AdminLogin.css';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) { toast.error('Please enter username and password.'); return; }
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg">
        <div className="admin-login__bg-shape admin-login__bg-shape--1"></div>
        <div className="admin-login__bg-shape admin-login__bg-shape--2"></div>
      </div>
      <div className="admin-login__card">
        <div className="admin-login__header">
          <div className="admin-login__logo">
            <FaWater />
          </div>
          <h1 className="admin-login__title">Admin Panel</h1>
          <p className="admin-login__subtitle">TUTY RO Purifier Management</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login__form" id="admin-login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username or Email</label>
            <input
              id="login-username"
              type="text"
              className="form-control"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="admin-login__pw-wrap">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
                required
              />
              <button type="button" className="admin-login__pw-toggle" onClick={() => setShowPw(!showPw)} id="toggle-password-btn">
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg admin-login__submit" disabled={loading} id="login-submit-btn">
            {loading ? (
              <><span className="spinner spinner-sm"></span> Signing in...</>
            ) : (
              <><FaLock size={16} /> Sign In</>
            )}
          </button>
        </form>
        <div className="admin-login__hint">
          <p>🔒 Default credentials: <code>admin</code> / <code>admin@123</code></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
