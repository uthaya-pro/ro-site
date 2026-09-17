import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { buildWhatsAppLink } from '../../utils/helpers';
import './WhatsAppButton.css';

const WhatsAppButton = ({ message, productName, variant = 'floating' }) => {
  const { settings } = useSettings();

  const defaultMsg = productName
    ? `Hello, I am interested in the ${productName}. Please provide more details.`
    : 'Hello! I would like to know more about your RO purifier products and services.';

  const link = buildWhatsAppLink(settings.whatsapp_number, message || defaultMsg);

  if (variant === 'inline') {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp whatsapp-btn-inline"
        id="whatsapp-enquire-btn"
      >
        <FaWhatsapp size={20} />
        Enquire on WhatsApp
      </a>
    );
  }

  if (variant === 'large') {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp btn-lg whatsapp-btn-large"
        id="whatsapp-large-btn"
      >
        <FaWhatsapp size={22} />
        Enquire / Purchase on WhatsApp
      </a>
    );
  }

  // Floating button
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
      id="whatsapp-float-btn"
    >
      <FaWhatsapp size={28} />
      <span className="whatsapp-float__tooltip">Chat with us!</span>
    </a>
  );
};

export default WhatsAppButton;
