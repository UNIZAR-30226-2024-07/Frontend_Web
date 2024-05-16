
import "./MyTapeteAdmin.css";
import { MyButton } from "../Components/MyButton";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import constants from '../constants'

export function MyTapeteAdmin({ tapete }) {
  const navigate = useNavigate();
  const handleEliminarTapete = async () => {
    try {
      console.log("Id del tapete: " + tapete._id);
      const response = await axios.delete('/rug/eliminate/' + tapete._id );
      if (response.status == 200) {
        console.log("Tapete eliminado");
        navigate(constants.root + 'HomeAdmin');
      }
      else{
        console.log("Fallo al eliminar tapete: ", response.data);
        throw new Error('Error al eliminar tapete');
      }
    } catch (error) {
      console.error("Error al eliminar tapete:", error);
    }
  };

  const handleModificarTapete = async (tapete) => {
      console.log("Id del tapete enviado: " + tapete._id);
      navigate(constants.root + 'ModificarTapete/' + tapete._id);
  };

  return (
    <div className="circular-photo">
      <img src={tapete.imageFileName} alt="Rug" className="photo" />
      <span className="name">{tapete.image}</span>
      <div className="button-container">
        <MyButton
              className="eliminar"
              color="midnightblue"
              size="xxl"
              type="submit"
              onClick={() => handleEliminarTapete(tapete)}>
              Eliminar
        </MyButton>
        <MyButton
              className="modificar"
              color="midnightblue"
              size="xxl"
              type="submit"
              onClick={() => handleModificarTapete(tapete)}>
              Modificar
        </MyButton>
      </div>
    </div>
  );
}
