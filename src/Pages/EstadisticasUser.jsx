import './EstadisticasUser.css'; // Estilos CSS
import { MyNav } from '../Components/MyNav';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from '../api/axios'; 
import {MyAvatar} from "../Components/MyAvatar";
import MyLoading from '../Components/MyLoading';

function EstadisticasUser() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [torneosGanados, setTorneosGanados] = useState(-1);
  const [monedasGanadas, setMonedasGanadas] = useState(-1);
  const [torneosJugados, setTorneosJugados] = useState(-1);
  const [finalesTorneos, setFinalesTorneos] = useState(-1);
  const [amigos, setAmigos] = useState(-1);
  const [avatares, setAvatares] = useState(-1);
  const [tapetes, setTapetes] = useState(-1);
  const [cartas, setCartas] = useState(-1);

  useEffect(() => {
    console.log("Entrando a useEffect");
  
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user/verify`);
        if (response.status !== 200) {
          console.log("Fallo al obtener user: ", response.data);
          throw new Error('Error al obtener user');
        }
        setUserData(response.data.user._id);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error.message);
      }
    };
  
    const fetchEstadisticas = async () => {
      try {
        if (!userData) return; // Salir si no se ha obtenido userData
  
        const fetchData = async (name) => {
          const response = await axios.get(`/stat/statByNameAndUser/${userData}/${name}`);
          return response.data.stat.value;
        };
  
        const [torneosGanadoRes, monedasGanadaRes,
          torneosJugadoRes, finalesTorneoRes,
          amigosRes, avataresRes,
          cartasRes, tapetesRes] = await Promise.all([
          fetchData('Torneos ganados'),
          fetchData('Monedas ganadas en partida'),
          fetchData('Torneos jugados'),
          fetchData('Finales de torneos jugadas'),
          fetchData('Número de amigos'),
          fetchData('Avatares adquiridos'),
          fetchData('Tapetes adquiridos'),
          fetchData('Cartas adquiridas')
        ]);
  
        setTorneosGanados(torneosGanadoRes);
        setMonedasGanadas(monedasGanadaRes);
        setTorneosJugados(torneosJugadoRes);
        setFinalesTorneos(finalesTorneoRes);
        setAmigos(amigosRes);
        setAvatares(avataresRes);
        setCartas(cartasRes);
        setTapetes(tapetesRes);
        
        console.log("terminado");
      } catch (error) {
        console.error('Error al obtener las estadísticas:', error.message);
      }
    };
  
    fetchUserData();
    fetchEstadisticas();

    if (torneosGanados !== -1 && monedasGanadas !== -1 &&
      torneosJugados !== -1 && finalesTorneos !== -1 &&
      amigos !== -1 && avatares !== -1 &&
      cartas !== -1 && tapetes !== -1) {
      setLoading(false);
    }
  }, [userData, torneosGanados, monedasGanadas,
    torneosJugados, finalesTorneos,
    amigos, avatares,
    cartas, tapetes]);

  if (loading) {
    return <div><MyLoading /></div>;
  }
    
  return (
  
  <div className='estadisticas-user'>
    <MyNav isLoggedIn={false} isDashboard={false} />
    <div className="avatar">
      <MyAvatar/>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div className="container-stats" style={{ maxWidth: '40%', flex: '1' }}>
        <div className="rectangulo-rojo">
          <p>Cartas adquiridas</p>
          <p>{cartas}</p>
        </div>
        <div className="rectangulo-rojo">
          <p>Avatares adquiridos</p>
          <p>{avatares}</p>
        </div>
        <div className="rectangulo-rojo">
          <p>Tapetes Adquiridos</p>
          <p>{tapetes}</p>
        </div>
        <div className="rectangulo-rojo">
          <p>Finales de torneo jugadas</p>
          <p>{finalesTorneos}</p>
        </div>
      </div>

      <div className="container-stats" style={{ maxWidth: '40%', flex: '1' }}>
        <div className="rectangulo-rojo">
          <p>Numero de amigos</p>
          <p>{amigos}</p>
        </div>
        <div className="rectangulo-rojo">
          <p>Torneos jugados</p>
          <p>{torneosJugados}</p>
        </div>
        <div className="rectangulo-rojo">
          <p>Monedas ganadas en partida</p>
          <p>{monedasGanadas}</p>
        </div>
        <div className="rectangulo-rojo">
          <p>Torneos Ganados</p>
          <p>{torneosGanados}</p>
        </div>
      </div>
    </div>
  </div>
  );
}

export default EstadisticasUser;
