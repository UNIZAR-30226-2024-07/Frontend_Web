import { MyForm } from "../Components/MyForm";
import { MyFormPasswd } from "../Components/MyFormPasswd";
import { MyButton } from "../Components/MyButton";
import { useState } from "react";
import constants from '../constants';
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import "./PageLogin.css"

export function CrearPartidaPr() {
  const navigate = useNavigate();

  // Estados para los campos de entrada
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [error, setError] = useState(null); // Estado para almacenar el mensaje de error

  // Manejador para el envío del formulario
   // Manejador para el envío del formulario
   const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario
  
    // Validar que las contraseñas coincidan
    if (contrasena !== repetirContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }
  
    // Validar que la contraseña cumpla con los requisitos
    const regexUpperCase = /[A-Z]/; // al menos una mayúscula
    const regexLowerCase = /[a-z]/; // al menos una minúscula
    const regexNumber = /[0-9]/; // al menos un número
    const regexLength = /.{6,}/; // al menos 6 caracteres
  
    if (
      !regexUpperCase.test(contrasena) ||
      !regexLowerCase.test(contrasena) ||
      !regexNumber.test(contrasena) ||
      !regexLength.test(contrasena)
    ) {
      setError('La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener al menos 6 caracteres');
      return;
    }
  
    try {
      // Llamar a la función signup con los datos del usuario
      const res = await signup({
        nick: nombreUsuario,
        name: nombre,
        surname: apellido,
        email: correoElectronico,
        password: contrasena,
        rol: 'user'
      });

      // Redirigir al usuario a la página de dashboard después de registrar
      if(res.message.status != "error"){
        navigate(constants.root + 'PageDashboard');
      }
      else{
        setError(res.message.message);
      }
    } catch (error) {
      setError("Error al registrar usuario");
    }
  };
  
  return (
    <div className="inicio">
      <div className='form-container'>
        <form className='form-login' onSubmit={handleSubmit}>
          <h1 className="titulo-form">Registro Usuario</h1>
          <div className="part-form">
            <FaUser className="img-form"/>
            <MyForm
              typeForm="nickname"
              placeholderForm="Nombre"
              className="form-element"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="part-form">
            <FaUser className="img-form"/>
            <MyForm
              typeForm="nickname"
              placeholderForm="Apellidos"
              className="form-element"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div className="part-form">
            <FaUser className="img-form"/>
            <MyForm
              typeForm="nickname"
              placeholderForm="Nickname"
              className="form-element"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
          </div>
          <div className="part-form">
            <IoMdMail className="img-form"/>
            <MyForm
              typeForm="nickname"
              placeholderForm="Correo electronico"
              className="form-element"
              value={correoElectronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
            />
          </div>
          <div className="part-form">
            <RiLockPasswordFill className="img-form"/>
            <MyFormPasswd
              placeholderForm="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>
          <div className="part-form">
            <RiLockPasswordFill className="img-form"/>
            <MyFormPasswd
              placeholderForm="Repita contraseña"
              value={repetirContrasena}
              onChange={(e) => setRepetirContrasena(e.target.value)}
            />
          </div>
          <MyButton className="button-login" color="midnightblue" size="xl" type="submit">Registrarse</MyButton>
        </form>
      </div>
      {error && <div className="error-login">{error}</div>}
    </div>
  );
}
