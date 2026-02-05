import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [matriculaBusca, setMatriculaBusca] = useState('');
  const [student, setStudent] = useState(null);
  
  // Estados para lançamento [cite: 49, 51, 62]
  const [grades, setGrades] = useState({ nota1: '', nota2: '', obs: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    const found = await api.getStudentByMatricula(matriculaBusca);
    if (found) {
      setStudent(found);
      // Carrega notas existentes se houver
      const existing = found.grades.find(g => g.subject === user.subject);
      if (existing) setGrades(existing);
      else setGrades({ nota1: '', nota2: '', obs: '' });
    } else {
      alert("Aluno não encontrado.");
      setStudent(null);
    }
  };

  const handleSave = async () => {
    await api.updateGrades(student.matricula, user.subject, grades);
    alert("Notas salvas com sucesso!");
    setStudent(null); 
    setMatriculaBusca('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Portal do Professor</h1>
            <p className="text-gray-600">Disciplina: <strong>{user.subject}</strong></p>
          </div>
          <button onClick={logout} className="text-red-600">Sair</button>
        </header>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h3 className="font-bold text-lg mb-4">Buscar Aluno</h3>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input 
              value={matriculaBusca}
              onChange={e => setMatriculaBusca(e.target.value)}
              placeholder="Digite a Matrícula do aluno..."
              className="flex-1 border p-2 rounded"
            />
            <button type="submit" className="bg-blue-800 text-white px-6 py-2 rounded">Buscar</button>
          </form>
        </div>

        {student && (
          <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
            <h3 className="font-bold text-xl mb-4">Aluno: {student.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nota 1</label>
                <input 
                  type="number" step="0.1" max="10"
                  value={grades.nota1}
                  onChange={e => setGrades({...grades, nota1: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Nota 2</label>
                <input 
                  type="number" step="0.1" max="10"
                  value={grades.nota2}
                  onChange={e => setGrades({...grades, nota2: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Observações</label>
              <textarea 
                value={grades.obs}
                onChange={e => setGrades({...grades, obs: e.target.value})}
                className="w-full border p-2 rounded h-24"
                placeholder="Ex: Aluno participativo..."
              ></textarea>
            </div>

            <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Salvar Notas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}