import './EstadisticasUser.css'; // Estilos CSS
import { MyNav } from '../Components/MyNav';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from '../api/axios'; 

function EstadisticasUser() {
  const [userData, setUserData] = useState(null);
  // const [torneosGanados, setTorneosGanados] = useState(0);
  // const [monedasGanadas, setMonedasGanadas] = useState(0);
  // const [torneosJugados, setTorneosJugados] = useState(0);
  // const [finalesTorneos, setFinalesTorneos] = useState(0);
  const [amigos, setAmigos] = useState(0);
  const [avatares, setAvatares] = useState(0);
  const [tapetes, setTapetes] = useState(0);
  const [cartas, setCartas] = useState(0);

  
  useEffect(() =>{
    console.log("Entrando a useEffect");
    async function fetchUserData() {
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
    }
    async function fetchEstadisticas() {
      try {
        if (!userData) return; // Salir si no se ha obtenido userData

        // const responseTorneosGanados = await axios.get(`/stat/statByNameAndUser/${userData}/Torneos ganados`);
        // setTorneosGanados(responseTorneosGanados.data.stat.value);
        // const responseMonedasGanadas = await axios.get(`/stat/statByNameAndUser/${userData}/Monedas ganadas en partida`);
        // setMonedasGanadas(responseMonedasGanadas.data.stat.value);
        // const responseTorneoJugados = await axios.get(`/stat/statByNameAndUser/${userData}/Torneos jugados`);
        // setTorneosJugados(responseTorneoJugados.data.stat.value);
        // const responseFinalesTorneo = await axios.get(`/stat/statByNameAndUser/${userData}/Finales de torneos jugadas`);
        // setFinalesTorneos(responseFinalesTorneo.data.stat.value);
        const responseAmigos = await axios.get(`/stat/statByNameAndUser/${userData}/Número de amigos`);
        setAmigos(responseAmigos.data.stat.value);
        const responseAvatar = await axios.get(`/stat/statByNameAndUser/${userData}/Avatares adquiridos`);
        setAvatares(responseAvatar.data.stat.value);
        const responseCarta = await axios.get(`/stat/statByNameAndUser/${userData}/Tapetes adquiridos`);
        setCartas(responseCarta.data.stat.value);
        const responseTapete = await axios.get(`/stat/statByNameAndUser/${userData}/Cartas adquiridas`);
        setTapetes(responseTapete.data.stat.value);
        console.log("terminado");
      } catch (error) {
          console.error('Error al obtener las estadísticas:', error.message);
      }
    }
    fetchUserData();
    fetchEstadisticas();
  }, [userData]);

    
  return (
    <div className='estadisticas-user'>
      <MyNav isLoggedIn={false} isDashboard={true} />
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div className="container-stats">
        <div className="stat-pair">
          <div className="stat-item">Numero de amigos</div>
          <div className="stat-value">{amigos}</div>
        </div>
        <div className="stat-pair">
          <div className="stat-item">Avatares adquiridos</div>
          <div className="stat-value">{avatares}</div>
        </div>
        <div className="stat-pair">
          <div className="stat-item">Tapetes adquiridos</div>
          <div className="stat-value">{tapetes}</div>
        </div>
        <div className="stat-pair">
          <div className="stat-item">Cartas adquiridos</div>
          <div className="stat-value">{cartas}</div>
        </div>
        </div>

        <div className="container-stats">
        <div className="stat-pair">
          <div className="stat-item">Numero de amigos</div>
          <div className="stat-value">{amigos}</div>
        </div>
        <div className="stat-pair">
          <div className="stat-item">Avatares adquiridos</div>
          <div className="stat-value">{avatares}</div>
        </div>
        <div className="stat-pair">
          <div className="stat-item">Tapetes adquiridos</div>
          <div className="stat-value">{tapetes}</div>
        </div>
        <div className="stat-pair">
          <div className="stat-item">Cartas adquiridos</div>
          <div className="stat-value">{cartas}</div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default EstadisticasUser;
