import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone, FaWater } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import './Navbar.css';

const Navbar = () => {
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/',          label: 'Home' },
    { to: '/products',  label: 'Products' },
    { to: '/services',  label: 'Services' },
    { to: '/contact',   label: 'Contact' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon"><FaWater /></div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">{settings.business_name || 'TUTY RO Purifier'}</span>
            <span className="navbar__logo-tagline">{settings.tagline || 'Pure Water. Healthy Life.'}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="navbar__actions">
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="navbar__phone">
              <FaPhone size={14} />
              <span>{settings.phone}</span>
            </a>
          )}
          <Link to="/contact" className="btn btn-primary btn-sm">Get Quote</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-btn"
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <nav className="navbar__mobile-nav">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Get a Free Quote
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
