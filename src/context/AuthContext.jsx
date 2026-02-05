import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // professor ou aluno
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('school_session');
    if (storedUser) {
      const { user, role } = JSON.parse(storedUser);
      setUser(user);
      setRole(role);
    }
    setLoading(false);
  }, []);

  const loginAuth = async (login, password) => {
    try {
      const data = await api.login(login, password);
      setUser(data.user);
      setRole(data.role);
      localStorage.setItem('school_session', JSON.stringify(data));
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('school_session');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, role, loginAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);