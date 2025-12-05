// Importamos React y los estilos específicos del header
import React from "react";
import "./Header.css";


// Componente de la cabecera superior de la aplicación
const Header: React.FC = () => {

  // Simulación de usuario autenticado.
  // ⚠️ Más adelante, este valor se obtendrá del backend usando el JWT.
  const userName = "Juan Pérez"; 
  // Ejemplo real futuro:
  // const userName = decodedToken.user_name;


  return (
    // Contenedor principal del header
    <header className="header">

      {/* Título del proyecto o nombre de la empresa */}
      <h1 className="header-title">NeoCare Health</h1>


      {/* Sección derecha del header: usuario + botón de logout */}
      <div className="header-right">

        {/* Muestra el nombre del usuario actualmente logueado */}
        <span className="user-name">{userName}</span>


        {/* Botón para cerrar sesión */}
        <button
          className="logout-button"
          onClick={() => {
            // Al cerrar sesión eliminamos el token JWT del navegador
            localStorage.removeItem("token");

            // Redirigimos al usuario a la pantalla de login
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};


// Exportamos el componente para que pueda usarse en Boards.tsx
export default Header;
