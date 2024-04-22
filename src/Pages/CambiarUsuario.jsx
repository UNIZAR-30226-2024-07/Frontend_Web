import { useState } from "react"; // Añade useEffect a tus importaciones
import constants from '../constants';
import { useNavigate } from "react-router-dom";
import { MyNav } from "../Components/MyNav";
import { MyForm } from "../Components/MyForm";
import { MyButton } from "../Components/MyButton";
import './CambiarUsuario.css';
import axios from "../api/axios";

export function CambiarUsuario() {
  const navigate = useNavigate();

  // Estados para los campos de entrada
  const [nuevousuario, setNuevousuario] = useState('');
  const [repetirusuario, setRepetirusuario] = useState('');
  const [error, setError] = useState('');

  // Manejador para el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Validar que las contraseñas nuevas coincidan
    if (nuevousuario !== repetirusuario) {
      console.error('Los usuarios no coinciden');
      setError('Los usuarios no coinciden');
      return;
    }

    try {
      // Llamar a la función para cambiar la contraseña
      const response = await axios.put(`/user/update`, {nick: nuevousuario})
      if (response.status !== 200) {
          console.log("Fallo al modificar el usuario: ", response.data);
          throw new Error('Error al modificar el usuario');
      }

      // Redirigir al usuario a la página de dashboard después de cambiar la contraseña
      navigate(constants.root + 'PageDashboard');
    } catch (error) {
      console.error('Error al cambiar el usuario:', error.message);
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
          <div className="cambio-usuario">Cambio usuario</div>
          <MyForm
            placeholderForm="Introduce tu nuevo usuario"
            labelText="Nuevo Usuario"
            value={nuevousuario}
            onChange={(e) => setNuevousuario(e.target.value)}
          />
          <MyForm
            placeholderForm="Repite tu nuevo usuario"
            labelText="Repetir Usuario"
            value={repetirusuario}
            onChange={(e) => setRepetirusuario(e.target.value)}
          />
          <div className="boton">
            <MyButton className="button-login" color="midnightblue" size="xl" type="submit">Cambiar Usuario</MyButton>
          </div>
          {error && <div className="error">{error}</div>}

        </form>
      </div>
    </div>
  );
}