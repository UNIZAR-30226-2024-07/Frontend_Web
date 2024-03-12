import '../App.css';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types'
import root from '../constants'

const Nav = ({ esRegistro }) => {
    return (
        <nav className="nav-container">
            <div className="nav-left">
                <img className='nav-image' src={root + "logo.png"} alt="logo de la web" />
            </div>
            <div className="nav-right">
                {esRegistro ? (
                        <NavLink to={root + "registro"}>
                             Registro
                        </NavLink>
                ) : (
                    <p>Este es el menú normal</p>
                )}
            </div>
        </nav>
    );
}

Nav.propTypes = {
    esRegistro: PropTypes.bool.isRequired // Definiendo PropTypes para esRegistro
};

export default Nav;

