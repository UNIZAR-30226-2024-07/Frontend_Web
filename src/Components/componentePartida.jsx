import './componentePartida.css'
import { MyButton } from "../Components/MyButton";
import { useNavigate } from 'react-router-dom';
import constants from '../constants';

const ComponentePartida = ({ id, name, dificultad, bet }) => {
  const navigate = useNavigate()
  return (
    <div className="container">
    <div className="containerr">
      <div className='primero'>{name}</div>
      <div className="description">
        <p>Dificultad: {dificultad}</p>
        <p>Apuesta por mano: {bet}</p>
        <MyButton 
          className="jugar" 
          color="midnightblue" 
          size="xxl" 
          type="submit" 
          onClick={() => navigate(constants.root + "PublicBoard/" + id)}>
            Jugar
        </MyButton>
      </div>
    </div>

  </div>
  );
};

export default ComponentePartida;