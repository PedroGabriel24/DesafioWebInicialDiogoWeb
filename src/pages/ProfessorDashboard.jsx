import { useAuth } from "../context/useAuth.jsx";

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Área do Professor</h2>
      <p>Disciplina: {user.disciplina}</p>

      <button onClick={logout}>Sair</button>
    </div>
  );
}
