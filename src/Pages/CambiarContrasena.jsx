import { useState } from "react"; // Añade useEffect a tus importaciones
import constants from '../constants';
import { useNavigate } from "react-router-dom";
import { MyNav } from "../Components/MyNav";
import { MyForm } from "../Components/MyForm";
import { MyButton } from "../Components/MyButton";
import './CambiarContrasena.css';
import axios from "../api/axios";

export function CambiarContrasena() {
  const navigate = useNavigate();

  // Estados para los campos de entrada
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [error, setError] = useState('');

  // Manejador para el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Validar que las contraseñas nuevas coincidan
    if (nuevaContrasena !== repetirContrasena) {
      console.error('Las contraseñas no coinciden');
      setError('Las contraseñas no coinciden');
      return;
    }


    // Validar que la contraseña cumpla con los requisitos
    const regexUpperCase = /[A-Z]/; // al menos una mayúscula
    const regexLowerCase = /[a-z]/; // al menos una minúscula
    const regexNumber = /[0-9]/; // al menos un número
    const regexLength = /.{6,}/; // al menos 6 caracteres
  
    if (
      !regexUpperCase.test(nuevaContrasena) ||
      !regexLowerCase.test(nuevaContrasena) ||
      !regexNumber.test(nuevaContrasena) ||
      !regexLength.test(nuevaContrasena)
    ) {
      setError('La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener al menos 6 caracteres');
      return;
    }

    try {
      // Llamar a la función para cambiar la contraseña
      const response = await axios.put(`/user/update`, {password: nuevaContrasena})
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
        <div className="cambio-contraseña">Cambio contraseña</div>
          <MyForm
            typeForm="nickname"
            placeholderForm="Introduce tu nueva contraseña"
            labelText="Nueva Contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
          />
          <MyForm
            placeholderForm="Repite tu nueva contraseña"
            labelText="Repetir Contraseña"
            value={repetirContrasena}
            onChange={(e) => setRepetirContrasena(e.target.value)}
          />
          <div className="botonc">
          <MyButton className="button-login" color="midnightblue" size="xl" type="submit">Cambiar Contraseña</MyButton>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}