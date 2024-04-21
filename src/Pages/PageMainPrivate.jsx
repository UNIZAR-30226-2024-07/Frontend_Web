import { useNavigate } from "react-router-dom";
import { MyNav } from "../Components/MyNav";
import { CustomButton } from "../Components/CustomButton";

const AjustesUser = () => {
  const navigate = useNavigate();

//   const handleCambiarAvatar = () => {
//     // Lógica para navegar a la pantalla de cambio de avatar
//     navigate('/Frontend_Web/cambiarAvatar');
//   };

  const handleCambiarNombreUsuario = () => {
    // Lógica para navegar a la pantalla de cambio de nombre de usuario
    navigate('/Frontend_Web/CambiarUsuario');
  };

  const handleCambiarContrasena = () => {
    // Lógica para navegar a la pantalla de cambio de contraseña
    navigate('/Frontend_Web/CambiarContrasena');
  };

  const handleVerEstadisticas = () => {
    // Lógica para navegar a la pantalla de ver estadísticas
    navigate('/Frontend_Web/EstadisticasUser');
  };

  return (
    <div className='ajustes-user'>
      <MyNav isLoggedIn={false} isDashboard={true} /> 
        <div className="button-cont">
          {/* <CustomButton text="Cambiar avatar" onClick={handleCambiarAvatar} /> */}
          <CustomButton text="Crear Partida" onClick={handleCambiarNombreUsuario} />
          <CustomButton text="Unirse a Partida" onClick={handleCambiarContrasena} />
          <CustomButton text="Modo Practica" onClick={handleVerEstadisticas} />
        </div>
    </div>
  );
}

export default AjustesUser;