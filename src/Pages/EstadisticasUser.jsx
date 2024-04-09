import './EstadisticasUser.css'; // Estilos CSS
import { MyNav } from '../Components/MyNav';
import { useState } from 'react';


function EstadisticasUser() {
    const [partidasTotales, setPartidasTotales] = useState(100);
    const [partidasGanadas, setPartidasGanadas] = useState(80);
    const [partidasPerdidas, setPartidasPerdidas] = useState(20);
  
    return (
      <div className='estadisticas-user'>
        <MyNav isLoggedIn={false} isDashboard={true} />
        <div className="container-stats">
          <div className="stat-item">Partidas Totales</div>
          <div className="stat-value">{partidasTotales}</div>
          <div className="stat-item">Partidas Ganadas</div>
          <div className="stat-value">{partidasGanadas}</div>
          <div className="stat-item">Partidas Perdidas</div>
          <div className="stat-value">{partidasPerdidas}</div>
        </div>
      </div>
    );
}

export default EstadisticasUser;
