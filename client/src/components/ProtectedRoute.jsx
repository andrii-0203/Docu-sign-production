import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './ui/LoadingSpinner';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <PageLoader label="Verifying session..." />;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
