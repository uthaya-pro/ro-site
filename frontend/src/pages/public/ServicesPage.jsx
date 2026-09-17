import { useState, useEffect } from 'react';
import ServiceCard from '../../components/services/ServiceCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { servicesAPI } from '../../services/endpoints';
import { useSettings } from '../../context/SettingsContext';
import { buildWhatsAppLink } from '../../utils/helpers';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

const ServicesPage = () => {
  const { settings } = useSettings();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const waLink = buildWhatsAppLink(settings.whatsapp_number, 'Hello! I need RO purifier service. Please provide more details.');

  useEffect(() => {
    document.title = 'Services | TUTY RO Purifier';
    servicesAPI.getAll()
      .then(res => setServices(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Professional RO purifier installation, service, repair, and maintenance — all under one roof.</p>
        </div>
      </section>

      <div className="container section-padding">
        {loading ? <LoadingSpinner /> : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-16)'
            }}>
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>

            {/* Book Service CTA */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-700), var(--primary-900))',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-12)',
              textAlign: 'center',
              color: '#fff'
            }}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
                Ready to Book a Service?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 'var(--space-8)', fontSize: 'var(--font-size-base)' }}>
                Same-day service available. Contact us now for fast, reliable RO purifier care.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg" id="services-wa-btn">
                  <FaWhatsapp size={20} /> Book via WhatsApp
                </a>
                {settings.phone && (
                  <a href={`tel:${settings.phone}`} id="services-phone-btn"
                    className="btn btn-lg"
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}>
                    <FaPhone size={16} /> {settings.phone}
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
