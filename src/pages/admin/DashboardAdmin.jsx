import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./DashboardAdmin.css";

export default function DashboardAdmin() {
  const { perfil, signOut } = useAuth();

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="page-container admin-page">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Painel administrativo</p>
          <h1 className="page-title">Controle geral</h1>
          <p className="page-subtitle">
            Bem-vindo, {perfil?.nome || "usuário"}.
          </p>
        </div>

        <button className="btn-danger" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <div className="grid-3 admin-links">
        <Link to="/admin/usuarios" className="admin-link-card card">
          <h2>Usuários</h2>
          <p>Gerencie alunos, professores e administradores.</p>
        </Link>

        <Link to="/admin/desafios" className="admin-link-card card">
          <h2>Desafios</h2>
          <p>Cadastre e mantenha o catálogo de desafios.</p>
        </Link>

        <Link to="/admin/conquistas" className="admin-link-card card">
          <h2>Conquistas</h2>
          <p>Lance pontuações e acompanhe o histórico.</p>
        </Link>
      </div>
    </section>
  );
}