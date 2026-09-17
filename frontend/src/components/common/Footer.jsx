import { Link } from 'react-router-dom';
import { FaWater, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { buildWhatsAppLink } from '../../utils/helpers';
import './Footer.css';

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const whatsappLink = buildWhatsAppLink(settings.whatsapp_number, 'Hello! I would like to know more about your RO purifier products and services.');

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon"><FaWater /></div>
              <span>{settings.business_name || 'TUTY RO Purifier'}</span>
            </Link>
            <p className="footer__tagline">{settings.tagline || 'Pure Water. Healthy Life.'}</p>
            <p className="footer__desc">
              Your trusted partner for clean, safe, and pure drinking water. Serving Thoothukudi and surrounding areas with quality RO purifier solutions.
            </p>
            <div className="footer__social">
              {settings.whatsapp_number && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="footer__social-btn footer__social-btn--whatsapp" aria-label="WhatsApp">
                  <FaWhatsapp />
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="footer__social-btn footer__social-btn--fb" aria-label="Facebook">
                  <FaFacebook />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="footer__social-btn footer__social-btn--ig" aria-label="Instagram">
                  <FaInstagram />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="footer__social-btn footer__social-btn--yt" aria-label="YouTube">
                  <FaYoutube />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h3 className="footer__col-title">Quick Links</h3>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h3 className="footer__col-title">Our Services</h3>
            <ul className="footer__links">
              <li><Link to="/services">RO Installation</Link></li>
              <li><Link to="/services">RO Service & Maintenance</Link></li>
              <li><Link to="/services">Filter Replacement</Link></li>
              <li><Link to="/services">RO Repair</Link></li>
              <li><Link to="/services">AMC Plans</Link></li>
              <li><Link to="/services">Water Quality Testing</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__col">
            <h3 className="footer__col-title">Contact Us</h3>
            <ul className="footer__contact-list">
              {settings.address && (
                <li>
                  <FaMapMarkerAlt className="footer__contact-icon" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li>
                  <FaPhone className="footer__contact-icon" />
                  <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                </li>
              )}
              {settings.whatsapp_number && (
                <li>
                  <FaWhatsapp className="footer__contact-icon" />
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
                </li>
              )}
              {settings.email && (
                <li>
                  <FaEnvelope className="footer__contact-icon" />
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              )}
              {settings.business_hours && (
                <li>
                  <FaClock className="footer__contact-icon" />
                  <span>{settings.business_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {currentYear} {settings.business_name || 'TUTY RO Purifier'}. All rights reserved.</p>
          <p>Designed for pure water & healthy living.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
