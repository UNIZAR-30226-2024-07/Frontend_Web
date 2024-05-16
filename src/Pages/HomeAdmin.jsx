import './HomeAdmin.css'; 
import { Link } from 'react-router-dom';
import constants from '../constants';
import { MyNavAdmin } from '../Components/MyNavAdmin'

function HomeAdmin() {
  return (
    <div className="HomeAdmin">
      <MyNavAdmin></MyNavAdmin>
      <div className="button-row">
        <Link to={constants.root + "CrearCuentaAdmin"} className="button" >CREAR CUENTA ADMIN</Link>
        <Link to={constants.root + "AgnadirProducto"} className="button">AÑADIR PRODUCTOS</Link>
        <Link to={constants.root + "CrearSala"} className="button">CREAR SALA</Link>
        <Link to={constants.root + "AgnadirTorneo"} className="button" >CREAR TORNEO</Link>
      </div>
      <div className="button-row">
        <Link to={constants.root + 'ModificarEliminarCuenta'} className="button" >ELIMINAR CUENTA</Link>
        <Link to={constants.root + 'ModificarEliminarProducto'} className="button" >MODIFICAR O ELIMINAR PRODUCTO</Link>
        <Link to={constants.root + "EliminarSalaAdmin"} className="button" >ELIMINAR SALA</Link>
        <Link to={constants.root + "EliminarTorneoAdmin"} className="button" >ELIMINAR TORNEO</Link>
      </div>
    </div>
  );
}

export default HomeAdmin;