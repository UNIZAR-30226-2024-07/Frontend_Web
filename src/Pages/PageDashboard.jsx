import { MyNav } from "../Components/MyNav";
import { MyAvatar } from "../Components/MyAvatar";
import { MyButton } from "../Components/MyButton";
import "./PageDashboard.css"

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import constants from "../constants";
import { CustomButton } from "../Components/CustomButton";
export function PageDashboard() {
  const navigate = useNavigate();

  // Añadido por flavio para probar recompensa diaria////////////////////////////////////////////////////////////////
  const [getReward, setGetReward] = useState(true)
  const [reward, setReward] = useState(0)
  const [pageKey, setPageKey] = useState(false); // Estado para forzar la actualización del MyNav

  const updateStateReward = async() => {
    try {
      const response = await axios.get('/user/coinsDailyReward')
      if (response.status !== 200) {
        console.log("Fallo: ", response);
        throw new Error('Error', response);
      }
      setReward(response.data.coins)  // Monedas siguiente recompensa
      setGetReward(response.data.rewardDisponible)   // Se puede obtener hoy?

      console.log("reward: ", response.data.coins)
      console.log("disponible: " + (response.data.rewardDisponible))

    } catch (error) {
        console.error("Error:", error);
    }
  }

  const handleGetReward = async(getReward) => {
    try {
      console.log("Ejecutamos getReward")
      // Si se puede obtener la recompensa
      if (getReward) {
        const response = await axios.put('/user/getDailyReward')
        if (response.status !== 200) {
          console.log("Fallo: ", response);
          throw new Error('Error', response);
        }
        setReward(response.data.coins)
        setGetReward(response.data.rewardDisponible)
        setTimeout(() => {
          resetPage();
        }, 1000); // 1000 milisegundos = 1 segundo
      }
    } catch (error) {
        console.error("Error:", error);
    }
  }

  useEffect(() => {
    updateStateReward()
  }, [reward, getReward])

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handlePartidaPublica = () => {
    navigate(constants.root + 'PublicBoard');
  };
  const handlePartidaPrivada = () => {
    navigate(constants.root + 'PrivateBoard');
  };
  const handlePartidaTorneo = () => {
    navigate(constants.root + 'TournamentBoard');
  };
  const handlePartidaSolitario = () => {
    navigate(constants.root + 'SingleBoard');
  };

  // Función para reiniciar PageDashboard
  const resetPage = () => {
    setPageKey((prevKey) => prevKey + 1);
  };

  return (
    <>
    <div key={pageKey} className="page-dashboard">
      <MyNav isLoggedIn={false} isDashboard={true}/>
      <div className="avatar-dashboard">
          <MyAvatar/>
      </div>
      <div className="option-dashboard">
          <CustomButton text="Partida Publica" onClick={handlePartidaPublica} />
          <CustomButton text="Partida Privada" onClick={handlePartidaPrivada} />
          <CustomButton text="Torneo" onClick={handlePartidaTorneo} />
          <CustomButton text="Partida Solitario" onClick={handlePartidaSolitario} />
          
      </div>

      {getReward &&
        <div className="recompensa">
        <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={() => handleGetReward(getReward)}>
          Reclamar Recompensa: {reward} 
          <img src="./../../Frontend_Web/Imagenes/moneda.png" className="moneda-icono" />
        </MyButton>
      </div>
        }

    </div>
    </>
  );
}