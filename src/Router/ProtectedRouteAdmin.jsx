import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import constants from '../constants'


export const ProtectedRouteAdmin = () => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  
  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !isAdmin && !loading) return <Navigate to={constants.root + 'PageLogin'} replace />;
  return <Outlet />;
};