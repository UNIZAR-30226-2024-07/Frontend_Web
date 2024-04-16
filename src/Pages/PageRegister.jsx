import { MyNav } from "../Components/MyNav";
import { MyForm } from "../Components/MyForm";
import { MyFormPasswd } from "../Components/MyFormPasswd";
import { MyButton } from "../Components/MyButton";
import { useState, useEffect } from "react";
import constants from '../constants';
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./PageLogin.css"

export function PageRegister() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estados para los campos de entrada
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');

  // Manejador para el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Validar que las contraseñas coincidan
    if (contrasena !== repetirContrasena) {
      console.error('Las contraseñas no coinciden');
      return;
    }
    console.log("Nombre Completo: " + nombre);
    console.log("Apellido Completo" + apellido)
    console.log("Usuario Completo: " + nombreUsuario);
    console.log("Correo Completo: " + correoElectronico);
    console.log("Contraseña Completo: " + contrasena);


    try {
      // Llamar a la función signup con los datos del usuario
      await signup({

        nick: nombreUsuario,
        name: nombre,
        surname: apellido,
        email: correoElectronico,
        password: contrasena
      });

      // Redirigir al usuario a la página de dashboard después de registrar
      navigate(constants.root + 'PageDashboard');
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
    }
  };

  // Redirigir al usuario a la página de dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) navigate(constants.root + 'PageDashboard');
  }, [isAuthenticated, navigate]);

  return (
    <div className="inicio">
     <MyNav isLoggedIn={false} />
      <div className='form-container'>
        <form className='form-login' onSubmit={handleSubmit}>
          <MyForm
            typeForm="nickname"
            placeholderForm="Introduce su nombre"
            labelText="Nombre"
            className="form-element"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <MyForm
            typeForm="nickname"
            placeholderForm="Introduce su apellido"
            labelText="Apellido"
            className="form-element"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />

          <MyForm
            typeForm="nickname"
            placeholderForm="Introduce su nombre de usuario"
            labelText="Nombre de usuario"
            className="form-element"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
          />

          <MyForm
            typeForm="nickname"
            placeholderForm="Introduce su correo electronico"
            labelText="Correo Electronico"
            className="form-element"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
          />

          <MyFormPasswd
            placeholderForm="Introduce su contraseña"
            labelText="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <MyFormPasswd
            placeholderForm="Repite su contraseña"
            labelText="Repetir Contraseña"
            value={repetirContrasena}
            onChange={(e) => setRepetirContrasena(e.target.value)}
          />

          <MyButton className="button-login" color="midnightblue" size="xl" type="submit">Registrarse</MyButton>
        </form>
      </div>
    </div>
  );
}
