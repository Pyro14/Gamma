// Importamos React para poder usar JSX
import React from "react";

// Importamos dos componentes principales de la interfaz
import Header from "../components/Header";     // Barra superior
import Sidebar from "../components/Sidebar";   // Menú lateral

// Importación de estilos específicos para la vista de tableros
import "./Boards.css";


// Componente principal de la vista de Tablero (Boards)
const Boards: React.FC = () => {
  return (
    <div className="board-container">

      {/* ================================================
          CABECERA SUPERIOR DEL PROYECTO
          Contiene el logo, título, botones o perfil (según diseño)
         ================================================ */}
      <Header />

      {/* ================================================
          CONTENEDOR GENERAL: SIDEBAR + TABLERO KANBAN
         ================================================ */}
      <div className="content">
        
        {/* ================================================
            BARRA LATERAL IZQUIERDA (Sidebar)
            Normalmente contiene navegación, opciones o tableros
           ================================================ */}
        <Sidebar />

        {/* ================================================
            ZONA PRINCIPAL DEL KANBAN
            Aquí mostramos las 3 columnas:
            - Por Hacer
            - En Curso
            - Hecho
            Más adelante aquí se integrará drag & drop y tarjetas reales
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
