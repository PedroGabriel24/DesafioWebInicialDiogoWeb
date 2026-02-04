import { useState } from "react";
import { AuthContext } from "./AuthContext";

/* MOCK DE PROFESSORES */
const professoresMock = [
  { usuario: "ana.mat", senha: "123456", tipo: "professor", disciplina: "Matemática" },
  { usuario: "carlos.port", senha: "123456", tipo: "professor", disciplina: "Português" },
  { usuario: "juliana.hist", senha: "123456", tipo: "professor", disciplina: "História" },
  { usuario: "marcos.cien", senha: "123456", tipo: "professor", disciplina: "Ciências" },
  { usuario: "diogo.info", senha: "123456", tipo: "professor", disciplina: "Informática" },
];

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(usuario, senha) {
    const professor = professoresMock.find(
      (p) => p.usuario === usuario && p.senha === senha
    );

    if (professor) {
      setUser(professor);
      return professor.tipo;
    }

    if (usuario === "aluno@test.com" && senha === "123") {
      const aluno = { tipo: "aluno", nome: "Aluno Teste" };
      setUser(aluno);
      return "aluno";
    }

    return null;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
