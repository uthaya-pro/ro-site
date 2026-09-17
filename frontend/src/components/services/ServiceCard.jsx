import { Link } from 'react-router-dom';
import { FaTools, FaWrench, FaSlidersH, FaCheckCircle, FaClock } from 'react-icons/fa';
import './ServiceCard.css';

const iconMap = {
  FaTools: FaTools,
  FaWrench: FaWrench,
  FaSlidersH: FaSlidersH,
  FaCheckCircle: FaCheckCircle,
};

const DefaultIcon = FaTools;

const ServiceCard = ({ service }) => {
  const IconComponent = iconMap[service.icon] || DefaultIcon;

  return (
    <div className="service-card">
      <div className="service-card__icon-wrap">
        <IconComponent className="service-card__icon" />
      </div>
      <div className="service-card__body">
        <h3 className="service-card__name">{service.name}</h3>
        {service.description && (
          <p className="service-card__desc">{service.description}</p>
        )}
        {service.price_info && (
          <div className="service-card__price">
            <FaClock size={12} />
            <span>{service.price_info}</span>
          </div>
        )}
        <Link to="/contact" className="service-card__cta">
          Book Service →
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
