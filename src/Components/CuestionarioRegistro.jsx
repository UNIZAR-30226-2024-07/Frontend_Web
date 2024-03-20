import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PreguntasSesion from "./PreguntasSesion";
import { useAuth } from "../Context/AuthContext";
import constants from '../constants';

import '../App.css';


function CuestionarioInicioSesion() {

    const { signup } = useAuth();

    // Estados para los campos de entrada
    const [nombreCorreo, setNombreCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    // Manejador para el envío del formulario
    const handleSubmit = (event) => {
        event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

        // Aquí puedes enviar los datos al servidor o realizar cualquier otra acción necesaria
        console.log('Nombre/Correo:', nombreCorreo);
        console.log('Contraseña:', contrasena);

        ////////////////////////////////////////////////////////////////////////////////////////////
        // Como ejemplo he enviado en todo lo mismo, HAY que crear los demás campo en el formulario
        signup({
            nick: nombreCorreo,
            name: nombreCorreo,
            surname: nombreCorreo,
            email: nombreCorreo,
            password: contrasena
        })
        ////////////////////////////////////////////////////////////////////////////////////////////
        
        // Limpia los campos después de enviar el formulario
        setNombreCorreo('');
        setContrasena('');
    };

    return (
        <form className="questionnaire-container" onSubmit={handleSubmit}>
            <h2 className="questionnaire-title">Inicio de sesión</h2>
            <PreguntasSesion
                type="Nick"
                value={nombreCorreo}
                onChange={(e) => setNombreCorreo(e.target.value)}
            />
            <PreguntasSesion
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
            />
            <button type="submit" className="submit-button">Enviar</button>
            <div className="questionnaire-register">
                <p>Si no tienes cuenta, pulsa aquí</p>
                <button type="button" className="questionnaire-button">
                <NavLink to={constants.root + 'registro'} className="questionnaire-button-link" style={{color: 'white'}}>Regístrate</NavLink>
                </button>
            </div>
        </form>
    );
}

export default CuestionarioInicioSesion;


