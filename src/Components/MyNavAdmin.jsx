import './MyNavAdmin.css';
import constants from '../constants';
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom"; // Importa useNavigate


export function MyNavAdmin(){

    const { logout } = useAuth(); // Obtiene la función logout del contexto de autenticación
    const navigate = useNavigate(); // Obtiene la función navigate de react-router-dom
    const destino = constants.root + "HomeAdmin";

    function handleLogout() {
        logout(); // Llama a la función logout del contexto de autenticación
        navigate(constants.root); // Redirige a la página de inicio después de cerrar sesión
    }

    const handleImageClick = () => {
        navigate(destino); // Reemplaza 'HomeAdmin' con la ruta a la que deseas navegar
    };

    return(
        <div className="rectangle">
                <img src="/Frontend_Web/Imagenes/logoprincipal.png" alt="Logo" className="corner-image" onClick={handleImageClick}/>
                <button className="button-logout" onClick={handleLogout}> Logout </button>
        </div>
    );
}