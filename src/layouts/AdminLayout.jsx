import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
  const { user, perfil, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!perfil || !["professor", "admin"].includes(perfil.tipo)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}