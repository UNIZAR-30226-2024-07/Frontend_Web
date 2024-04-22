import './MenuPartidaPublica.css'; // Importa el archivo CSS
import ComponentePartida from "../Components/componentePartida";
import { MyNav } from '../Components/MyNav';
import axios from '../api/axios';
import { useEffect, useState } from 'react';


const MenuPartidaPublica = () => {
    const [inf, setInf] = useState(0);
    useEffect(() => {
        informacion();
    }, []);
        
    const informacion = async () => {
        try {
            const response = await axios.get('/publicBoardType/getAll');
            setInf(response.data.publicBoardTypes);
            console.log(response);
        } catch (error) {
            console.error('Failed to load partidas:', error);
        }
    };
  return (
    <div className='page-publica'>
      <MyNav isLoggedIn={false} isDashboard={true} /> 
        <div className='titulo'>
          Partidas publicas
        </div>
        <div className="lista">
        {Array.isArray(inf) && inf.length > 0 ? (
            inf.map((tipoPartida) => (
                <ComponentePartida
                    key={tipoPartida._id}
                    name={tipoPartida.name}
                    dificultad={tipoPartida.bankLevel}
                    bet={tipoPartida.bet}
                    // Otras props según la estructura de tus datos
                    className='componente-partida'
                />
            ))
        ) : (
            <p>No se encontraron tipos de partidas públicas.</p>
        )}
        </div>
    </div>
  );
};

export default MenuPartidaPublica;