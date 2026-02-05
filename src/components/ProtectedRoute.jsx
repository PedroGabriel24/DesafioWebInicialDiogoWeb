import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { authenticated, role, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRole && role !== allowedRole) {
    alert("Acesso não autorizado para seu perfil.");
    // Redireciona para o dashboard correto baseado no perfil que ele TEM
    return role === 'teacher' ? <Navigate to="/teacher" /> : <Navigate to="/student" />;
  }

  return children;
};