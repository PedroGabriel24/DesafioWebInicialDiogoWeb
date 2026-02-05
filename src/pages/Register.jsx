import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', matricula: '', email: '', password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.registerStudent(formData);
      alert("Cadastro realizado! Faça login.");
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-800">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Cadastro de Aluno</h2>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Nome Completo" required
            className="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="text" placeholder="Matrícula (Única)" required
            className="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, matricula: e.target.value})}
          />
          <input 
            type="email" placeholder="E-mail" required
            className="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Senha" required
            className   ="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button type="submit" className="w-full mt-6 bg-blue-800 text-white py-2 rounded hover:bg-blue-900">
          Cadastrar
        </button>
        <div className="mt-4 text-center">
            <Link to="/" className="text-blue-600 hover:underline">Já tem conta? Login</Link>
        </div>
      </form>
    </div>
  );
}