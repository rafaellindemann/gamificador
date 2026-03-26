import { useAuth } from "../../contexts/AuthContext";

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
    <main>
      <h1>Dashboard do Aluno</h1>

      <p>Auth email: {user?.email}</p>
      <p>Nome: {perfil?.nome}</p>
      <p>Matrícula: {perfil?.matricula}</p>
      <p>Tipo: {perfil?.tipo}</p>

      <button onClick={handleLogout}>Sair</button>
    </main>
  );
}