import { useAuth } from '../../context/AuthContext';

export default function TeacherHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Olá, Professor(a) {user.name}!</h1>
        <p className="opacity-90">Bem-vindo ao painel de gestão da disciplina de <strong className="text-yellow-300">{user.subject}</strong>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total de Alunos</div>
          <div className="text-4xl font-bold text-blue-900 mt-2">32</div>
          <div className="text-green-500 text-xs mt-1 font-semibold">Ativos no semestre</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Média da Turma</div>
          <div className="text-4xl font-bold text-blue-900 mt-2">7.4</div>
          <div className="text-blue-500 text-xs mt-1 font-semibold">Geral da disciplina</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pendências</div>
          <div className="text-4xl font-bold text-orange-500 mt-2">5</div>
          <div className="text-gray-400 text-xs mt-1">Notas para fechar</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Precisa lançar notas?</h3>
          <p className="text-gray-500">Acesse a área de lançamento para atualizar o boletim.</p>
        </div>
        <a href="/teacher/grades" className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition shadow-lg">
          Ir para Lançamentos &rarr;
        </a>
      </div>
    </div>
  );
}