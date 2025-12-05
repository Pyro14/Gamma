// Importamos React para poder usar JSX y hooks
import React, { useEffect, useState } from "react";

// Importamos dos componentes principales de la interfaz
import Header from "../components/Header";     // Barra superior
import Sidebar from "../components/Sidebar";   // Menú lateral

// Importación de estilos específicos para la vista de tableros
import "./Boards.css";

// Componente principal de la vista de Tablero (Boards)
const Boards: React.FC = () => {

  /* =========================================================
      ESTADOS: usuario, error y carga
     ========================================================= */
  const [user, setUser] = useState<any>(null);     // Datos del usuario autenticado
  const [error, setError] = useState("");          // Mensajes de error
  const [loading, setLoading] = useState(true);    // Control de carga inicial

  /* =========================================================
      useEffect → Cargar datos del usuario desde el backend
     ========================================================= */
  useEffect(() => {
    const fetchUser = async () => {
      // Obtenemos el token guardado en localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No hay token. Inicia sesión primero.");
        setLoading(false);
        return;
      }

      try {
        // Petición al backend para obtener los datos del usuario
        const response = await fetch("http://127.0.0.1:8000/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 Token necesario para autenticación
          },
        });

        // Si la respuesta NO es correcta
        if (!response.ok) {
          setError("No se pudo obtener la información del usuario");
          setLoading(false);
          return;
        }

        // Guardamos los datos del usuario
        const data = await response.json();
        setUser(data);

      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  /* =========================================================
      MOSTRAR MENSAJES DE CARGA O ERROR
     ========================================================= */

  // Mientras carga...
  if (loading) {
    return <p style={{ padding: "20px" }}>Cargando tablero...</p>;
  }

  // Si hay error...
  if (error) {
    return <p style={{ color: "red", padding: "20px" }}>{error}</p>;
  }

  return (
    <div className="board-container">

      {/* ================================================
          CABECERA SUPERIOR + INFO DEL USUARIO
         ================================================ */}
      <Header user={user} />  {/* ← ← ← 🔥 AQUÍ ESTÁ EL CAMBIO */}

      {/* Mostramos el email del usuario autenticado */}
      <div style={{ padding: "10px 20px", fontSize: "18px", fontWeight: "bold" }}>
        Usuario conectado: {user?.email}
      </div>

      {/* ================================================
          CONTENEDOR GENERAL: SIDEBAR + TABLERO KANBAN
         ================================================ */}
      <div className="content">
        
        {/* ================================================
            BARRA LATERAL IZQUIERDA (Sidebar)
           ================================================ */}
        <Sidebar user={user} /> {/* ← ← ← 🔥 AQUÍ ESTÁ EL CAMBIO */}

        {/* ================================================
            ZONA PRINCIPAL DEL KANBAN
            Aquí mostramos las 3 columnas:
            - Por Hacer
            - En Curso
            - Hecho
           ================================================ */}
        <div className="kanban">

          {/* --------- COLUMNA: POR HACER --------- */}
          <div className="column">
            <h2>Por Hacer</h2>

            <div className="cards">
              {/* Aquí aparecerán las tarjetas pendientes */}
            </div>
          </div>

          {/* --------- COLUMNA: EN CURSO --------- */}
          <div className="column">
            <h2>En Curso</h2>

            <div className="cards">
              {/* Aquí aparecerán las tarjetas que están en desarrollo */}
            </div>
          </div>

          {/* --------- COLUMNA: HECHO --------- */}
          <div className="column">
            <h2>Hecho</h2>

            <div className="cards">
              {/* Aquí aparecerán las tarjetas finalizadas */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Exportamos la vista para usarla en React Router
export default Boards;
