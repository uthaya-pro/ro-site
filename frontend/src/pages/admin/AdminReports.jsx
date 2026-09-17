import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaDownload } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { reportsAPI } from '../../services/endpoints';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import './AdminTable.css';
import './AdminExtras.css';


const COLORS = ['#1E88E5','#f59e0b','#10b981','#ef4444','#8b5cf6','#00ACC1'];

const AdminReports = () => {
  const [tab, setTab] = useState('enquiries');
  const [enquiryData, setEnquiryData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => { document.title = 'Reports | Admin'; fetchEnquiryReport(); fetchProductReport(); }, []);

  const fetchEnquiryReport = async (from = '', to = '') => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from = from;
      if (to)   params.to   = to;
      const res = await reportsAPI.enquiries(params);
      setEnquiryData(res.data.data);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  const fetchProductReport = async () => {
    try {
      const res = await reportsAPI.products();
      setProductData(res.data.data);
    } catch {}
  };

  const applyDateFilter = () => fetchEnquiryReport(dateFrom, dateTo);
  const clearFilter = () => { setDateFrom(''); setDateTo(''); fetchEnquiryReport(); };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Reports</h1>
          <p className="admin-page__subtitle">Business analytics and performance overview</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="report-tabs">
        <button className={`report-tab ${tab === 'enquiries' ? 'report-tab--active' : ''}`} onClick={() => setTab('enquiries')} id="tab-enquiries">Enquiry Report</button>
        <button className={`report-tab ${tab === 'products' ? 'report-tab--active' : ''}`} onClick={() => setTab('products')} id="tab-products">Product Report</button>
      </div>

      {tab === 'enquiries' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Date filter */}
          <div className="admin-form-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <FaCalendarAlt style={{ color: 'var(--gray-400)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <label className="form-label" style={{ marginBottom: 0, whiteSpace:'nowrap' }} htmlFor="report-from">From</label>
              <input id="report-from" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="form-control" style={{ width: 'auto' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <label className="form-label" style={{ marginBottom: 0 }} htmlFor="report-to">To</label>
              <input id="report-to" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="form-control" style={{ width: 'auto' }} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={applyDateFilter} id="apply-date-filter-btn">Apply</button>
            <button className="btn btn-secondary btn-sm" onClick={clearFilter} id="clear-date-filter-btn">Clear</button>
            {enquiryData && <span style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)' }}>{enquiryData.total} results</span>}
          </div>

          {loading ? <LoadingSpinner /> : enquiryData && (
            <>
              {/* Charts row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                <div className="admin-form-card">
                  <h2 className="admin-form-card__title">Enquiries Over Time</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={enquiryData.trend?.map(d => ({ date: formatDate(d.date), count: d.count }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1E88E5" radius={[4,4,0,0]} name="Enquiries" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="admin-form-card">
                  <h2 className="admin-form-card__title">By Status</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={enquiryData.by_status} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                        {enquiryData.by_status?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table */}
              <div className="admin-table-card">
                <div className="admin-table-card__toolbar">
                  <h2 style={{ fontWeight: 700, fontSize: 'var(--font-size-base)' }}>Enquiries List</h2>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Product</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {enquiryData.enquiries?.slice(0, 50).map(e => (
                        <tr key={e.id}>
                          <td style={{ color:'var(--gray-400)',fontSize:'var(--font-size-xs)' }}>#{e.id}</td>
                          <td><strong>{e.name}</strong></td>
                          <td style={{ fontSize:'var(--font-size-sm)' }}>{e.phone}</td>
                          <td style={{ fontSize:'var(--font-size-xs)' }}>{e.product_name || '—'}</td>
                          <td><span className="badge badge-primary">{e.enquiry_type}</span></td>
                          <td><span className={`badge ${e.status === 'new' ? 'badge-info' : e.status === 'contacted' ? 'badge-warning' : 'badge-success'}`}>{e.status}</span></td>
                          <td style={{ fontSize:'var(--font-size-xs)',color:'var(--gray-400)' }}>{formatDate(e.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {productData && (
            <>
              <div className="admin-form-card">
                <h2 className="admin-form-card__title">Product Enquiry Count</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={productData.products?.map(p => ({ name: p.name.split(' ').slice(0,3).join(' '), count: p.enquiry_count }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00ACC1" radius={[4,4,0,0]} name="Enquiries" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="admin-table-card">
                <div className="admin-table-card__toolbar"><h2 style={{ fontWeight:700, fontSize:'var(--font-size-base)' }}>Products ({productData.total})</h2></div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Product</th><th>Technology</th><th>Price</th><th>Status</th><th>Enquiries</th></tr></thead>
                    <tbody>
                      {productData.products?.map(p => (
                        <tr key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td><span className="badge badge-primary">{p.technology || '—'}</span></td>
                          <td>{p.price ? `₹${Number(p.price).toLocaleString('en-IN')}` : 'Contact'}</td>
                          <td><span className={`badge ${p.is_active ? 'badge-success' : 'badge-error'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                          <td><strong style={{ color: 'var(--primary-600)' }}>{p.enquiry_count}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
