import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaPlus, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { productsAPI } from '../../services/endpoints';
import { getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ProductForm.css';

const EMPTY = { name: '', description: '', price: '', capacity: '', technology: '', features: [], is_active: 1, sort_order: 0 };

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState(EMPTY);
  const [featureInput, setFeatureInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = isEdit ? 'Edit Product | Admin' : 'Add Product | Admin';
    if (isEdit) {
      productsAPI.getById(id)
        .then(res => {
          const p = res.data.data;
          setForm({
            name: p.name || '',
            description: p.description || '',
            price: p.price != null ? String(p.price) : '',
            capacity: p.capacity || '',
            technology: p.technology || '',
            features: Array.isArray(p.features) ? p.features : [],
            is_active: p.is_active,
            sort_order: p.sort_order || 0,
          });
          if (p.image_url) setImagePreview(p.image_url);
        })
        .catch(() => toast.error('Failed to load product.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addFeature = () => {
    const f = featureInput.trim();
    if (!f) return;
    if (form.features.includes(f)) { toast.error('Feature already added.'); return; }
    setForm(prev => ({ ...prev, features: [...prev.features, f] }));
    setFeatureInput('');
  };

  const removeFeature = (idx) => setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Product name is required.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'features') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) {
        await productsAPI.update(id, fd);
        toast.success('Product updated successfully!');
      } else {
        await productsAPI.create(fd);
        toast.success('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="product-form-page">
      <div className="admin-page__header">
        <div>
          <Link to="/admin/products" className="form-back-link" id="back-to-products-link">
            <FaArrowLeft /> Back to Products
          </Link>
          <h1 className="admin-page__title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} id="product-form">
        <div className="product-form-grid">
          {/* Main Fields */}
          <div className="product-form-main">
            <div className="admin-form-card">
              <h2 className="admin-form-card__title">Basic Information</h2>
              <div className="form-group">
                <label className="form-label" htmlFor="pf-name">Product Name *</label>
                <input id="pf-name" type="text" name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="e.g. TUTY Pure Pro 10L" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pf-description">Description</label>
                <textarea id="pf-description" name="description" value={form.description} onChange={handleChange} className="form-control" rows={4} placeholder="Product description..." />
              </div>
              <div className="product-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="pf-price">Price (₹) — leave empty for "Contact for Price"</label>
                  <input id="pf-price" type="number" name="price" value={form.price} onChange={handleChange} className="form-control" placeholder="e.g. 12999" min="0" step="0.01" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pf-capacity">Capacity</label>
                  <input id="pf-capacity" type="text" name="capacity" value={form.capacity} onChange={handleChange} className="form-control" placeholder="e.g. 10 Litres/Hour" />
                </div>
              </div>
              <div className="product-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="pf-technology">Technology</label>
                  <input id="pf-technology" type="text" name="technology" value={form.technology} onChange={handleChange} className="form-control" placeholder="e.g. RO+UV+TDS" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pf-sort">Sort Order</label>
                  <input id="pf-sort" type="number" name="sort_order" value={form.sort_order} onChange={handleChange} className="form-control" min="0" />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="admin-form-card">
              <h2 className="admin-form-card__title">Features</h2>
              <div className="feature-input-row">
                <input
                  type="text"
                  id="feature-input"
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  className="form-control"
                  placeholder="Type a feature and press Add"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                />
                <button type="button" className="btn btn-primary" onClick={addFeature} id="add-feature-btn">
                  <FaPlus /> Add
                </button>
              </div>
              <div className="feature-tags">
                {form.features.map((f, i) => (
                  <span key={i} className="feature-tag">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)} className="feature-tag__remove" id={`remove-feature-${i}`}>
                      <FaTimes size={10} />
                    </button>
                  </span>
                ))}
                {form.features.length === 0 && <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)' }}>No features added yet.</p>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="product-form-sidebar">
            {/* Image Upload */}
            <div className="admin-form-card">
              <h2 className="admin-form-card__title">Product Image</h2>
              <div
                className={`image-upload-area ${imagePreview ? 'image-upload-area--has-image' : ''}`}
                onClick={() => fileRef.current.click()}
                id="image-upload-area"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-upload-preview" />
                ) : (
                  <div className="image-upload-placeholder">
                    <FaUpload size={28} />
                    <p>Click to upload image</p>
                    <span>JPG, PNG, WEBP · Max 5MB</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} id="image-file-input" />
              {imagePreview && (
                <button type="button" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 'var(--space-3)', justifyContent: 'center' }}
                  onClick={() => fileRef.current.click()} id="change-image-btn">
                  Change Image
                </button>
              )}
            </div>

            {/* Status */}
            <div className="admin-form-card">
              <h2 className="admin-form-card__title">Availability</h2>
              <label className="toggle-label" htmlFor="pf-active">
                <div className="toggle-label__text">
                  <strong>Active / Visible</strong>
                  <span>Show this product on the website</span>
                </div>
                <div className={`toggle-switch ${form.is_active ? 'toggle-switch--on' : ''}`} onClick={() => setForm(f => ({ ...f, is_active: f.is_active ? 0 : 1 }))} id="toggle-active-btn">
                  <div className="toggle-switch__thumb"></div>
                </div>
              </label>
            </div>

            {/* Save */}
            <div className="admin-form-card admin-form-card--actions">
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={saving} id="save-product-btn">
                {saving ? <><span className="spinner spinner-sm"></span> Saving...</> : isEdit ? 'Update Product' : 'Create Product'}
              </button>
              <Link to="/admin/products" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} id="cancel-product-btn">Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
