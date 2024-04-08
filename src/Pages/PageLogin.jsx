import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import constants from '../constants';
import { Link, useNavigate } from "react-router-dom";
import { MyNav } from "../Components/MyNav";
import { MyForm } from "../Components/MyForm";
import { MyFormPasswd } from "../Components/MyFormPasswd";
import { MyButton } from "../Components/MyButton";
import './PageLogin.css';

export function PageLogin() {
  const { signin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estados para los campos de entrada
  const [nombreCorreo, setNombreCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  // Manejador para el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    console.log("Nombre Completo: " + nombreCorreo);
    console.log("Nombre Completo: " + contrasena);

    try {
      // Llamar a la función signin con los datos del usuario
      await signin({
        nick: nombreCorreo,
        password: contrasena
      });

      // Redirigir al usuario a la página de dashboard después de iniciar sesión
      navigate(constants.root + 'PageDashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
    }

    // Limpiar los campos después de enviar el formulario
    setNombreCorreo('');
    setContrasena('');
  };

  // Redirigir al usuario a la página de dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(constants.root + 'PageDashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <MyNav isLoggedIn={false} isDashboard={false} />
      <div className='form-container'>
        <form className='form-login' onSubmit={handleSubmit}>
          <MyForm
            typeForm="nickname"
            placeholderForm="Enter your nickname"
            labelText="Nickname"
            value={nombreCorreo}
            onChange={setNombreCorreo}
          />
          <MyFormPasswd
            placeholderForm="Introduce su contraseña"
            labelText="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <MyButton className="button-login" color="midnightblue" size="xl" type="submit">Iniciar sesión</MyButton>
          <p className="paragraph-login">Si no tienes cuenta, <Link to={constants.root + "PageRegister"} className="pulsa-aqui">pulsa aquí</Link></p>

        </form>
      </div>
    </>
  );
}



