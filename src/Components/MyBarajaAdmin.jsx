
import "./MyBarajaAdmin.css";
import { MyButton } from "../Components/MyButton";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import constants from '../constants'

export function MyBarajaAdmin({ baraja }) {
  const navigate = useNavigate();
  const handleEliminarBaraja = async () => {
    try {
      console.log("Id del avatar: " + baraja._id);
      const response = await axios.delete('/card/eliminate/' + baraja._id );
      if (response.status == 200) {
        console.log("Baraja eliminada");
        navigate(constants.root + 'HomeAdmin');
      }
      else{
        console.log("Fallo al eliminar baraja: ", response.data);
        throw new Error('Error al eliminar baraja');
      }
    } catch (error) {
      console.error("Error al eliminar baraja:", error);
    }
  };

  const handleModificarBaraja = async (baraja) => {
      console.log("Id de la baraja enviado: " + baraja._id);
      navigate(constants.root + 'ModificarBaraja/' + baraja._id);
  };

  return (
    <div className="circular-photo">
      <img src={baraja.imageFileName} alt="Card" className="photo" />
      <span className="name">{baraja.image}</span>
      <div className="button-container">
        <MyButton
              className="eliminar"
              color="midnightblue"
              size="xxl"
              type="submit"
              onClick={() => handleEliminarBaraja(baraja)}>
              Eliminar
        </MyButton>
        <MyButton
              className="modificar"
              color="midnightblue"
              size="xxl"
              type="submit"
              onClick={() => handleModificarBaraja(baraja)}>
              Modificar
        </MyButton>
      </div>
    </div>
  );
}
