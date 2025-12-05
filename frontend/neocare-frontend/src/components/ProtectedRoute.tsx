import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  // Si no hay token → redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decodificar JWT (la parte del Payload)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiration = payload.exp * 1000; // exp viene en segundos → convertir a ms

    // Si el token está expirado, borrar y redirigir
    if (Date.now() > expiration) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_email"); // opcional

      alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      return <Navigate to="/login" replace />;
    }
  } catch {
    // Si no se puede decodificar el token → inválido → borrar
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Si todo está OK → permitir acceso
  return children;
};

export default ProtectedRoute;
