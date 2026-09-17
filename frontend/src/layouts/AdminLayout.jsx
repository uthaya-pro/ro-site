import { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  FaChartBar, FaBoxOpen, FaTools, FaEnvelope, FaChartLine,
  FaCog, FaBell, FaSignOutAlt, FaWater, FaBars, FaTimes, FaHome
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../services/endpoints';
import './AdminLayout.css';

const navItems = [
  { to: '/admin/dashboard',     icon: FaChartBar,  label: 'Dashboard' },
  { to: '/admin/products',      icon: FaBoxOpen,   label: 'Products' },
  { to: '/admin/services',      icon: FaTools,     label: 'Services' },
  { to: '/admin/enquiries',     icon: FaEnvelope,  label: 'Enquiries' },
  { to: '/admin/reports',       icon: FaChartLine, label: 'Reports' },
  { to: '/admin/notifications', icon: FaBell,      label: 'Notifications' },
  { to: '/admin/settings',      icon: FaCog,       label: 'Settings' },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await notificationsAPI.getAll({ unread_only: 'true' });
      setUnreadCount(res.data.data.unread_count || 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? 'admin-layout--open' : 'admin-layout--closed'}`}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <Link to="/admin/dashboard" className="admin-sidebar__logo">
            <div className="admin-sidebar__logo-icon"><FaWater /></div>
            <div className="admin-sidebar__logo-text">
              <span>TUTY RO</span>
              <small>Admin Panel</small>
            </div>
          </Link>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)}>
            <FaTimes size={16} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
            >
              <Icon className="admin-sidebar__link-icon" />
              <span>{label}</span>
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="admin-sidebar__badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar__link">
            <FaHome className="admin-sidebar__link-icon" />
            <span>View Website</span>
          </a>
          <button className="admin-sidebar__link admin-sidebar__logout" onClick={handleLogout}>
            <FaSignOutAlt className="admin-sidebar__link-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <button
            className="admin-header__toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            id="sidebar-toggle-btn"
          >
            <FaBars size={20} />
          </button>

          <div className="admin-header__right">
            <NavLink to="/admin/notifications" className="admin-header__notif" id="notif-bell-btn">
              <FaBell size={18} />
              {unreadCount > 0 && (
                <span className="admin-header__notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </NavLink>
            <div className="admin-header__admin">
              <div className="admin-header__avatar">
                {admin?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="admin-header__name">{admin?.username || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet context={{ fetchUnread }} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
