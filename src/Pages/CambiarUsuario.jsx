import { useState } from "react"; // Añade useEffect a tus importaciones
import constants from '../constants';
import { useNavigate } from "react-router-dom";
import { MyNav } from "../Components/MyNav";
import { MyFormPasswd } from "../Components/MyFormPasswd";
import { MyButton } from "../Components/MyButton";
import './CambiarUsuario.css';
import axios from "../api/axios";

export function CambiarUsuario() {
  const navigate = useNavigate();

  // Estados para los campos de entrada
  const [nuevousuario, setNuevousuario] = useState('');
  const [repetirusuario, setRepetirusuario] = useState('');

  // Manejador para el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Validar que las contraseñas nuevas coincidan
    if (nuevousuario !== repetirusuario) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    try {
      // Llamar a la función para cambiar la contraseña
      const response = await axios.put(`/api/user/update`, {nuevousuario})
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
    setNuevousuario('');
    setRepetirusuario('');
  };


  return (
    <div className='cambiar-usuario'>
      <MyNav isLoggedIn={false} isDashboard={false} />
      <div className='form-container'>
        <form className='form-login' onSubmit={handleSubmit}>
          <MyFormPasswd
            placeholderForm="Introduce tu nueva contraseña"
            labelText="Nuevo Usuario"
            value={nuevousuario}
            onChange={(e) => setNuevousuario(e.target.value)}
          />
          <MyFormPasswd
            placeholderForm="Repite tu nueva contraseña"
            labelText="Repetir Usuario"
            value={repetirusuario}
            onChange={(e) => setRepetirusuario(e.target.value)}
          />
          <MyButton className="button-login" color="midnightblue" size="xl" type="submit">Cambiar Contraseña</MyButton>
        </form>
      </div>
    </div>
  );
}