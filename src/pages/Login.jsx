import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginAuth } = useAuth();
  
  const [userLogin, setUserLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await loginAuth(userLogin, password);
    
    if (success) {
      const sessionData = JSON.parse(localStorage.getItem('school_session'));
      if (sessionData?.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-800">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Portal Escolar</h1>
          <p className="text-gray-500">Área de Acesso</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuário ou E-mail</label>
            <input 
              type="text" 
              required
              placeholder="Ex: ana.mat ou aluno@email.com"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={userLogin}
              onChange={(e) => setUserLogin(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input 
              type="password" 
              required
              placeholder="••••••"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

          <button 
            type="submit" 
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-md transition shadow-lg"
          >
            ENTRAR
          </button>
        </form>

        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-gray-600">É um aluno novo?</p>
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Faça seu cadastro aqui
          </Link>
        </div>
        
        <div className="mt-8 text-xs text-gray-400 bg-gray-50 p-2 rounded">
          <p><strong>Teste Professor:</strong> ana.mat / 123456</p>
        </div>
      </div>
    </div>
  );
}