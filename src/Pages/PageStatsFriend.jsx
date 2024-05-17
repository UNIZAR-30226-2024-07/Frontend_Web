import './PageStatsFriend.css'; // Estilos CSS
import { MyNav } from "../Components/MyNav";
import { useState, useEffect } from 'react';
import axios from '../api/axios'; 
import { useParams } from 'react-router-dom';
import constants from '../constants';


export function PageStatsFriend() {
    
    const { id } = useParams(); // Obtener el ID de los parámetros de la URL
    const [userData, setUserData] = useState(null);
    const [avatares, setAvatares] = useState(null);
    const [torneosGanados, setTorneosGanados] = useState(null);
    const [monedasGanadas, setMonedasGanadas] = useState(null);
    const [torneosJugados, setTorneosJugados] = useState(null);
    const [finalesTorneos, setFinalesTorneos] = useState(null);
    const [amigos, setAmigos] = useState(null);
    const [tapetes, setTapetes] = useState(null);
    const [cartas, setCartas] = useState(null);
    const [error, setError] = useState(null);

  const [avataresUser, setAvataresUser] = useState(null);

  useEffect(() => {
    console.log("Entrando a useEffect");

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user/userById/${id}`);
        if (response.status !== 200) {
          console.log("Fallo al obtener user: ", response.data);
          throw new Error('Error al obtener user');
        }
        setUserData(response.data.user);
        console.log(response.data.user);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error.message);
        setError('Error al obtener la información del usuario');
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        if (!userData) return; // Salir si no se ha obtenido userData

        console.log("MI ID ES:", id);
        const avatarResponse = await axios.get(`/avatar/currentAvatarById/${id}`);
        console.log("Mi avatar es", avatarResponse.data);
        if (avatarResponse.status !== 200) {
          console.log("Fallo: ", avatarResponse);
          throw new Error('Error al obtener avatar');
        }

        console.log("EL VATAR ES:", avatarResponse.data.avatar.imageFileName);
        setAvataresUser(avatarResponse.data.avatar.imageFileName);


        const statsResponse = await axios.get(`/stat/getAllStatsByUser/${id}`);
        if (statsResponse.status !== 200) {
          throw new Error("Error al pedir estadísticas");
        } else {
          console.log(statsResponse.data.userStats);
          let value1 = statsResponse.data.userStats.find(item => item.name === 'Torneos ganados');
          setTorneosGanados(value1?.value || 0);

          let value2 = statsResponse.data.userStats.find(item => item.name === 'Monedas ganadas en partida');
          setMonedasGanadas(value2?.value || 0);

          let value3 = statsResponse.data.userStats.find(item => item.name === 'Torneos jugados');
          setTorneosJugados(value3?.value || 0);

          let value4 = statsResponse.data.userStats.find(item => item.name === 'Finales de torneos jugadas');
          setFinalesTorneos(value4?.value || 0);

          let value5 = statsResponse.data.userStats.find(item => item.name === 'Número de amigos');
          setAmigos(value5?.value || 0);

          let value6 = statsResponse.data.userStats.find(item => item.name === 'Avatares adquiridos');
          setAvatares(value6?.value || 0);

          let value7 = statsResponse.data.userStats.find(item => item.name === 'Tapetes adquiridos');
          setTapetes(value7?.value || 0);

          let value8 = statsResponse.data.userStats.find(item => item.name === 'Cartas adquiridas');
          setCartas(value8?.value || 0);


        }

      } catch (error) {
        console.error('Error al obtener las estadísticas:', error.message);
        setError("No se pueden obtener las estadisticas correctamente");

      }
    };

    fetchEstadisticas();
  }, [id, userData]);
    
    return (
        <div className='estadisticas-user'>
        <MyNav isLoggedIn={false} isDashboard={false} />
        <div className='avatar-friend'>
          <img src={constants.dirApi + "/" + constants.uploadsFolder + "/" + avataresUser}className="avatar-image" alt="Avatar" />
          <p className="avatar-description">{userData?.nick}</p>
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
              <p>Número de amigos</p>
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
