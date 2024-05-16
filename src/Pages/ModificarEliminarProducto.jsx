import './ModificarEliminarProducto.css'; 
import { Link } from 'react-router-dom';
import constants from '../constants';
import { MyNavAdmin } from '../Components/MyNavAdmin'

const ModificarEliminarProducto = () => {
  return (
    <div className="ModificarEliminarProducto">
      <MyNavAdmin></MyNavAdmin>
      <div className="button-row">
        <Link to={constants.root + "ModificarEliminarAvatares"} className="button" >AVATARES</Link>
        <Link to={constants.root + "ModificarEliminarBarajas"} className="button">BARAJAS</Link>
        <Link to={constants.root + "ModificarEliminarTapetes"} className="button">TAPETES</Link>
      </div>
    </div>
  );
}

export default ModificarEliminarProducto;
