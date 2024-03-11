import '../App.css';
import {NavLink} from 'react-router-dom';

export default function Nav({ esRegistro }) {
    return (
        <nav className="nav-container">
            <div className="nav-left">
                <img className='nav-image' src="public/logoprincipal.png" alt="logo de la web" />
            </div>
            <div className="nav-right">
                {esRegistro ? (
                        <NavLink to='/registro'>
                             Registro
                        </NavLink>
                ) : (
                    <p>Este es el menú normal</p>
                )}
            </div>
        </nav>
    );
}

