import { useState, useEffect, useCallback } from 'react';
import { FaBell, FaCheckDouble, FaEnvelope, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { notificationsAPI } from '../../services/endpoints';
import { formatDateTime, getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './AdminTable.css';
import './AdminExtras.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.data.notifications || []);
      setUnreadCount(res.data.data.unread_count || 0);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { document.title = 'Notifications | Admin'; fetchNotifications(); }, [fetchNotifications]);

  const markRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const getIcon = (type) => type === 'enquiry' ? <FaEnvelope /> : <FaCog />;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Notifications</h1>
          <p className="admin-page__subtitle">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={markAllRead} id="mark-all-read-btn">
            <FaCheckDouble size={14} /> Mark All Read
          </button>
        )}
      </div>

      <div className="admin-form-card" style={{ padding: 0, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <h3>No notifications</h3>
            <p>New enquiries and events will appear here.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`notification-item ${!n.is_read ? 'notification-item--unread' : ''}`}
                onClick={() => !n.is_read && markRead(n.id)}
                id={`notification-${n.id}`}
              >
                <div className={`notification-item__icon notification-item__icon--${n.type}`}>
                  {getIcon(n.type)}
                </div>
                <div className="notification-item__body">
                  <p className="notification-item__title">{n.title}</p>
                  {n.message && <p className="notification-item__msg">{n.message}</p>}
                  <p className="notification-item__time">{formatDateTime(n.created_at)}</p>
                </div>
                {!n.is_read && <div className="notification-item__dot"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
