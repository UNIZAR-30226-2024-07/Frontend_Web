import './AjustesUser.css';
import { MyNav } from "../Components/MyNav";
import { CustomButton } from "../Components/CustomButton";

// const AjustesUser = () => {
//   return (
//     <div className='ajustes-user'>
//       <MyNav isLoggedIn={false} isDashboard={true} /> 
//         <div className="button-cont">
//           <CustomButton text="Cambiar avatar" onClick={() => console.log('Cambiar avatar')} />
//           <CustomButton text="Cambiar nombre usuario" onClick={() => console.log('Cambiar nombre usuario')} />
//           <CustomButton text="Cambiar contraseña" onClick={() => console.log('Cambiar contraseña')} />
//           <CustomButton text="Ver estadísticas" onClick={() => console.log('Ver estadísticas')} />
//         </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";

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
    navigate('/Frontend_Web/verEstadisticas');
  };

  return (
    <div className='ajustes-user'>
      <MyNav isLoggedIn={false} isDashboard={true} /> 
        <div className="button-cont">
          {/* <CustomButton text="Cambiar avatar" onClick={handleCambiarAvatar} /> */}
          <CustomButton text="Cambiar nombre usuario" onClick={handleCambiarNombreUsuario} />
          <CustomButton text="Cambiar contraseña" onClick={handleCambiarContrasena} />
          <CustomButton text="Ver estadísticas" onClick={handleVerEstadisticas} />
        </div>
    </div>
  );
}

export default AjustesUser;