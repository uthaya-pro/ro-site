import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/common/PrivateRoute';

// Public Pages
import HomePage        from './pages/public/HomePage';
import ProductsPage    from './pages/public/ProductsPage';
import ProductDetail   from './pages/public/ProductDetail';
import ServicesPage    from './pages/public/ServicesPage';
import ContactPage     from './pages/public/ContactPage';

// Admin Pages
import AdminLogin      from './pages/admin/AdminLogin';
import Dashboard       from './pages/admin/Dashboard';
import AdminProducts   from './pages/admin/AdminProducts';
import ProductForm     from './pages/admin/ProductForm';
import AdminServices   from './pages/admin/AdminServices';
import ServiceForm     from './pages/admin/ServiceForm';
import AdminEnquiries  from './pages/admin/AdminEnquiries';
import EnquiryDetail   from './pages/admin/EnquiryDetail';
import AdminReports    from './pages/admin/AdminReports';
import AdminSettings   from './pages/admin/AdminSettings';
import AdminNotifications from './pages/admin/AdminNotifications';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
            error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
          }}
        />
        <Routes>
          {/* ── Public Routes ── */}
          <Route element={<PublicLayout />}>
            <Route path="/"          element={<HomePage />} />
            <Route path="/products"  element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/services"  element={<ServicesPage />} />
            <Route path="/contact"   element={<ContactPage />} />
          </Route>

          {/* ── Admin Login (no layout) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Protected Admin Routes ── */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"              element={<Dashboard />} />
            <Route path="products"               element={<AdminProducts />} />
            <Route path="products/new"           element={<ProductForm />} />
            <Route path="products/:id/edit"      element={<ProductForm />} />
            <Route path="services"               element={<AdminServices />} />
            <Route path="services/new"           element={<ServiceForm />} />
            <Route path="services/:id/edit"      element={<ServiceForm />} />
            <Route path="enquiries"              element={<AdminEnquiries />} />
            <Route path="enquiries/:id"          element={<EnquiryDetail />} />
            <Route path="reports"                element={<AdminReports />} />
            <Route path="settings"               element={<AdminSettings />} />
            <Route path="notifications"          element={<AdminNotifications />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
