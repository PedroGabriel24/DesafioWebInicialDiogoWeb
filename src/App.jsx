import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/Login";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import AlunoDashboard from "./pages/AlunoDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/professor"
            element={
              <PrivateRoute tipo="professor">
                <ProfessorDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/aluno"
            element={
              <PrivateRoute tipo="aluno">
                <AlunoDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
