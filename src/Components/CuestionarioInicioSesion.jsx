import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PreguntasSesion from "./PreguntasSesion";
import root from '../constants'


import '../App.css';

function CuestionarioInicioSesion() {
    // Estados para los campos de entrada
    const [nombreCorreo, setNombreCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    // Manejador para el envío del formulario
    const handleSubmit = (event) => {
        event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

        // Aquí puedes enviar los datos al servidor o realizar cualquier otra acción necesaria
        console.log('Nombre/Correo:', nombreCorreo);
        console.log('Contraseña:', contrasena);
        
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
                <NavLink to={root + 'registro'} className="questionnaire-button-link" style={{color: 'white'}}>Regístrate</NavLink>
                </button>
            </div>
        </form>
    );
}

export default CuestionarioInicioSesion;


