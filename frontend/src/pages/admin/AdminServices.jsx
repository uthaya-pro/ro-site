import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { servicesAPI } from '../../services/endpoints';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './AdminTable.css';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchServices = useCallback(async () => {
    try {
      const res = await servicesAPI.adminGetAll();
      setServices(res.data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { document.title = 'Services | Admin'; fetchServices(); }, [fetchServices]);

  const handleToggle = async (id) => {
    try {
      const res = await servicesAPI.toggle(id);
      setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: res.data.data.is_active } : s));
      toast.success(res.data.message);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Service deleted.');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Services</h1>
          <p className="admin-page__subtitle">{services.length} total · {services.filter(s => s.is_active).length} active</p>
        </div>
        <Link to="/admin/services/new" className="btn btn-primary" id="add-service-btn">
          <FaPlus /> Add Service
        </Link>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card__toolbar">
          <div className="admin-search">
            <FaSearch className="admin-search__icon" />
            <input type="text" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} className="form-control admin-search__input" id="admin-service-search" />
          </div>
          <span className="admin-table-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔧</div>
            <h3>No services found</h3>
            <Link to="/admin/services/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Service</Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Service</th><th>Price Info</th><th>Icon</th><th>Status</th><th>Sort</th><th>Added</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div>
                        <strong>{s.name}</strong>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-400)', marginTop: 2 }}>
                          {(s.description || '').substring(0, 60)}{s.description?.length > 60 ? '…' : ''}
                        </div>
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--primary-600)', fontWeight: 700 }}>{s.price_info || '—'}</span></td>
                    <td><span className="badge badge-gray">{s.icon || '—'}</span></td>
                    <td><span className={`badge ${s.is_active ? 'badge-success' : 'badge-error'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>{s.sort_order}</td>
                    <td style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-xs)' }}>{formatDate(s.created_at)}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button onClick={() => handleToggle(s.id)} className={`admin-table-action ${s.is_active ? 'admin-table-action--warning' : 'admin-table-action--success'}`} title={s.is_active ? 'Deactivate' : 'Activate'} id={`toggle-service-${s.id}`}>
                          {s.is_active ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                        </button>
                        <Link to={`/admin/services/${s.id}/edit`} className="admin-table-action admin-table-action--primary" title="Edit" id={`edit-service-${s.id}`}>
                          <FaEdit size={14} />
                        </Link>
                        <button onClick={() => handleDelete(s.id)} className="admin-table-action admin-table-action--danger" title="Delete" id={`delete-service-${s.id}`}>
                          <FaTrash size={14} />
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

export default AdminServices;
