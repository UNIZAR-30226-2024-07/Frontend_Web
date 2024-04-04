import '../HomeAdmin.css'; 
import { Link } from 'react-router-dom';
import constants from '../constants';

function HomeAdmin() {
  return (
    <div className="HomeAdmin">
      <div className="rectangle">
        <img src="/Frontend_Web/Imagenes/logoprincipal.png" alt="Logo" className="corner-image" />
      </div>
      <div className="button-row">
        <Link to={constants.root + "CrearCuentaAdmin"} className="button" >CREAR CUENTA</Link>
        <Link to='/InicioSesion' className="button">AÑADIR PRODUCTOS</Link>
        <Link to='/InicioSesion' className="button" >CREAR SALA</Link>
        <Link to='/InicioSesion' className="button" >CREAR TORNEO</Link>
      </div>
      <div className="button-row">
        <Link to='/InicioSesion' className="button" >MODIFICAR O ELIMINAR CUENTA</Link>
        <Link to='/InicioSesion' className="button" >MODIFICAR O ELIMINAR PRODUCTO</Link>
        <Link to='/InicioSesion' className="button" >MODIFICAR SALA</Link>
        <Link to='/InicioSesion' className="button" >MODIFICAR TORNEO</Link>
      </div>
    </div>
  );
}

export default HomeAdmin;