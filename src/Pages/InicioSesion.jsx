import constants from '../constants'
import Nav from "../Components/Nav";
import CuestionarioInicioSesion from "../Components/CuestionarioInicioSesion";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const InicioSesion = () => {
      const { isAuthenticated } = useAuth();
      const navigate = useNavigate();
    
      useEffect(() => {
        if (isAuthenticated) {
          navigate(constants.root + 'ejemploSubidaFoto');  //Modificar por ruta a la primera pantalla después de registrar
        }
      }, [isAuthenticated]);

    return (
        <>
            <Nav esRegistro={false}/>
            <CuestionarioInicioSesion />
        </>
    );
} 

export default InicioSesion