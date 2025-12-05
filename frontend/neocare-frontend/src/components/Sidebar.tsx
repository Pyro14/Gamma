// Importación de React y estilos específicos del sidebar
import React from "react";
import "./Sidebar.css";


// -----------------------------------------------------------
// Componente funcional del menú lateral izquierdo (Sidebar)
// Ahora recibe PROPS para mostrar el usuario autenticado
// -----------------------------------------------------------
interface SidebarProps {
  user: any; // Datos del usuario enviados desde Boards.tsx
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  return (
    // Etiqueta <aside> indica que es una barra lateral
    <aside className="sidebar">

      {/* ============================================
          MOSTRAR USUARIO AUTENTICADO EN EL SIDEBAR
          ============================================ */}
      <div className="sidebar-user">
        <strong>👤 Usuario:</strong>
        <p>{user?.email || "No identificado"}</p>
      </div>

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
