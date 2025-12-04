// Importamos React y el hook useState para manejar estados locales (email y password)
import React, { useState } from "react";

// Importamos useNavigate para poder redirigir al usuario a otra página tras el login
import { useNavigate } from "react-router-dom";

// Imagen de fondo para la pantalla de login
import fondo from "../assets/fondo.jpg";

// Estilos específicos de la página de login
import "./login.css";


// Componente funcional de la pantalla de Login
const Login: React.FC = () => {

  // Hook para navegar entre páginas (React Router)
  const navigate = useNavigate();

  // Estados para almacenar el email y la contraseña introducidos por el usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // Función que se ejecuta cuando el usuario envía el formulario
  // 🔵 Ahora es ASÍNCRONA porque llamará al backend para obtener un JWT
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue por defecto

    try {
      // 🔵 Petición al backend (aunque aún no exista)
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Si el backend responde con error → mostramos mensaje
      if (!response.ok) {
        alert(data.detail || "Error en el login");
        return;
      }

      // 🔵 Guardamos el token y el nombre de usuario en localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_name", data.user_name);

      // 🔵 Redirige al usuario a la página del tablero
      navigate("/boards");

    } catch (error) {
      // Si no se puede conectar con el backend (apagado / no existe todavía)
      alert("No se pudo conectar con el servidor");
    }
  };


  // Renderizado del formulario de login
  return (
    <div
      className="login-container"
      // Añadimos la imagen de fondo como estilo inline
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>

        {/* Campo de entrada para el email */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Actualiza el estado email
          required
        />

        {/* Campo de entrada para la contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Actualiza el estado password
          required
        />

        {/* Botón para enviar el formulario */}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

// Exportamos el componente para usarlo en el enrutado (main.tsx)
export default Login;
