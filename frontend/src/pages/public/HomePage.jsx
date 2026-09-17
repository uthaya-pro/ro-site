import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShieldAlt, FaTint, FaMedal, FaHeadset, FaTools, FaCheckCircle,
  FaWhatsapp, FaPhone, FaStar, FaArrowRight, FaWater
} from 'react-icons/fa';
import ProductCard from '../../components/products/ProductCard';
import ServiceCard from '../../components/services/ServiceCard';
import { productsAPI, servicesAPI } from '../../services/endpoints';
import { useSettings } from '../../context/SettingsContext';
import { buildWhatsAppLink } from '../../utils/helpers';
import './HomePage.css';

const WHY_CHOOSE = [
  { icon: FaShieldAlt, title: '100% Genuine Products',    desc: 'We stock only certified RO purifiers from trusted brands with full warranty.' },
  { icon: FaMedal,     title: 'Expert Technicians',        desc: 'Our certified technicians have 10+ years of RO installation and repair experience.' },
  { icon: FaHeadset,   title: '24/7 Customer Support',    desc: 'Reach us anytime. Same-day service available in Thoothukudi and nearby areas.' },
  { icon: FaTint,      title: 'Water Quality Testing',     desc: 'Free TDS and quality testing to help you choose the perfect purifier.' },
  { icon: FaTools,     title: 'All Brands Serviced',      desc: 'We install, service and repair all major RO purifier brands.' },
  { icon: FaStar,      title: 'Affordable Pricing',       desc: 'Best prices guaranteed. Flexible AMC plans to suit every budget.' },
];

const BENEFITS = [
  '✓ Remove 99% bacteria and viruses',
  '✓ Eliminate dissolved salts & heavy metals',
  '✓ Retain essential minerals',
  '✓ Crystal-clear, odour-free water',
  '✓ Smart auto shut-off protection',
  '✓ Reduce risk of waterborne diseases',
];

const STATS = [
  { value: '500+', label: 'Happy Customers' },
  { value: '10+',  label: 'Years Experience' },
  { value: '15+',  label: 'Service Areas' },
  { value: '24/7', label: 'Support Available' },
];

const HomePage = () => {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const waLink = buildWhatsAppLink(settings.whatsapp_number, 'Hello! I would like to know more about your RO purifier products and services.');

  useEffect(() => {
    Promise.all([productsAPI.getAll(), servicesAPI.getAll()])
      .then(([pRes, sRes]) => {
        setProducts(pRes.data.data?.slice(0, 3) || []);
        setServices(sRes.data.data?.slice(0, 3) || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div className="hero__bg-shapes">
          <div className="hero__shape hero__shape--1"></div>
          <div className="hero__shape hero__shape--2"></div>
          <div className="hero__shape hero__shape--3"></div>
        </div>
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__eyebrow">
              <FaWater /> Trusted RO Purifier Experts
            </div>
            <h1 className="hero__title">
              Pure Water for a <span className="hero__title-highlight">Healthier Life</span>
            </h1>
            <p className="hero__subtitle">
              {settings.business_name} delivers premium RO purifier solutions — sales, installation, service and repair — right at your doorstep in Thoothukudi.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-explore-btn">
                Explore Products <FaArrowRight size={16} />
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg" id="hero-whatsapp-btn">
                <FaWhatsapp size={20} /> Chat on WhatsApp
              </a>
            </div>
            <div className="hero__trust">
              {['Certified Technicians', 'Same-Day Service', 'Free Water Testing'].map(t => (
                <span key={t} className="hero__trust-item"><FaCheckCircle /> {t}</span>
              ))}
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__visual-card">
              <div className="hero__visual-icon"><FaTint /></div>
              <div className="hero__visual-stat">
                <strong>99.9%</strong>
                <span>Purification Rate</span>
              </div>
            </div>
            <div className="hero__drop-container">
              <div className="hero__drop"></div>
              <div className="hero__drop-ring hero__drop-ring--1"></div>
              <div className="hero__drop-ring hero__drop-ring--2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-bar">
        <div className="container stats-bar__grid">
          {STATS.map(s => (
            <div key={s.label} className="stats-bar__item">
              <strong className="stats-bar__value">{s.value}</strong>
              <span className="stats-bar__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS HIGHLIGHT ── */}
      <section className="section-padding" id="products-highlight">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Products</span>
            <h2 className="section-title">Premium RO Purifiers</h2>
            <p className="section-subtitle">
              Choose from our range of advanced RO water purifiers, engineered for maximum purification and longevity.
            </p>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="section-cta">
            <Link to="/products" className="btn btn-primary btn-lg" id="view-all-products-btn">
              View All Products <FaArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES HIGHLIGHT ── */}
      <section className="section-padding services-section" id="services-highlight">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Services</span>
            <h2 className="section-title">Complete RO Care Solutions</h2>
            <p className="section-subtitle">
              From installation to annual maintenance, we offer end-to-end RO purifier services you can rely on.
            </p>
          </div>
          {loading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : (
            <div className="services-grid">
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
          <div className="section-cta">
            <Link to="/services" className="btn btn-secondary btn-lg" id="view-all-services-btn">
              View All Services <FaArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section-padding why-section" id="why-choose-us">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title">The {settings.business_name} Advantage</h2>
            <p className="section-subtitle">
              We're not just a shop — we're your long-term water purification partner.
            </p>
          </div>
          <div className="why-grid">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="why-card">
                <div className="why-card__icon"><Icon /></div>
                <h3 className="why-card__title">{title}</h3>
                <p className="why-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS BANNER ── */}
      <section className="benefits-banner section-padding" id="benefits">
        <div className="container benefits-banner__inner">
          <div className="benefits-banner__content">
            <span className="section-label" style={{ color: 'var(--primary-300)' }}>Health Benefits</span>
            <h2 className="benefits-banner__title">Why Your Family Needs Pure Water</h2>
            <p className="benefits-banner__subtitle">
              Impure water is invisible danger. An RO purifier is not an expense — it's an investment in your family's health.
            </p>
            <ul className="benefits-list">
              {BENEFITS.map(b => <li key={b}>{b}</li>)}
            </ul>
            <div className="benefits-banner__actions">
              <Link to="/contact" className="btn btn-primary btn-lg" id="benefits-contact-btn">
                Get Free Water Test
              </Link>
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="btn btn-secondary btn-lg benefits-phone-btn" id="benefits-phone-btn">
                  <FaPhone size={16} /> {settings.phone}
                </a>
              )}
            </div>
          </div>
          <div className="benefits-banner__graphic">
            <div className="benefits-banner__circle benefits-banner__circle--1"></div>
            <div className="benefits-banner__circle benefits-banner__circle--2"></div>
            <div className="benefits-banner__stats-card">
              <div className="benefits-banner__stat">
                <strong>99.9%</strong><span>Purification</span>
              </div>
              <div className="benefits-banner__stat">
                <strong>0</strong><span>Bacteria</span>
              </div>
              <div className="benefits-banner__stat">
                <strong>100%</strong><span>Safe Water</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner section-padding-sm" id="cta">
        <div className="container cta-banner__inner">
          <div>
            <h2 className="cta-banner__title">Ready for Clean, Pure Water?</h2>
            <p className="cta-banner__subtitle">Contact us today for free water testing and expert advice.</p>
          </div>
          <div className="cta-banner__actions">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg" id="cta-whatsapp-btn">
              <FaWhatsapp size={20} /> WhatsApp Us Now
            </a>
            <Link to="/contact" className="btn btn-primary btn-lg" id="cta-contact-btn">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
