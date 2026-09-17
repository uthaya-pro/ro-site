import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage text="Authenticating..." />;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
