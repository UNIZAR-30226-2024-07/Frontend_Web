
import "./MyUser.css";
import { MyButton } from "../Components/MyButton";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import constants from '../constants'

export function MyUser({ user }) {
  const navigate = useNavigate();
  const handleEliminarUsuario = async () => {
    try {
      console.log("Id del usuario: " + user._id);
      const response = await axios.delete('/user/eliminate/' + user._id );
      if (response.status == 200) {
        console.log("Usuario eliminado");
        navigate(constants.root + 'HomeAdmin');
      }
      else{
        console.log("Fallo al eliminar usuario: ", response.data);
        throw new Error('Error al eliminar usuario');
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="circular-photo">
      <img src={user.avatar} alt="User" className="photo" />
      <span className="name">{user.name}</span>
      <div className="button-container">
        <MyButton
              className="eliminar"
              color="midnightblue"
              size="xxl"
              type="submit"
              onClick={() => handleEliminarUsuario(user)}>
              Eliminar
        </MyButton>
      </div>
    </div>
  );
}
