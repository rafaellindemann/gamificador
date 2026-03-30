import { NavLink, Outlet } from "react-router-dom";
import "./RootLayout.css";

export default function RootLayout() {
  return (
    <div className="page-shell">
      <header className="root-header">
        <div className="page-container root-header-inner">
          <div className="brand-box">
            <p className="brand-kicker">Sistema</p>
            <h1 className="brand-title">Gamificador</h1>
          </div>

          <nav className="root-nav">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>

            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>

            <NavLink to="/app/dashboard" className="nav-link">
              Aluno
            </NavLink>

            <NavLink to="/admin" className="nav-link">
              Admin
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}