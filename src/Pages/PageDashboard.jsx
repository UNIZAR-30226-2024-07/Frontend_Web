import { MyNav } from "../Components/MyNav";
import { MyAvatar } from "../Components/MyAvatar";
import { MyButton } from "../Components/MyButton";
import "./PageDashboard.css"

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import constants from "../constants";
export function PageDashboard() {
  const navigate = useNavigate();

  // Añadido por flavio para probar recompensa diaria////////////////////////////////////////////////////////////////
  const [getReward, setGetReward] = useState(true)
  const [reward, setReward] = useState(0)

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
    // Lógica para navegar a la pantalla de cambio de nombre de usuario
    navigate(constants.root + 'MenuPartidaPublica');
  };
  const handlePartidaPrivada = () => {
    // Lógica para navegar a la pantalla de cambio de nombre de usuario
    navigate(constants.root + '/PartidaPrivada');
  };
  const handlePartidaSolitario = () => {
    // Lógica para navegar a la pantalla de cambio de nombre de usuario
    navigate(constants.root + 'PartidaSolitario');
  };
  return (
    <>
    <div className="page-dashboard">
      <MyNav isLoggedIn={false} isDashboard={true}/>
      <div className="avatar-dashboard">
          <MyAvatar/>
      </div>
      <div className="option-dashboard">
          <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={() => handlePartidaPublica}>Partida Publica</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={() => handlePartidaPrivada}>Partida Privada</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered">Torneo</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={handlePartidaSolitario}>Partida Solitario</MyButton>
      </div>

      {/* Añadido por flavio para probar coinsReward *************************************************************/}
      <div>
        <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={() => handleGetReward(getReward)}>
          Reclamar recompensa diaria: {reward} : ¿Es posible obtenerla?: {getReward ? ("TRUE") : ("FALSE")}
        </MyButton>
      </div>
      {/* ******************************************************************************************************* */}

    </div>
    </>
  );
}
8