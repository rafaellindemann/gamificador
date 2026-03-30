import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return <Outlet />;
}



// relaxado para testar o app antes do sistema de autenticação estar pronto

// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// export default function AuthLayout() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <p>Carregando...</p>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// }