import './AjustesUsuario.css';
import { MyNav } from "../Components/MyNav";
import { CustomButton } from "../Components/CustomButton";

const AjustesUsuario = () => {
  return (
    <div className='ajustes-usuario'>
    <MyNav isLoggedIn={false} isDashboard={true} /> 
      <div className="button-container">
        <CustomButton text="Cambiar avatar" onClick={() => console.log('Cambiar avatar')} />
        <CustomButton text="Cambiar nombre usuario" onClick={() => console.log('Cambiar nombre usuario')} />
        <CustomButton text="Cambiar contraseña" onClick={() => console.log('Cambiar contraseña')} />
        <CustomButton text="Ver estadísticas" onClick={() => console.log('Ver estadísticas')} />
      </div>
    </div>
  );
}

export default AjustesUsuario;