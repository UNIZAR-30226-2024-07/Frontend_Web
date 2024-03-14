import '../App.css';
import {NavLink} from 'react-router-dom';
import constants from '../constants'

export default function Nav({ esRegistro }) {
    return (
        <nav className="nav-container">
            <div className="nav-left">
                <NavLink to={constants.root}>
                    <img className='nav-image' src={constants.root + "logoprincipal.png"} alt="logo de la web" />
                </NavLink>
            </div>
            <div className="nav-right">
                {esRegistro ? (
                        <>
                        <button className='nav-button'>
                            <NavLink to={constants.root + 'registro'}>
                                Registrarse
                            </NavLink>
                            </button>
                            <button className='nav-button'>
                            <NavLink to={constants.root + 'inicioSesion'}>
                                Iniciar Sesion
                            </NavLink>
                        </button>
                    </>
                ) : null }
            </div>
        </nav>
    );
}
