import './AgnadirProducto.css'; 
import { Link } from 'react-router-dom';
import constants from '../constants';
import { MyNavAdmin } from '../Components/MyNavAdmin'

function AgnadirProducto() {
  return (
    <div className="AgnadirProducto">
      <MyNavAdmin></MyNavAdmin>
      <div className="button-row">
        <Link to={constants.root + "AgnadirAvatar"} className="button" >AÑADIR AVATAR</Link>
        <Link to={constants.root + "AgnadirBaraja"} className="button">AÑADIR BARAJA</Link>
        <Link to={constants.root + "AgnadirTapete"} className="button">AÑADIR TAPETE</Link>
      </div>
    </div>
  );
}

export default AgnadirProducto;