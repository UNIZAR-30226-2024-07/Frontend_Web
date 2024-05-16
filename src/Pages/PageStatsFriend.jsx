import './PageStatsFriend.css'; // Estilos CSS
import { MyNav } from '../Components/MyNav';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from '../api/axios'; 
import {MyAvatar} from "../Components/MyAvatar";
import MyLoading from '../Components/MyLoading';
import { useParams } from 'react-router-dom';

const PageStatsFriend = () => {
  const { id } = useParams()
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
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Entrando a useEffect");
  
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/user/userById/' + id);
        if (response.status !== 200) {
          console.log("Fallo al obtener user: ", response.data);
          throw new Error('Error al obtener user');
        }
        setUserData(response.data.user);
        console.log(response.data.user)
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error.message);
      }
    };
  
    const fetchEstadisticas = async () => {
      try {
        if (!userData) return; // Salir si no se ha obtenido userData
  
        const getAllStatsByUser = async () => {
          const response = await axios.get('/stat/getAllStatsByUser/' + id);
          if (response.status !== 200) {
            throw new Error("Error al pedir estadísticas")
          } else {
            console.log(response.data.userStats)
            let value1 = response.data.userStats.find(item => item.name === 'Torneos ganados')
            setTorneosGanados(value1.value)

            let value2 = response.data.userStats.find(item => item.name === 'Monedas ganadas en partida')
            setMonedasGanadas(value2.value)

            let value3 = response.data.userStats.find(item => item.name === 'Torneos jugados')
            setTorneosJugados(value3.value)

            let value4 = response.data.userStats.find(item => item.name === 'Finales de torneos jugadas')
            setFinalesTorneos(value4.value)

            let value5 = response.data.userStats.find(item => item.name === 'Número de amigos')
            setAmigos(value5.value)

            let value6 = response.data.userStats.find(item => item.name === 'Avatares adquiridos')
            setAvatares(value6.value)

            let value7 = response.data.userStats.find(item => item.name === 'Tapetes adquiridos')
            setTapetes(value7.value)

            let value8 = response.data.userStats.find(item => item.name === 'Cartas adquiridas')
            setCartas(value8.value)

          }
        }
  
        await getAllStatsByUser()
        
        console.log("terminado");
      } catch (error) {
        console.error('Error al obtener las estadísticas:', error.message);
        setError("No se pueden obtener las estadisticas correctamente")
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
    cartas, tapetes, id]);

  if (loading) {
    return <div>
      <MyNav isLoggedIn={false} isDashboard={false} />
      <MyLoading />
      {error && ( 
      <div className="error-login">
        {error}
      </div>
    )}</div>;
  }
    
  return (
  
  <div className='estadisticas-user'>
    <MyNav isLoggedIn={false} isDashboard={false} />
    <div className="avatarFriendStat">
        <img src={userData.avatar} alt="User" className="photo"/>
        <p style={{ justifySelf: 'center', alignSelf: 'center', fontWeight: 'bold', color: 'white', fontSize: '22px'}}> {userData.nick} </p>
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
    {error && ( 
    <div className="error-login">
      {error}
    </div>
  )}
  </div>
  
  );
}

export default PageStatsFriend;
