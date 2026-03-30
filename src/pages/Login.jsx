import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

export default function Login() {
  const { signIn, perfil } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const resposta = await signIn(email, password);
      const tipo = perfil?.tipo || resposta?.user?.user_metadata?.tipo;

      if (tipo == "admin" || tipo == "professor") {
        navigate("/admin");
      } else {
        navigate("/app/dashboard");
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-container login-page">
      <div className="login-card card">
        <div className="login-head">
          <p className="eyebrow">Acesso</p>
          <h1 className="page-title">Entrar</h1>
          <p className="page-subtitle">
            Use seu e-mail e senha para acessar o sistema.
          </p>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {erro && <p className="feedback feedback-error">{erro}</p>}
      </div>
    </section>
  );
}