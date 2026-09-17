// Format price to Indian Rupee format
export const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') return 'Contact for Price';
  const num = parseFloat(price);
  if (isNaN(num)) return 'Contact for Price';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Build WhatsApp link with pre-filled message
export const buildWhatsAppLink = (phoneNumber, message = '') => {
  const clean = (phoneNumber || '919876543210').replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${encoded}`;
};

// Build product WhatsApp message
export const productWhatsAppMessage = (productName) =>
  `Hello, I am interested in the ${productName}. Please provide more details.`;

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

// Format datetime
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '…' : text;
};

// Get enquiry status badge class
export const getStatusBadgeClass = (status) => {
  const map = { new: 'badge-info', contacted: 'badge-warning', completed: 'badge-success' };
  return map[status] || 'badge-gray';
};

// Extract API error message
export const getErrorMessage = (err) => {
  return err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
};

// Image URL helper
export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return url;
};
