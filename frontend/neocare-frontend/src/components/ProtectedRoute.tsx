import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement; // <--- Mucho mejor que JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  // Si no hay token → redirigir
  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiration = payload.exp * 1000;

    if (Date.now() > expiration) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_name");

      alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      return <Navigate to="/" replace />;
    }
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;


