import './PantallaPrivada.css';
import { MyNav } from "../Components/MyNav";
import { MyButton } from "../Components/MyButton";

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

const PantallaPrivada = () => {
  const navigate = useNavigate();

//   const handleCambiarAvatar = () => {
//     // Lógica para navegar a la pantalla de cambio de avatar
//     navigate('/Frontend_Web/cambiarAvatar');
//   };

  const handleCrear = () => {
    // Lógica para navegar a la pantalla de cambio de nombre de usuario
    navigate('/Frontend_Web/CrearPartidaPr');
  };

  const handleUnirse = () => {
    // Lógica para navegar a la pantalla de cambio de contraseña
    navigate('/Frontend_Web/UnirsePartidaPr');
  };

  const handlePractica = () => {
    // Lógica para navegar a la pantalla de ver estadísticas
    navigate('/Frontend_Web/ModoPractica');
  };

  return (
    <div className='pantalla-privada'>
      <MyNav isLoggedIn={false} isDashboard={false} /> 
        <div className="contenedor-privada">
          {/* <CustomButton text="Cambiar avatar" onClick={handleCambiarAvatar} /> */}
          <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={handleCrear}>Crear Partida</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={handleUnirse}>Unirse partida</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={handlePractica}>Modo practica</MyButton>
        </div>
    </div>
  );
}

export default PantallaPrivada;