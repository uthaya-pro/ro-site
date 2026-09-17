import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaWhatsapp, FaPhone, FaEnvelope, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { enquiriesAPI } from '../../services/endpoints';
import { formatDateTime, getStatusBadgeClass, buildWhatsAppLink, getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ProductForm.css';

const EnquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    document.title = 'Enquiry Detail | Admin';
    enquiriesAPI.getById(id)
      .then(res => { setEnquiry(res.data.data); setStatus(res.data.data.status); })
      .catch(() => toast.error('Failed to load enquiry.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusSave = async () => {
    setSaving(true);
    try {
      await enquiriesAPI.updateStatus(id, status);
      setEnquiry(prev => ({ ...prev, status }));
      toast.success('Status updated.');
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    try {
      await enquiriesAPI.delete(id);
      toast.success('Enquiry deleted.');
      navigate('/admin/enquiries');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  if (loading) return <LoadingSpinner />;
  if (!enquiry) return <div className="empty-state"><p>Enquiry not found.</p></div>;

  const waLink = buildWhatsAppLink(enquiry.phone?.replace(/\D/g,''), `Hello ${enquiry.name}, thank you for your enquiry. `);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <Link to="/admin/enquiries" className="form-back-link" id="back-to-enquiries-link"><FaArrowLeft /> Back to Enquiries</Link>
          <h1 className="admin-page__title">Enquiry #{enquiry.id}</h1>
          <p className="admin-page__subtitle">{formatDateTime(enquiry.created_at)}</p>
        </div>
        <button onClick={handleDelete} className="btn btn-danger btn-sm" id="delete-enquiry-btn">
          <FaTrash size={13} /> Delete
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="admin-form-card">
            <h2 className="admin-form-card__title">Customer Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="enquiry-detail-row">
                <span>Name</span><strong>{enquiry.name}</strong>
              </div>
              <div className="enquiry-detail-row">
                <span>Phone</span>
                <a href={`tel:${enquiry.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary-600)', fontWeight: 600 }}>
                  <FaPhone size={13} /> {enquiry.phone}
                </a>
              </div>
              {enquiry.email && (
                <div className="enquiry-detail-row">
                  <span>Email</span>
                  <a href={`mailto:${enquiry.email}`} style={{ color: 'var(--primary-600)', fontWeight: 600, display:'flex',alignItems:'center',gap:6 }}>
                    <FaEnvelope size={13} /> {enquiry.email}
                  </a>
                </div>
              )}
              {enquiry.product_name && (
                <div className="enquiry-detail-row">
                  <span>Product</span><span className="badge badge-primary">{enquiry.product_name}</span>
                </div>
              )}
              <div className="enquiry-detail-row">
                <span>Type</span><span className="badge badge-info">{enquiry.enquiry_type}</span>
              </div>
            </div>
          </div>

          <div className="admin-form-card">
            <h2 className="admin-form-card__title">Message</h2>
            <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{enquiry.message}</p>
          </div>

          <div className="admin-form-card">
            <h2 className="admin-form-card__title">Quick Reply</h2>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg" style={{ justifyContent: 'center' }} id="reply-whatsapp-btn">
              <FaWhatsapp size={20} /> Reply on WhatsApp
            </a>
          </div>
        </div>

        {/* Status sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="admin-form-card">
            <h2 className="admin-form-card__title">Status</h2>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <span className={`badge ${getStatusBadgeClass(enquiry.status)}`} style={{ fontSize: 'var(--font-size-sm)', padding: '6px 16px' }}>
                Current: {enquiry.status}
              </span>
            </div>
            <select id="enquiry-detail-status" value={status} onChange={e => setStatus(e.target.value)} className="form-control" style={{ marginBottom: 'var(--space-3)' }}>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleStatusSave} disabled={saving || status === enquiry.status} id="save-status-btn">
              {saving ? 'Saving...' : 'Update Status'}
            </button>
          </div>

          <div className="admin-form-card">
            <h2 className="admin-form-card__title">Timeline</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-400)' }}>
                <strong style={{ display: 'block', color: 'var(--gray-600)' }}>Received</strong>
                {formatDateTime(enquiry.created_at)}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-400)' }}>
                <strong style={{ display: 'block', color: 'var(--gray-600)' }}>Last Updated</strong>
                {formatDateTime(enquiry.updated_at)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetail;
