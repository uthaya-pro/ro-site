import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { productsAPI } from '../../services/endpoints';
import { formatPrice, formatDate, getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './AdminTable.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await productsAPI.adminGetAll();
      setProducts(res.data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { document.title = 'Products | Admin'; fetchProducts(); }, [fetchProducts]);

  const handleToggle = async (id) => {
    try {
      const res = await productsAPI.toggle(id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: res.data.data.is_active } : p));
      toast.success(res.data.message);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted.');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.technology || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Products</h1>
          <p className="admin-page__subtitle">{products.length} total · {products.filter(p => p.is_active).length} active</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary" id="add-product-btn">
          <FaPlus /> Add Product
        </Link>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card__toolbar">
          <div className="admin-search">
            <FaSearch className="admin-search__icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control admin-search__input"
              id="admin-product-search"
            />
          </div>
          <span className="admin-table-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No products found</h3>
            <p>Add your first product to get started.</p>
            <Link to="/admin/products/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Product</Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Technology</th>
                  <th>Capacity</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-table-product">
                        <div className="admin-table-product__img">
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} />
                            : <span>🚰</span>}
                        </div>
                        <div>
                          <strong>{p.name}</strong>
                          <span className="admin-table-product__desc">
                            {(p.description || '').substring(0, 50)}{p.description?.length > 50 ? '…' : ''}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{p.technology || '—'}</span></td>
                    <td>{p.capacity || '—'}</td>
                    <td><strong style={{ color: 'var(--primary-700)' }}>{formatPrice(p.price)}</strong></td>
                    <td>
                      <span className={`badge ${p.is_active ? 'badge-success' : 'badge-error'}`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-xs)' }}>{formatDate(p.created_at)}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          onClick={() => handleToggle(p.id)}
                          className={`admin-table-action ${p.is_active ? 'admin-table-action--warning' : 'admin-table-action--success'}`}
                          title={p.is_active ? 'Deactivate' : 'Activate'}
                          id={`toggle-product-${p.id}`}
                        >
                          {p.is_active ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                        </button>
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="admin-table-action admin-table-action--primary"
                          title="Edit"
                          id={`edit-product-${p.id}`}
                        >
                          <FaEdit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="admin-table-action admin-table-action--danger"
                          title="Delete"
                          id={`delete-product-${p.id}`}
                        >
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

export default AdminProducts;
