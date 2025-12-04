// Importación de React y estilos específicos del sidebar
import React from "react";
import "./Sidebar.css";


// Componente funcional del menú lateral izquierdo (Sidebar)
const Sidebar: React.FC = () => {
  return (
    // Etiqueta <aside> indica que es una barra lateral
    <aside className="sidebar">

      {/* Título del menú */}
      <h2 className="sidebar-title">Menú</h2>

      {/* Lista de opciones disponibles en el panel lateral */}
      <ul className="sidebar-list">

        {/* En la fase actual son elementos estáticos.
           Más adelante se convertirán en enlaces de navegación reales
           usando <Link> de React Router DOM. */}
        <li>🏷️ Tablero</li>
        <li>⏱️ Mis horas</li>
        <li>📊 Informe</li>
        <li>⚙️ Configuración</li>
      </ul>
    </aside>
  );
};


// Exportamos el componente para utilizarlo dentro de Boards.tsx
export default Sidebar;
