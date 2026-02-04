import { useAuth } from "../context/useAuth.jsx";

export default function AlunoDashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Área do Aluno</h2>
      <p>Bem-vindo, {user.nome}</p>

      <button onClick={logout}>Sair</button>
    </div>
  );
}
