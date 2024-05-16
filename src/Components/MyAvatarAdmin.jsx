
import "./MyAvatarAdmin.css";
import { MyButton } from "../Components/MyButton";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import constants from '../constants'

export function MyAvatarAdmin({ avatar }) {
  const navigate = useNavigate();
  const handleEliminarAvatar = async () => {
    try {
      console.log("Id del avatar: " + avatar._id);
      const response = await axios.delete('/avatar/eliminate/' + avatar._id );
      if (response.status == 200) {
        console.log("Avatar eliminado");
        navigate(constants.root + 'HomeAdmin');
      }
      else{
        console.log("Fallo al eliminar avatar: ", response.data);
        throw new Error('Error al eliminar avatar');
      }
    } catch (error) {
      console.error("Error al eliminar avatar:", error);
    }
  };

  const handleModificarAvatar = async (avatar) => {
      console.log("Id del avatar enviado: " + avatar._id);
      navigate(constants.root + 'ModificarAvatar/' + avatar._id);
  };

  return (
    <div className="circular-photo">
      <img src={avatar.imageFileName} alt="Avatar" className="photo" />
      <span className="name">{avatar.image}</span>
      <div className="button-container">
        <MyButton
              className="eliminar"
              color="midnightblue"
              size="xxl"
              type="submit"
              onClick={() => handleEliminarAvatar(avatar)}>
              Eliminar
        </MyButton>
        <MyButton
              className="eliminar"
              color="midnightblue"
              size="xxl"
              type="submit"
              onClick={() => handleModificarAvatar(avatar)}>
              Modificar
        </MyButton>
      </div>
    </div>
  );
}
