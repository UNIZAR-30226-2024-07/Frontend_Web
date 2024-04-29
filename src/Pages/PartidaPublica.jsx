import './PartidaPublica.css'
import { MyNav } from '../Components/MyNav';
import { useState } from 'react';
import { FaRegPauseCircle } from 'react-icons/fa';

const PartidaPublica = () => {
    const [pausa, setPausa] = useState(false);

    const handlePauseIconClick = (a) => {
        // Aquí puedes agregar la lógica que se ejecutará cuando se haga clic en el icono de pausa
        if(a === 1){
            setPausa(true);
        }
        else if(a === 2){
            setPausa(false);
        }
        else if(a === 3){
            setPausa(false);
        }
        else if(a === 4){
            setPausa(false);
        }
        
        console.log('Icono de pausa clicado');

    };

    
    return (
    <div className="partida-publica">
        <MyNav isLoggedIn={false} isDashboard={false}/>
        <span className="pause-icon" onClick={handlePauseIconClick(1)}>
            <FaRegPauseCircle />
        </span>
        
        {pausa && 
            <div className="mensaje-pausa">
                <button onClick={handlePauseIconClick(2)}>Abandonar partida</button>
                <button onClick={handlePauseIconClick(3)}>Ver jugadores</button>
                <button onClick={handlePauseIconClick(4)}>Reanudar partida</button>
            </div>
        }
    </div>
    
  );
};

export default PartidaPublica;
