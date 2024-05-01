import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import constants from '../constants';
import { Link, useNavigate } from "react-router-dom";
import { MyForm } from "../Components/MyForm";
import { MyFormPasswd } from "../Components/MyFormPasswd";
import './PageLogin.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Button } from "@nextui-org/react";

export function PageLogin() {
  const { signin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [nombreCorreo, setNombreCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await signin({
        nick: nombreCorreo,
        password: contrasena,
        rol: 'Null'   
      });

      console.log("HOLAAA");
      setError(res.message.message);
      if (res.data.user.rol === "admin") {
        navigate(constants.root + 'HomeAdmin');
      } else {
        navigate(constants.root + 'PageDashboard');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
    }

    setNombreCorreo('');
    setContrasena('');
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate(constants.root + 'HomeAdmin');
    } else if (isAuthenticated) {
      navigate(constants.root + 'PageDashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="inicio">
      <div className='form-container'>
        <form className='form-login' onSubmit={handleSubmit}>
          <h1 className="titulo-form">Inicio Sesión</h1>
          <div className="part-form">
            <FaUser className="img-form"/>
            <MyForm
              typeForm="nickname"
              placeholderForm="Nickname"
              value={nombreCorreo}
              onChange={(e) => setNombreCorreo(e.target.value)}
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
          <Button className="button-login" type="submit">Iniciar sesión</Button>
          <h2 className="parrafado-centrado">Si no tienes cuenta pulsa aquí</h2>
          <Link to={constants.root + "PageRegister"}>
            <Button className="button-login">Registrarse</Button>
          </Link>
        </form>
        {error && ( 
          <div className="no-friends">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
