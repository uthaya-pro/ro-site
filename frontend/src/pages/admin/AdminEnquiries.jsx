import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaWhatsapp, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { enquiriesAPI } from '../../services/endpoints';
import { formatDateTime, getStatusBadgeClass, getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './AdminTable.css';

const STATUSES = ['', 'new', 'contacted', 'completed'];
const TYPES    = ['', 'product', 'service', 'general'];

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', type: '', page: 1 });

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 20, ...filters };
      if (!params.search) delete params.search;
      if (!params.status) delete params.status;
      if (!params.type)   delete params.type;
      const res = await enquiriesAPI.getAll(params);
      setEnquiries(res.data.data.enquiries || []);
      setTotal(res.data.data.total || 0);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { document.title = 'Enquiries | Admin'; }, []);
  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const updateFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  const handleStatusChange = async (id, status) => {
    try {
      await enquiriesAPI.updateStatus(id, status);
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      toast.success('Status updated.');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await enquiriesAPI.delete(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
      setTotal(t => t - 1);
      toast.success('Enquiry deleted.');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Enquiries</h1>
          <p className="admin-page__subtitle">{total} total enquiries</p>
        </div>
      </div>

      <div className="admin-table-card">
        {/* Toolbar */}
        <div className="admin-table-card__toolbar" style={{ flexWrap: 'wrap' }}>
          <div className="admin-search">
            <FaSearch className="admin-search__icon" />
            <input type="text" id="enquiry-search" placeholder="Search by name, phone..." value={filters.search} onChange={e => updateFilter('search', e.target.value)} className="form-control admin-search__input" />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <FaFilter size={14} style={{ color: 'var(--gray-400)' }} />
            <select id="enquiry-status-filter" value={filters.status} onChange={e => updateFilter('status', e.target.value)} className="form-control" style={{ width: 'auto' }}>
              {STATUSES.map(s => <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>)}
            </select>
            <select id="enquiry-type-filter" value={filters.type} onChange={e => updateFilter('type', e.target.value)} className="form-control" style={{ width: 'auto' }}>
              {TYPES.map(t => <option key={t} value={t}>{t ? t.charAt(0).toUpperCase() + t.slice(1) : 'All Types'}</option>)}
            </select>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : enquiries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📬</div>
            <h3>No enquiries found</h3>
            <p>Customer enquiries will appear here.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Customer</th><th>Phone</th><th>Product</th><th>Type</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(e => (
                  <tr key={e.id}>
                    <td style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-xs)' }}>#{e.id}</td>
                    <td><strong>{e.name}</strong>{e.email && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-400)' }}>{e.email}</div>}</td>
                    <td>
                      <a href={`https://wa.me/${(e.phone || '').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ display:'flex',alignItems:'center',gap:4,color:'#25D366',fontWeight:600,fontSize:'var(--font-size-sm)' }}>
                        <FaWhatsapp size={13} />{e.phone}
                      </a>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)' }}>{e.product_name || <span style={{ color:'var(--gray-300)' }}>—</span>}</td>
                    <td><span className="badge badge-primary">{e.enquiry_type}</span></td>
                    <td style={{ maxWidth: 180, fontSize: 'var(--font-size-xs)', color: 'var(--gray-500)' }}>{(e.message || '').substring(0, 60)}…</td>
                    <td>
                      <select
                        value={e.status}
                        onChange={ev => handleStatusChange(e.id, ev.target.value)}
                        className={`badge ${getStatusBadgeClass(e.status)}`}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700 }}
                        id={`status-select-${e.id}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ color:'var(--gray-400)',fontSize:'var(--font-size-xs)',whiteSpace:'nowrap' }}>{formatDateTime(e.created_at)}</td>
                    <td>
                      <div className="admin-table-actions">
                        <Link to={`/admin/enquiries/${e.id}`} className="admin-table-action admin-table-action--primary" title="View" id={`view-enquiry-${e.id}`}>
                          👁
                        </Link>
                        <button onClick={() => handleDelete(e.id)} className="admin-table-action admin-table-action--danger" title="Delete" id={`delete-enquiry-${e.id}`}>
                          <FaTrash size={13} />
                        </button>
                      </div>
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

export default AdminEnquiries;
