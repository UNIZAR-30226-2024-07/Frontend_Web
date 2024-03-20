import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import constants from '../constants'


export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to={constants.root + 'inicioSesion'} replace />;
  return <Outlet />;
};