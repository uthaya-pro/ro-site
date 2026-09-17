import api from './api';

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  login:  (data) => api.post('/auth/login', data),
  logout: ()     => api.post('/auth/logout'),
  me:     ()     => api.get('/auth/me'),
};

// ── Products ──────────────────────────────────────────────
export const productsAPI = {
  getAll:     ()       => api.get('/products'),
  getById:    (id)     => api.get(`/products/${id}`),
  adminGetAll: ()      => api.get('/products/admin/all'),
  create:     (data)   => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:     (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggle:     (id)     => api.patch(`/products/${id}/toggle`),
  delete:     (id)     => api.delete(`/products/${id}`),
};

// ── Services ──────────────────────────────────────────────
export const servicesAPI = {
  getAll:      ()       => api.get('/services'),
  getById:     (id)     => api.get(`/services/${id}`),
  adminGetAll: ()       => api.get('/services/admin/all'),
  create:      (data)   => api.post('/services', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:      (id, data) => api.put(`/services/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggle:      (id)     => api.patch(`/services/${id}/toggle`),
  delete:      (id)     => api.delete(`/services/${id}`),
};

// ── Enquiries ─────────────────────────────────────────────
export const enquiriesAPI = {
  submit:       (data)  => api.post('/enquiries', data),
  getAll:       (params) => api.get('/enquiries', { params }),
  getById:      (id)    => api.get(`/enquiries/${id}`),
  updateStatus: (id, status) => api.patch(`/enquiries/${id}/status`, { status }),
  delete:       (id)    => api.delete(`/enquiries/${id}`),
};

// ── Settings ──────────────────────────────────────────────
export const settingsAPI = {
  get:    ()     => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

// ── Upload ────────────────────────────────────────────────
export const uploadAPI = {
  image: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

// ── Dashboard ─────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// ── Reports ───────────────────────────────────────────────
export const reportsAPI = {
  products:  ()       => api.get('/reports/products'),
  enquiries: (params) => api.get('/reports/enquiries', { params }),
};

// ── Notifications ─────────────────────────────────────────
export const notificationsAPI = {
  getAll:     (params) => api.get('/notifications', { params }),
  markRead:   (id)     => api.patch(`/notifications/${id}/read`),
  markAllRead: ()      => api.post('/notifications/read-all'),
};
