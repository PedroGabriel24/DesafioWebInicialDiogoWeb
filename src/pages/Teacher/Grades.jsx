import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function TeacherGrades() {
  const { user } = useAuth();
  const [matricula, setMatricula] = useState('');
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState({ nota1: '', nota2: '', obs: '' });
  const [msg, setMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setMsg('');
    const found = await api.getStudentByMatricula(matricula);
    if (found) {
      setStudent(found);
      const existing = found.grades.find(g => g.subject === user.subject);
      setGrades(existing || { nota1: '', nota2: '', obs: '' });
    } else {
      setMsg('Aluno não encontrado com esta matrícula.');
      setStudent(null);
    }
  };

  const handleSave = async () => {
    await api.updateGrades(student.matricula, user.subject, grades);
    setMsg('✅ Notas salvas com sucesso!');
    setTimeout(() => setMsg(''), 3000);
  };

  // Cálculo dinâmico para preview
  const media = ((parseFloat(grades.nota1 || 0) + parseFloat(grades.nota2 || 0)) / 2).toFixed(1);
  const statusColor = media >= 7 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  const statusText = media >= 7 ? 'Aprovado' : 'Reprovado';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Lançamento de Notas</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula do Aluno</label>
            <input 
              value={matricula}
              onChange={e => setMatricula(e.target.value)}
              placeholder="Ex: 202401"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <button type="submit" className="bg-blue-800 text-white px-8 py-2.5 rounded-lg hover:bg-blue-900 font-medium transition shadow-md">
            Buscar
          </button>
        </form>
        {msg && <p className="mt-3 text-sm font-medium text-blue-600">{msg}</p>}
      </div>

      {student && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
             <div>
               <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
               <p className="text-sm text-gray-500">Matrícula: {student.matricula}</p>
             </div>
             <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${grades.nota1 && grades.nota2 ? statusColor : 'bg-gray-200 text-gray-500'}`}>
                {grades.nota1 && grades.nota2 ? `Média: ${media} • ${statusText}` : 'Pendente'}
             </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Nota 1ª Unidade</label>
                   <input type="number" step="0.1" max="10" 
                     className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold text-lg"
                     value={grades.nota1} onChange={e => setGrades({...grades, nota1: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Nota 2ª Unidade</label>
                   <input type="number" step="0.1" max="10" 
                     className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold text-lg"
                     value={grades.nota2} onChange={e => setGrades({...grades, nota2: e.target.value})}
                   />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Observações Pedagógicas</label>
              <textarea 
                className="w-full border p-3 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Descreva o desempenho do aluno..."
                value={grades.obs} onChange={e => setGrades({...grades, obs: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-md transition transform active:scale-95">
              Salvar Boletim
            </button>
          </div>
        </div>
      )}
    </div>
  );
}