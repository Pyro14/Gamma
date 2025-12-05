// Importa React (necesario para usar JSX)
import React from "react";
// Importa la función que permite renderizar la aplicación en el DOM
import ReactDOM from "react-dom/client";

// Importa las herramientas de React Router para gestionar las rutas
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importación de las páginas principales
import Login from "./pages/login";   // Página de inicio de sesión
import Boards from "./pages/Boards"; // Página del tablero (vista protegida)
import ProtectedRoute from "./components/ProtectedRoute";

// Importación de estilos globales
import "./index.css";

// Punto de entrada de la aplicación React.
// ReactDOM.createRoot monta la app dentro del elemento HTML con id="root".
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Página pública */}
        <Route path="/" element={<Login />} />

        {/* Página protegida */}
        <Route
          path="/boards"
          element={
            <ProtectedRoute>
              <Boards />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);