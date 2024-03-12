import '../App.css';
import {NavLink} from 'react-router-dom';
import root from '../constants'

export default function Nav({ esRegistro }) {
    return (
        <nav className="nav-container">
            <div className="nav-left">
                <NavLink to={root}>
                    <img className='nav-image' src="public/logoprincipal.png" alt="logo de la web" />
                </NavLink>
            </div>
            <div className="nav-right">
                {esRegistro ? (
                        <>
                        <button className='nav-button'>
                            <NavLink to={root + 'registro'}>
                                Registrarse
                            </NavLink>
                            </button>
                            <button className='nav-button'>
                            <NavLink to={root + 'inicioSesion'}>
                                Iniciar Sesion
                            </NavLink>
                        </button>
                    </>
                ) : null }
            </div>
        </nav>
    );
}
