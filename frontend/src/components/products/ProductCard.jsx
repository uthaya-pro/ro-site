import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaEye, FaTag, FaTint, FaMicrochip, FaCheckCircle } from 'react-icons/fa';
import { formatPrice, buildWhatsAppLink, productWhatsAppMessage } from '../../utils/helpers';
import { useSettings } from '../../context/SettingsContext';
import './ProductCard.css';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='16' font-family='sans-serif'%3ERO Purifier%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product }) => {
  const { settings } = useSettings();
  const [imgError, setImgError] = useState(false);

  const waLink = buildWhatsAppLink(
    settings.whatsapp_number,
    productWhatsAppMessage(product.name)
  );

  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__image-wrap">
        <img
          src={!imgError && product.image_url ? product.image_url : PLACEHOLDER}
          alt={product.name}
          className="product-card__image"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {product.technology && (
          <span className="product-card__tech-badge">
            <FaMicrochip size={10} /> {product.technology}
          </span>
        )}
      </Link>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        {product.description && (
          <p className="product-card__desc">{product.description.substring(0, 90)}...</p>
        )}

        <div className="product-card__specs">
          {product.capacity && (
            <span className="product-card__spec">
              <FaTint size={11} /> {product.capacity}
            </span>
          )}
        </div>

        {features.length > 0 && (
          <ul className="product-card__features">
            {features.slice(0, 3).map((f, i) => (
              <li key={i}><FaCheckCircle className="product-card__check" /> {f}</li>
            ))}
          </ul>
        )}

        <div className="product-card__price">
          <FaTag size={13} className="product-card__price-icon" />
          <span className="product-card__price-value">{formatPrice(product.price)}</span>
        </div>

        <div className="product-card__actions">
          <Link to={`/products/${product.id}`} className="btn btn-secondary btn-sm product-card__view-btn" id={`view-product-${product.id}`}>
            <FaEye size={14} /> View Details
          </Link>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm" id={`wa-product-${product.id}`}>
            <FaWhatsapp size={14} /> Enquire
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
