import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { servicesAPI } from '../../services/endpoints';
import { getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ProductForm.css';

const ICONS = ['FaTools','FaWrench','FaSlidersH','FaCheckCircle','FaClipboardCheck','FaFlask','FaScrewdriver','FaFilter','FaCog','FaHeadset'];
const EMPTY = { name: '', description: '', price_info: '', icon: 'FaTools', is_active: 1, sort_order: 0 };

const ServiceForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = isEdit ? 'Edit Service | Admin' : 'Add Service | Admin';
    if (isEdit) {
      servicesAPI.getById(id)
        .then(res => {
          const s = res.data.data;
          setForm({ name: s.name || '', description: s.description || '', price_info: s.price_info || '', icon: s.icon || 'FaTools', is_active: s.is_active, sort_order: s.sort_order || 0 });
          if (s.image_url) setImagePreview(s.image_url);
        })
        .catch(() => toast.error('Failed to load service.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Service name is required.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (isEdit) {
        await servicesAPI.update(id, fd);
        toast.success('Service updated!');
      } else {
        await servicesAPI.create(fd);
        toast.success('Service created!');
      }
      navigate('/admin/services');
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
          <Link to="/admin/services" className="form-back-link" id="back-to-services-link"><FaArrowLeft /> Back to Services</Link>
          <h1 className="admin-page__title">{isEdit ? 'Edit Service' : 'Add New Service'}</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} id="service-form">
        <div className="product-form-grid">
          <div className="product-form-main">
            <div className="admin-form-card">
              <h2 className="admin-form-card__title">Service Details</h2>
              <div className="form-group">
                <label className="form-label" htmlFor="sf-name">Service Name *</label>
                <input id="sf-name" type="text" name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="e.g. RO Installation" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sf-description">Description</label>
                <textarea id="sf-description" name="description" value={form.description} onChange={handleChange} className="form-control" rows={4} placeholder="Describe the service..." />
              </div>
              <div className="product-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="sf-price">Pricing Info</label>
                  <input id="sf-price" type="text" name="price_info" value={form.price_info} onChange={handleChange} className="form-control" placeholder="e.g. Starting ₹299" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="sf-sort">Sort Order</label>
                  <input id="sf-sort" type="number" name="sort_order" value={form.sort_order} onChange={handleChange} className="form-control" min="0" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sf-icon">Icon</label>
                <select id="sf-icon" name="icon" value={form.icon} onChange={handleChange} className="form-control">
                  {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="product-form-sidebar">
            <div className="admin-form-card">
              <h2 className="admin-form-card__title">Service Image (Optional)</h2>
              <div className="image-upload-area" onClick={() => fileRef.current.click()} id="service-image-upload">
                {imagePreview ? <img src={imagePreview} alt="Preview" className="image-upload-preview" /> : (
                  <div className="image-upload-placeholder"><FaUpload size={24} /><p>Click to upload</p></div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} id="service-image-input" />
            </div>
            <div className="admin-form-card">
              <h2 className="admin-form-card__title">Status</h2>
              <label className="toggle-label">
                <div className="toggle-label__text"><strong>Active</strong><span>Show on website</span></div>
                <div className={`toggle-switch ${form.is_active ? 'toggle-switch--on' : ''}`} onClick={() => setForm(f => ({ ...f, is_active: f.is_active ? 0 : 1 }))} id="service-toggle-active">
                  <div className="toggle-switch__thumb"></div>
                </div>
              </label>
            </div>
            <div className="admin-form-card admin-form-card--actions">
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={saving} id="save-service-btn">
                {saving ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
              </button>
              <Link to="/admin/services" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} id="cancel-service-btn">Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
