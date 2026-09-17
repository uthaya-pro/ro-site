import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaArrowLeft, FaWhatsapp, FaCheckCircle, FaTint,
  FaMicrochip, FaTag, FaShieldAlt, FaPhone
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import WhatsAppButton from '../../components/common/WhatsAppButton';
import { productsAPI } from '../../services/endpoints';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/helpers';
import './ProductDetail.css';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Crect width='600' height='450' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='20' font-family='sans-serif'%3ERO Purifier%3C/text%3E%3C/svg%3E";

const ProductDetail = () => {
  const { id } = useParams();
  const { settings } = useSettings();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsAPI.getById(id)
      .then(res => {
        setProduct(res.data.data);
        document.title = `${res.data.data.name} | TUTY RO Purifier`;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>← Back to Products</Link>
    </div>
  );

  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/products" className="product-detail__back" id="back-to-products-btn">
          <FaArrowLeft /> Back to Products
        </Link>

        <div className="product-detail__grid">
          {/* Image */}
          <div className="product-detail__image-col">
            <div className="product-detail__image-wrap">
              <img
                src={!imgError && product.image_url ? product.image_url : PLACEHOLDER}
                alt={product.name}
                className="product-detail__image"
                onError={() => setImgError(true)}
              />
              {product.technology && (
                <div className="product-detail__tech-badge">
                  <FaMicrochip size={12} /> {product.technology}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="product-detail__info-col">
            <h1 className="product-detail__name">{product.name}</h1>
            {product.description && (
              <p className="product-detail__desc">{product.description}</p>
            )}

            {/* Specs */}
            <div className="product-detail__specs">
              {product.capacity && (
                <div className="product-detail__spec">
                  <FaTint className="product-detail__spec-icon" />
                  <div>
                    <strong>Capacity</strong>
                    <span>{product.capacity}</span>
                  </div>
                </div>
              )}
              {product.technology && (
                <div className="product-detail__spec">
                  <FaMicrochip className="product-detail__spec-icon" />
                  <div>
                    <strong>Technology</strong>
                    <span>{product.technology}</span>
                  </div>
                </div>
              )}
              <div className="product-detail__spec">
                <FaShieldAlt className="product-detail__spec-icon" />
                <div>
                  <strong>Status</strong>
                  <span className={`badge ${product.is_active ? 'badge-success' : 'badge-error'}`}>
                    {product.is_active ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="product-detail__price-box">
              <FaTag className="product-detail__price-icon" />
              <div>
                <p className="product-detail__price-label">Price</p>
                <p className="product-detail__price">{formatPrice(product.price)}</p>
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="product-detail__features">
                <h3>Key Features</h3>
                <ul>
                  {features.map((f, i) => (
                    <li key={i}><FaCheckCircle className="product-detail__check" /> {f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="product-detail__actions">
              <WhatsAppButton variant="large" productName={product.name} />
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="btn btn-secondary btn-lg product-detail__phone-btn" id="product-phone-btn">
                  <FaPhone size={16} /> Call Us: {settings.phone}
                </a>
              )}
            </div>

            <p className="product-detail__note">
              💡 Get free installation with every purchase. Contact us for bulk pricing and AMC plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
