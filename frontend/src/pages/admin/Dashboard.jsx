import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaTools, FaEnvelope, FaBell, FaClock, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../../services/endpoints';
import { formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Dashboard.css';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="stat-card" style={{ '--card-color': color }}>
    <div className="stat-card__icon"><Icon /></div>
    <div className="stat-card__body">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {sub && <p className="stat-card__sub">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | Admin';
    dashboardAPI.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div className="empty-state"><p>Could not load dashboard.</p></div>;

  const trendData = stats.enquiries_trend?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    count: d.count,
  })) || [];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <p className="dashboard__time"><FaClock size={13} /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stat Cards */}
      <div className="dashboard__stats">
        <StatCard icon={FaBoxOpen}  label="Total Products"    value={stats.total_products}    sub={`${stats.active_products} active`}   color="#1E88E5" />
        <StatCard icon={FaTools}    label="Total Services"    value={stats.total_services}     sub={`${stats.active_services} active`}   color="#00ACC1" />
        <StatCard icon={FaEnvelope} label="Total Enquiries"   value={stats.total_enquiries}    sub={`${stats.new_enquiries} new`}        color="#f59e0b" />
        <StatCard icon={FaBell}     label="Notifications"     value={stats.unread_notifications} sub="unread"                           color="#ef4444" />
      </div>

      <div className="dashboard__row">
        {/* Chart */}
        <div className="dashboard__chart-card">
          <div className="dashboard__card-header">
            <h2>Enquiries (Last 7 Days)</h2>
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="enquiryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1E88E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#1E88E5" fill="url(#enquiryGrad)" strokeWidth={2} name="Enquiries" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ minHeight: 200 }}>
              <p>No enquiry data in the last 7 days.</p>
            </div>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="dashboard__status-card">
          <div className="dashboard__card-header">
            <h2>Enquiry Status</h2>
            <Link to="/admin/enquiries" className="dashboard__view-all">View All</Link>
          </div>
          {stats.enquiry_by_status?.map(s => (
            <div key={s.status} className="dashboard__status-item">
              <span className={`badge ${getStatusBadgeClass(s.status)}`}>{s.status}</span>
              <span className="dashboard__status-count">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="dashboard__recent-card">
        <div className="dashboard__card-header">
          <h2>Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="dashboard__view-all">View All</Link>
        </div>
        {stats.recent_enquiries?.length === 0 ? (
          <div className="empty-state" style={{ minHeight: 120 }}><p>No enquiries yet.</p></div>
        ) : (
          <div className="dashboard__enquiries-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Phone</th><th>Product</th><th>Type</th><th>Status</th><th>Date</th><th></th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_enquiries?.map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.name}</strong></td>
                    <td>
                      <a href={`https://wa.me/${e.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ display:'flex',alignItems:'center',gap:4,color:'#25D366',fontWeight:600 }}>
                        <FaWhatsapp size={13} />{e.phone}
                      </a>
                    </td>
                    <td>{e.product_name || <span style={{ color:'var(--gray-400)' }}>—</span>}</td>
                    <td><span className="badge badge-primary">{e.enquiry_type}</span></td>
                    <td><span className={`badge ${getStatusBadgeClass(e.status)}`}>{e.status}</span></td>
                    <td style={{ color:'var(--gray-400)',fontSize:'var(--font-size-xs)' }}>{formatDateTime(e.created_at)}</td>
                    <td>
                      <Link to={`/admin/enquiries/${e.id}`} className="btn btn-secondary btn-sm" id={`view-enquiry-${e.id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
