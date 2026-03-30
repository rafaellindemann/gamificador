import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";

import DashboardAluno from "../pages/app/DashboardAluno";
import Perfil from "../pages/app/Perfil";

import DashboardAdmin from "../pages/admin/DashboardAdmin";
import Desafios from "../pages/admin/Desafios";
import Conquistas from "../pages/admin/Conquistas";
import Usuarios from "../pages/admin/Usuarios";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // element: <DashboardAluno />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },

      {
        path: "app",
        element: <AuthLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardAluno />,
          },
          {
            path: "perfil",
            element: <Perfil />,
          },
        ],
      },

      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <DashboardAdmin />,
          },
          {
            path: "desafios",
            element: <Desafios />,
          },
          {
            path: "conquistas",
            element: <Conquistas />,
          },
          {
            path: "usuarios",
            element: <Usuarios />,
          },
        ],
      },
    ],
  },
]);

export default router;