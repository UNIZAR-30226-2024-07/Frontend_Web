import { useState } from "react"; // Añade useEffect a tus importaciones
import constants from '../constants';
import { useNavigate } from "react-router-dom";
import { MyNav } from "../Components/MyNav";
import { MyFormPasswd } from "../Components/MyFormPasswd";
import { MyButton } from "../Components/MyButton";
import './CambiarContrasena.css';
import axios from "../api/axios";

export function CambiarContrasena() {
  const navigate = useNavigate();

  // Estados para los campos de entrada
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');

  // Manejador para el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Validar que las contraseñas nuevas coincidan
    if (nuevaContrasena !== repetirContrasena) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    try {
      // Llamar a la función para cambiar la contraseña
      const response = await axios.put(`/user/update`, {nuevaContrasena})
      if (response.status !== 200) {
          console.log("Fallo al modificar la contraseña: ", response.data);
          throw new Error('Error al modificar la contraseña');
      }

      // Redirigir al usuario a la página de dashboard después de cambiar la contraseña
      navigate(constants.root + 'PageDashboard');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
    }

    // Limpiar los campos después de enviar el formulario
    setNuevaContrasena('');
    setRepetirContrasena('');
  };


  return (
    <div className='cambiar-contrasena'>
      <MyNav isLoggedIn={false} isDashboard={false} />
      <div className='form-container'>
        <form className='form-login' onSubmit={handleSubmit}>
          <MyFormPasswd
            placeholderForm="Introduce tu nueva contraseña"
            labelText="Nueva Contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
          />
          <MyFormPasswd
            placeholderForm="Repite tu nueva contraseña"
            labelText="Repetir Contraseña"
            value={repetirContrasena}
            onChange={(e) => setRepetirContrasena(e.target.value)}
          />
          <MyButton className="button-login" color="midnightblue" size="xl" type="submit">Cambiar Contraseña</MyButton>
        </form>
      </div>
    </div>
  );
}