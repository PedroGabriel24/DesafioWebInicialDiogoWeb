import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [myGrades, setMyGrades] = useState([]);

  useEffect(() => {
    // Na API real, faria um fetch. Aqui pegamos do mock localstorage
    const loadData = async () => {
      const updatedUser = await api.getStudentByMatricula(user.matricula);
      if(updatedUser) setMyGrades(updatedUser.grades || []);
    };
    loadData();
  }, [user.matricula]);

  const calculateAverage = (n1, n2) => {
    if (!n1 || !n2) return "-";
    return ((parseFloat(n1) + parseFloat(n2)) / 2).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Boletim Escolar</h1>
            <p className="text-gray-600">Bem-vindo(a), {user.name} | Matrícula: {user.matricula}</p>
          </div>
          <button onClick={logout} className="text-red-600">Sair</button>
        </header>

        {/* Boletim [cite: 43] */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="p-4">Disciplina</th>
                <th className="p-4">Nota 1</th>
                <th className="p-4">Nota 2</th>
                <th className="p-4">Média Final</th>
                <th className="p-4 w-1/3">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myGrades.length > 0 ? myGrades.map((g, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{g.subject}</td>
                  <td className="p-4">{g.nota1}</td>
                  <td className="p-4">{g.nota2}</td>
                  <td className="p-4 font-bold text-blue-900">
                    {calculateAverage(g.nota1, g.nota2)}
                  </td>
                  <td className="p-4 text-sm text-gray-600 italic">
                    {g.obs || "-"}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Nenhuma nota lançada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}