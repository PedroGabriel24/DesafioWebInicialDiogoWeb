import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 cursor-pointer
    ${isActive(path) 
      ? 'bg-blue-800 border-r-4 border-yellow-400 text-white shadow-lg' 
      : 'text-blue-100 hover:bg-blue-800/50 hover:pl-8 hover:text-white'}
  `;

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-slate-900 text-white flex flex-col h-screen sticky top-0 shadow-2xl z-10">
      <div className="h-24 flex items-center justify-center border-b border-white/10">
        <div className="text-center">
          <div className="font-black text-2xl tracking-widest text-white">ODE<span className="text-yellow-400">TTE</span></div>
          <div className="text-[10px] text-blue-300 uppercase tracking-[0.2em]">Gestão Escolar</div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center font-bold text-xl shadow-lg">
            {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-blue-300 truncate capitalize">{role === 'teacher' ? 'Professor(a)' : 'Aluno(a)'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {role === 'teacher' && (
            <>
              <li>
                <Link to="/teacher" className={linkClass('/teacher')}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  <span>Visão Geral</span>
                </Link>
              </li>
              <li>
                <Link to="/teacher/grades" className={linkClass('/teacher/grades')}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  <span>Lançar Notas</span>
                </Link>
              </li>
            </>
          )}

          {role === 'student' && (
            <li>
              <Link to="/student" className={linkClass('/student')}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                <span>Meu Boletim</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button onClick={logout} className="flex items-center gap-3 text-red-300 hover:text-white transition-colors w-full px-4">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}