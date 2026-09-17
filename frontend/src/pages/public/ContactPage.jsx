import { useState } from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useSettings } from '../../context/SettingsContext';
import { enquiriesAPI } from '../../services/endpoints';
import { buildWhatsAppLink, getErrorMessage } from '../../utils/helpers';
import './ContactPage.css';

const ContactPage = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const waLink = buildWhatsAppLink(settings.whatsapp_number, 'Hello! I have an enquiry.');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await enquiriesAPI.submit({ ...form, enquiry_type: 'general' });
      setSubmitted(true);
      toast.success('Enquiry submitted! We will contact you soon.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help. Reach out for products, services, or any queries.</p>
        </div>
      </section>

      <div className="container section-padding">
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <h2 className="contact-info__title">Get in Touch</h2>
            <p className="contact-info__subtitle">
              Visit our shop or reach us via phone, WhatsApp, or email. We're always happy to help!
            </p>

            <div className="contact-info__items">
              {settings.address && (
                <div className="contact-info__item">
                  <div className="contact-info__icon"><FaMapMarkerAlt /></div>
                  <div>
                    <strong>Address</strong>
                    <p>{settings.address}</p>
                    {settings.google_maps_link && (
                      <a href={settings.google_maps_link} target="_blank" rel="noopener noreferrer" className="contact-info__map-link" id="view-on-map-btn">
                        View on Maps <FaExternalLinkAlt size={11} />
                      </a>
                    )}
                  </div>
                </div>
              )}
              {settings.phone && (
                <div className="contact-info__item">
                  <div className="contact-info__icon"><FaPhone /></div>
                  <div>
                    <strong>Phone</strong>
                    <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                  </div>
                </div>
              )}
              {settings.whatsapp_number && (
                <div className="contact-info__item">
                  <div className="contact-info__icon contact-info__icon--wa"><FaWhatsapp /></div>
                  <div>
                    <strong>WhatsApp</strong>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" id="contact-wa-btn">Chat with us on WhatsApp</a>
                  </div>
                </div>
              )}
              {settings.email && (
                <div className="contact-info__item">
                  <div className="contact-info__icon"><FaEnvelope /></div>
                  <div>
                    <strong>Email</strong>
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </div>
                </div>
              )}
              {settings.business_hours && (
                <div className="contact-info__item">
                  <div className="contact-info__icon"><FaClock /></div>
                  <div>
                    <strong>Business Hours</strong>
                    <p>{settings.business_hours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-form-success">
                <FaCheckCircle className="contact-form-success__icon" />
                <h3>Thank You!</h3>
                <p>Your enquiry has been received. Our team will contact you within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', message: '' }); }} id="submit-another-btn">
                  Submit Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="contact-form-card__title">Send an Enquiry</h2>
                <p className="contact-form-card__subtitle">Fill in the form and we'll get back to you shortly.</p>
                <form onSubmit={handleSubmit} id="enquiry-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">Full Name *</label>
                    <input id="contact-name" type="text" name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-phone">Phone Number *</label>
                    <input id="contact-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-control" placeholder="+91 9677895441" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email (Optional)</label>
                    <input id="contact-email" type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="uthaya24524@gmail.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">Message *</label>
                    <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} className="form-control" placeholder="Tell us how we can help..." rows={4} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting} id="submit-enquiry-btn">
                    {submitting ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
