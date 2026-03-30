import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

export default function Desafios() {
  const [desafios, setDesafios] = useState([]);

  useEffect(() => {
    async function fetchDesafios() {
      const { data, error } = await supabase
        .from("gam_desafios")
        .select("id, titulo, pontos, ativo")
        .order("titulo");

      if (error) {
        console.error(error);
        return;
      }

      setDesafios(data || []);
    }

    fetchDesafios();
  }, []);

  return (
    <section className="page-container stack">
      <div>
        <p className="eyebrow">Administração</p>
        <h1 className="page-title">Desafios</h1>
        <p className="page-subtitle">Catálogo inicial de desafios ativos e inativos.</p>
      </div>

      <div className="card">
        <div className="table-like-list">
          {desafios.map((d) => (
            <article key={d.id} className="table-like-item">
              <h3>{d.titulo}</h3>
              <p><strong>Pontos:</strong> {d.pontos}</p>
              <span className={`badge ${d.ativo ? "badge-success" : "badge-info"}`}>
                {d.ativo ? "Ativo" : "Inativo"}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}