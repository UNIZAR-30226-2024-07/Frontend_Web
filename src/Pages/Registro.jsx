import constants from '../constants'
import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import CuestionarioRegistro from "../Components/CuestionarioRegistro"


import Nav from "../Components/Nav";


const Registro = () => {
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate(constants.root + 'ejemploSubidaFoto'); //Modificar por ruta a la primera pantalla después de registrar
    }, [isAuthenticated]);

    return (
        <>
            <Nav esRegistro={true}/>
            <CuestionarioRegistro />
        </>
  );
}

export default Registro