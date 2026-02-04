import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";

export default function PrivateRoute({ children, tipo }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;
  if (user.tipo !== tipo) return <Navigate to="/" />;

  return children;
}
