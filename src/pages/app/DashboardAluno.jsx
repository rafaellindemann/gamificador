import { useAuth } from "../../contexts/AuthContext";
import "./DashboardAluno.css";

export default function DashboardAluno() {
  const { user, perfil, signOut } = useAuth();

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="page-container aluno-page">
      <div className="aluno-head">
        <div>
          <p className="eyebrow">Área do aluno</p>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Acompanhe seu perfil e suas informações principais.
          </p>
        </div>

        <button className="btn-danger" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <div className="grid-3">
        <article className="card stat-card">
          <span className="stat-label">Nome</span>
          <strong>{perfil?.nome || "-"}</strong>
        </article>

        <article className="card stat-card">
          <span className="stat-label">Matrícula</span>
          <strong>{perfil?.matricula || "-"}</strong>
        </article>

        <article className="card stat-card">
          <span className="stat-label">Tipo</span>
          <strong>{perfil?.tipo || "-"}</strong>
        </article>
      </div>

      <div className="card">
        <h2>Dados de acesso</h2>
        <p><strong>Email do auth:</strong> {user?.email || "-"}</p>
        <p><strong>Último login:</strong> {perfil?.ultimo_login_em || "Ainda não registrado"}</p>
      </div>
    </section>
  );
}