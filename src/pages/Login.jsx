import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Login.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const tipo = login(usuario, senha);

    if (tipo === "professor") navigate("/professor");
    else if (tipo === "aluno") navigate("/aluno");
    else setErro("Usuário ou senha inválidos");
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Secretaria Escolar</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuário ou e-mail"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button type="submit">Entrar</button>
        </form>

        {erro && <p className="login-error">{erro}</p>}
      </div>
    </div>
  );
}
