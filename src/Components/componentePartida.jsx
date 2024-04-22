import './componentePartida.css'
import { MyButton } from "../Components/MyButton";

const componentePartida = ({ name, dificultad, bet }) => {
  return (
    <div className="container">
    <div className="containerr">
      <div className='primero'>{name}</div>
      <div className="description">
        <p>Dificultad: {dificultad}</p>
        <p>Apuesta por mano: {bet}</p>
      </div>
      <MyButton className="button" color="midnightblue" size="xl" type="submit">Jugar</MyButton>
    </div>

  </div>
  );
};

export default componentePartida;