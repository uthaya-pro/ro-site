import { useState, useEffect } from 'react';
import { FaSave, FaGlobe, FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../services/endpoints';
import { useSettings } from '../../context/SettingsContext';
import { getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ProductForm.css';

const SETTING_FIELDS = [
  { group: 'Business Info', fields: [
    { key: 'business_name',  label: 'Business Name',   type: 'text', icon: FaGlobe,        placeholder: 'TUTY RO Purifier' },
    { key: 'tagline',        label: 'Tagline',          type: 'text', icon: FaGlobe,        placeholder: 'Pure Water. Healthy Life.' },
  ]},
  { group: 'Contact Details', fields: [
    { key: 'phone',          label: 'Phone Number',     type: 'text', icon: FaPhone,        placeholder: '+91 98765 43210' },
    { key: 'whatsapp_number',label: 'WhatsApp Number (digits only)', type: 'text', icon: FaWhatsapp, placeholder: '919876543210' },
    { key: 'email',          label: 'Email Address',    type: 'email',icon: FaEnvelope,     placeholder: 'info@example.com' },
  ]},
  { group: 'Location', fields: [
    { key: 'address',        label: 'Shop Address',     type: 'textarea', icon: FaMapMarkerAlt, placeholder: '123, Main Road, Thoothukudi...' },
    { key: 'business_hours', label: 'Business Hours',   type: 'text', icon: FaClock,        placeholder: 'Mon–Sat: 9AM – 7PM' },
    { key: 'google_maps_link',label:'Google Maps Link', type: 'url',  icon: FaMapMarkerAlt, placeholder: 'https://maps.google.com/...' },
  ]},
  { group: 'Social Media', fields: [
    { key: 'facebook_url',   label: 'Facebook URL',     type: 'url', icon: FaFacebook,     placeholder: 'https://facebook.com/...' },
    { key: 'instagram_url',  label: 'Instagram URL',    type: 'url', icon: FaInstagram,    placeholder: 'https://instagram.com/...' },
    { key: 'youtube_url',    label: 'YouTube URL',      type: 'url', icon: FaYoutube,      placeholder: 'https://youtube.com/...' },
  ]},
];

const AdminSettings = () => {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = 'Settings | Admin';
    settingsAPI.get()
      .then(res => setSettings(res.data.data || {}))
      .catch(() => toast.error('Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsAPI.update(settings);
      await refreshSettings();
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Website Settings</h1>
          <p className="admin-page__subtitle">Manage business info, contact details, and social links</p>
        </div>
      </div>

      <form onSubmit={handleSave} id="settings-form">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {SETTING_FIELDS.map(group => (
            <div key={group.group} className="admin-form-card">
              <h2 className="admin-form-card__title">{group.group}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {group.fields.map(({ key, label, type, icon: Icon, placeholder }) => (
                  <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`setting-${key}`}>
                      <span style={{ display:'flex',alignItems:'center',gap:'var(--space-2)' }}>
                        <Icon size={13} /> {label}
                      </span>
                    </label>
                    {type === 'textarea' ? (
                      <textarea
                        id={`setting-${key}`}
                        value={settings[key] || ''}
                        onChange={e => handleChange(key, e.target.value)}
                        className="form-control"
                        placeholder={placeholder}
                        rows={3}
                      />
                    ) : (
                      <input
                        id={`setting-${key}`}
                        type={type}
                        value={settings[key] || ''}
                        onChange={e => handleChange(key, e.target.value)}
                        className="form-control"
                        placeholder={placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="admin-form-card" style={{ display:'flex', justifyContent:'flex-end', gap:'var(--space-3)' }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving} id="save-settings-btn">
              {saving ? <><span className="spinner spinner-sm"></span> Saving...</> : <><FaSave size={16}/> Save Settings</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
