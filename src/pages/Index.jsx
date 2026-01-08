import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext.js';

const Index = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;