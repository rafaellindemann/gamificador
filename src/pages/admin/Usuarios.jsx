import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../services/supabase";
import "./Usuarios.css";

const estadoInicialForm = {
  id: null,
  nome: "",
  matricula: "",
  email: "",
  turma_id: "",
  tipo: "aluno",
  ativo: true,
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [turmas, setTurmas] = useState([]);

  const [form, setForm] = useState(estadoInicialForm);
  const [busca, setBusca] = useState("");

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const editando = form.id != null;

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    setErro("");

    try {
      const [usuariosRes, turmasRes] = await Promise.all([
        supabase
          .from("gam_usuarios")
          .select(`
            id,
            nome,
            matricula,
            email,
            turma_id,
            tipo,
            ativo,
            ultimo_login_em,
            gam_turmas (
              id,
              nome,
              codigo
            )
          `)
          .order("nome"),
        supabase
          .from("gam_turmas")
          .select("id, nome, codigo")
          .eq("ativo", true)
          .order("nome"),
      ]);

      if (usuariosRes.error) throw usuariosRes.error;
      if (turmasRes.error) throw turmasRes.error;

      setUsuarios(usuariosRes.data || []);
      setTurmas(turmasRes.data || []);
    } catch (error) {
      console.error(error);
      setErro(error.message || "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  function atualizarCampo(e) {
    const { name, value, type, checked } = e.target;

    setForm((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: type == "checkbox" ? checked : value,
    }));
  }

  function limparForm() {
    setForm(estadoInicialForm);
    setErro("");
    setSucesso("");
  }

  function iniciarEdicao(usuario) {
    setErro("");
    setSucesso("");

    setForm({
      id: usuario.id,
      nome: usuario.nome || "",
      matricula: usuario.matricula || "",
      email: usuario.email || "",
      turma_id: usuario.turma_id || "",
      tipo: usuario.tipo || "aluno",
      ativo: usuario.ativo,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!form.nome.trim() || !form.matricula.trim() || !form.email.trim()) {
      setErro("Preencha nome, matrícula e email.");
      return;
    }

    setSalvando(true);

    const payload = {
      nome: form.nome.trim(),
      matricula: form.matricula.trim(),
      email: form.email.trim().toLowerCase(),
      turma_id: form.turma_id ? Number(form.turma_id) : null,
      tipo: form.tipo,
      ativo: form.ativo,
    };

    try {
      if (editando) {
        const { error } = await supabase
          .from("gam_usuarios")
          .update(payload)
          .eq("id", form.id);

        if (error) throw error;

        setSucesso("Usuário atualizado com sucesso.");
      } else {
        const { error } = await supabase
          .from("gam_usuarios")
          .insert(payload);

        if (error) throw error;

        setSucesso("Usuário criado com sucesso.");
      }

      limparForm();
      await carregarDados();
    } catch (error) {
      console.error(error);
      setErro(error.message || "Erro ao salvar usuário.");
    } finally {
      setSalvando(false);
    }
  }

  async function alternarAtivo(usuario) {
    setErro("");
    setSucesso("");

    try {
      const { error } = await supabase
        .from("gam_usuarios")
        .update({ ativo: !usuario.ativo })
        .eq("id", usuario.id);

      if (error) throw error;

      setSucesso(
        usuario.ativo
          ? "Usuário inativado com sucesso."
          : "Usuário ativado com sucesso."
      );

      await carregarDados();
    } catch (error) {
      console.error(error);
      setErro(error.message || "Erro ao alterar status do usuário.");
    }
  }

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return usuarios;

    return usuarios.filter((usuario) => {
      const nome = usuario.nome?.toLowerCase() || "";
      const matricula = usuario.matricula?.toLowerCase() || "";
      const email = usuario.email?.toLowerCase() || "";
      const tipo = usuario.tipo?.toLowerCase() || "";

      return (
        nome.includes(termo) ||
        matricula.includes(termo) ||
        email.includes(termo) ||
        tipo.includes(termo)
      );
    });
  }, [usuarios, busca]);

  function formatarData(dataIso) {
    if (!dataIso) return "Nunca";
    return new Date(dataIso).toLocaleString("pt-BR");
  }

  return (
    <section className="page-container usuarios-page">
      <div>
        <p className="eyebrow">Administração</p>
        <h1 className="page-title">Usuários</h1>
        <p className="page-subtitle">
          Cadastre, edite e acompanhe os usuários do sistema.
        </p>
      </div>

      <div className="usuarios-layout">
        <div className="card">
          <div className="usuarios-card-head">
            <h2>{editando ? "Editar usuário" : "Novo usuário"}</h2>

            {editando && (
              <button
                type="button"
                className="btn-secondary"
                onClick={limparForm}
              >
                Cancelar edição
              </button>
            )}
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                value={form.nome}
                onChange={atualizarCampo}
                placeholder="Nome completo"
              />
            </div>

            <div className="usuarios-form-grid-2">
              <div className="form-group">
                <label htmlFor="matricula">Matrícula</label>
                <input
                  id="matricula"
                  name="matricula"
                  value={form.matricula}
                  onChange={atualizarCampo}
                  placeholder="Ex: 2026001"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={atualizarCampo}
                >
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={atualizarCampo}
                placeholder="email@dominio.com"
              />
            </div>

            <div className="usuarios-form-grid-2">
              <div className="form-group">
                <label htmlFor="turma_id">Turma</label>
                <select
                  id="turma_id"
                  name="turma_id"
                  value={form.turma_id}
                  onChange={atualizarCampo}
                >
                  <option value="">Sem turma</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              </div>

              <label className="usuarios-checkbox">
                <input
                  type="checkbox"
                  name="ativo"
                  checked={form.ativo}
                  onChange={atualizarCampo}
                />
                <span>Usuário ativo</span>
              </label>
            </div>

            <button className="btn-primary" type="submit" disabled={salvando}>
              {salvando
                ? editando
                  ? "Atualizando..."
                  : "Salvando..."
                : editando
                ? "Atualizar usuário"
                : "Criar usuário"}
            </button>
          </form>

          {erro && <p className="feedback feedback-error">{erro}</p>}
          {sucesso && <p className="feedback feedback-success">{sucesso}</p>}
        </div>

        <div className="card">
          <div className="usuarios-card-head">
            <h2>Lista de usuários</h2>
            <span className="badge badge-info">
              {usuariosFiltrados.length} registro
              {usuariosFiltrados.length != 1 ? "s" : ""}
            </span>
          </div>

          <div className="form-group usuarios-busca">
            <label htmlFor="busca">Buscar</label>
            <input
              id="busca"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome, matrícula, email ou tipo..."
            />
          </div>

          {loading ? (
            <p className="empty-state">Carregando usuários...</p>
          ) : usuariosFiltrados.length == 0 ? (
            <p className="empty-state">Nenhum usuário encontrado.</p>
          ) : (
            <div className="table-like-list">
              {usuariosFiltrados.map((usuario) => (
                <article key={usuario.id} className="table-like-item">
                  <div className="usuario-item-topo">
                    <div>
                      <h3>{usuario.nome}</h3>
                      <p className="usuario-item-sub">
                        {usuario.email}
                      </p>
                    </div>

                    <div className="usuario-badges">
                      <span className="badge badge-info">{usuario.tipo}</span>
                      <span
                        className={`badge ${
                          usuario.ativo ? "badge-success" : "badge-info"
                        }`}
                      >
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>

                  <div className="usuario-meta">
                    <span><strong>Matrícula:</strong> {usuario.matricula}</span>
                    <span>
                      <strong>Turma:</strong>{" "}
                      {usuario.gam_turmas?.nome || "Sem turma"}
                    </span>
                    <span>
                      <strong>Último login:</strong>{" "}
                      {formatarData(usuario.ultimo_login_em)}
                    </span>
                  </div>

                  <div className="usuario-acoes">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => iniciarEdicao(usuario)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className={usuario.ativo ? "btn-danger" : "btn-primary"}
                      onClick={() => alternarAtivo(usuario)}
                    >
                      {usuario.ativo ? "Inativar" : "Ativar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}