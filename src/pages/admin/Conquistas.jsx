import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";
import "./Conquistas.css";

export default function Conquistas() {
  const { perfil } = useAuth();

  const [alunos, setAlunos] = useState([]);
  const [desafios, setDesafios] = useState([]);
  const [conquistas, setConquistas] = useState([]);

  const [alunoId, setAlunoId] = useState("");
  const [desafioId, setDesafioId] = useState("");
  const [observacao, setObservacao] = useState("");

  const [loadingTela, setLoadingTela] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoadingTela(true);
    setErro("");

    try {
      await Promise.all([
        buscarAlunos(),
        buscarDesafios(),
        buscarConquistas(),
      ]);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar dados.");
    } finally {
      setLoadingTela(false);
    }
  }

  async function buscarAlunos() {
    const { data, error } = await supabase
      .from("gam_usuarios")
      .select("id, nome, matricula")
      .eq("tipo", "aluno")
      .eq("ativo", true)
      .order("nome");

    if (error) throw error;

    setAlunos(data || []);
  }

  async function buscarDesafios() {
    const { data, error } = await supabase
      .from("gam_desafios")
      .select("id, titulo, pontos, ativo")
      .eq("ativo", true)
      .order("titulo");

    if (error) throw error;

    setDesafios(data || []);
  }

  async function buscarConquistas() {
    const { data, error } = await supabase
      .from("gam_conquistas")
      .select(`
        id,
        pontos_obtidos,
        observacao,
        data_realizacao,
        aluno:gam_usuarios!gam_conquistas_aluno_id_fkey (
          id,
          nome,
          matricula
        ),
        desafio:gam_desafios!gam_conquistas_desafio_id_fkey (
          id,
          titulo
        ),
        registrante:gam_usuarios!gam_conquistas_registrado_por_fkey (
          id,
          nome
        )
      `)
      .order("data_realizacao", { ascending: false });

    if (error) throw error;

    setConquistas(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!alunoId || !desafioId) {
      setErro("Selecione um aluno e um desafio.");
      return;
    }

    setSalvando(true);

    try {
      const desafioSelecionado = desafios.find((d) => d.id == desafioId);

      if (!desafioSelecionado) {
        throw new Error("Desafio não encontrado.");
      }

      const payload = {
        aluno_id: Number(alunoId),
        desafio_id: Number(desafioId),
        pontos_obtidos: desafioSelecionado.pontos,
        observacao: observacao.trim() || null,
        registrado_por: perfil?.id || null,
      };

      const { error } = await supabase
        .from("gam_conquistas")
        .insert(payload);

      if (error) throw error;

      setAlunoId("");
      setDesafioId("");
      setObservacao("");
      setSucesso("Conquista lançada com sucesso.");

      await buscarConquistas();
    } catch (error) {
      console.error(error);
      setErro(error.message || "Erro ao salvar conquista.");
    } finally {
      setSalvando(false);
    }
  }

  function formatarData(dataIso) {
    if (!dataIso) return "";
    return new Date(dataIso).toLocaleString("pt-BR");
  }

  if (loadingTela) {
    return (
      <section className="conquistas-page">
        <div className="conquistas-loading">Carregando...</div>
      </section>
    );
  }

  return (
    <section className="conquistas-page">
      <div className="conquistas-header">
        <div>
          <p className="conquistas-eyebrow">Painel administrativo</p>
          <h1>Conquistas</h1>
          <p className="conquistas-subtitle">
            Lance novas pontuações e acompanhe o histórico dos alunos.
          </p>
        </div>
      </div>

      <div className="conquistas-layout">
        <div className="card">
          <h2>Lançar conquista</h2>

          <form className="conquistas-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="aluno">Aluno</label>
              <select
                id="aluno"
                value={alunoId}
                onChange={(e) => setAlunoId(e.target.value)}
              >
                <option value="">Selecione</option>
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome} - {aluno.matricula}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="desafio">Desafio</label>
              <select
                id="desafio"
                value={desafioId}
                onChange={(e) => setDesafioId(e.target.value)}
              >
                <option value="">Selecione</option>
                {desafios.map((desafio) => (
                  <option key={desafio.id} value={desafio.id}>
                    {desafio.titulo} - {desafio.pontos} pts
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="observacao">Observação</label>
              <textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows="5"
                placeholder="Anote algum contexto sobre esse lançamento..."
              />
            </div>

            <button className="btn-primary" type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Lançar conquista"}
            </button>
          </form>

          {erro && <p className="feedback feedback-error">{erro}</p>}
          {sucesso && <p className="feedback feedback-success">{sucesso}</p>}
        </div>

        <div className="card">
          <div className="historico-header">
            <h2>Histórico</h2>
            <span className="historico-badge">
              {conquistas.length} registro{conquistas.length != 1 ? "s" : ""}
            </span>
          </div>

          {conquistas.length == 0 ? (
            <p className="historico-vazio">Nenhuma conquista cadastrada.</p>
          ) : (
            <div className="historico-lista">
              {conquistas.map((conquista) => (
                <article key={conquista.id} className="historico-item">
                  <div className="historico-topo">
                    <div>
                      <h3>{conquista.aluno?.nome}</h3>
                      <p className="historico-desafio">
                        {conquista.desafio?.titulo}
                      </p>
                    </div>

                    <div className="historico-pontos">
                      +{conquista.pontos_obtidos} pts
                    </div>
                  </div>

                  <div className="historico-meta">
                    <span>{formatarData(conquista.data_realizacao)}</span>
                    {conquista.registrante?.nome && (
                      <span>Lançado por: {conquista.registrante.nome}</span>
                    )}
                  </div>

                  {conquista.observacao && (
                    <p className="historico-observacao">
                      {conquista.observacao}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}