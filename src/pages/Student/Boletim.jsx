import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function StudentBoletim() {
  const { user } = useAuth();
  const [myGrades, setMyGrades] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const updatedUser = await api.getStudentByMatricula(user.matricula);
      if(updatedUser) setMyGrades(updatedUser.grades || []);
    };
    loadData();
  }, [user]);

  const calcMedia = (n1, n2) => {
    if(!n1 || !n2) return null;
    return ((parseFloat(n1) + parseFloat(n2)) / 2).toFixed(1);
  };

  return (
    <div className="space-y-8">
      {/* Header Aluno */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-blue-900">Boletim Escolar 2024</h1>
           <p className="text-gray-500">Acompanhe seu desempenho acadêmico</p>
        </div>
        <div className="text-right">
           <div className="text-sm text-gray-400 uppercase font-bold">Matrícula</div>
           <div className="text-xl font-mono text-gray-800">{user.matricula}</div>
        </div>
      </div>

      {/* Tabela Estilizada */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-5 font-bold uppercase text-xs tracking-wider">Disciplina</th>
                <th className="p-5 font-bold uppercase text-xs tracking-wider text-center">Unidade 1</th>
                <th className="p-5 font-bold uppercase text-xs tracking-wider text-center">Unidade 2</th>
                <th className="p-5 font-bold uppercase text-xs tracking-wider text-center">Média</th>
                <th className="p-5 font-bold uppercase text-xs tracking-wider text-center">Situação</th>
                <th className="p-5 font-bold uppercase text-xs tracking-wider">Obs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myGrades.map((g, i) => {
                const media = calcMedia(g.nota1, g.nota2);
                const isApproved = media >= 7;
                
                return (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-5 font-bold text-gray-700">{g.subject}</td>
                    <td className="p-5 text-center text-gray-600">{g.nota1 || '-'}</td>
                    <td className="p-5 text-center text-gray-600">{g.nota2 || '-'}</td>
                    <td className="p-5 text-center">
                       {media ? (
                         <span className={`font-bold text-lg ${isApproved ? 'text-blue-600' : 'text-red-500'}`}>
                           {media}
                         </span>
                       ) : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="p-5 text-center">
                      {media && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isApproved ? 'Aprovado' : 'Reprovado'}
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-sm text-gray-500 max-w-xs truncate">
                      {g.obs || <span className="text-gray-300 italic">Sem observações</span>}
                    </td>
                  </tr>
                );
              })}
              {myGrades.length === 0 && (
                 <tr>
                   <td colSpan="6" className="p-10 text-center text-gray-400">
                     Ainda não há notas lançadas para este semestre.
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