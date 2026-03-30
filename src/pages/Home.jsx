import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <section className="page-container home-page">
      <div className="home-hero card">
        <p className="eyebrow">Gamificação semestral</p>
        <h1 className="page-title">Pontuação, desafios e conquistas em um só lugar.</h1>
        <p className="page-subtitle">
          Acompanhe o desempenho dos alunos, registre conquistas e organize o
          semestre com uma experiência simples e bonita.
        </p>

        <div className="home-actions">
          <Link to="/login" className="btn-primary">
            Entrar no sistema
          </Link>

          <Link to="/app/dashboard" className="btn-secondary">
            Ver dashboard
          </Link>
        </div>
      </div>

      <div className="grid-3 home-cards">
        <article className="card">
          <h2>Área do aluno</h2>
          <p>
            Consulta de pontuação, perfil, histórico e acompanhamento individual.
          </p>
        </article>

        <article className="card">
          <h2>Painel admin</h2>
          <p>
            Cadastro de usuários, desafios, categorias, turmas e lançamento de
            conquistas.
          </p>
        </article>

        <article className="card">
          <h2>Base segura</h2>
          <p>
            Supabase com autenticação, RLS e estrutura pronta para crescer sem
            gambiarra.
          </p>
        </article>
      </div>
    </section>
  );
}