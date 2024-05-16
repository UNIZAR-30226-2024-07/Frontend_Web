import { MyNav } from "../Components/MyNav";
import { FaArrowRightLong } from "react-icons/fa6";

import "./PageRoundsTournament.css"

const PageRoundsTournament = ({ activeRound, funtion, parametros}) => {
    return (
        <div className="rounds-tournament">
            <MyNav isLoggedIn={false} isDashboard={false} />
            <div className="content-container">
                <div className="image-container">
                    <div className="image-with-text">
                        <span className="text-overlay active">OCTAVOS</span>
                        <img src="./../../Frontend_Web/Imagenes/fotoRonda.jpeg" alt="Ronda" className={`tournament-image ${activeRound === 8 ? 'border-blue' : activeRound <= 4 ? 'border-green' : ''}`} />
                        {activeRound <= 4  && 
                        
                        <img src="./../../Frontend_Web/Imagenes/superada.jpg" alt="Ronda" className='superada'/>
                      
                        
                        }
                    </div>
                    <FaArrowRightLong className="arrow-icon" />
                    <div className="image-with-text">
                        <span className="text-overlay active">CUARTOS</span>
                        <img src="./../../Frontend_Web/Imagenes/fotoRonda.jpeg" alt="Ronda Torneo" className={`tournament-image ${activeRound === 4 ? 'border-blue' : activeRound <= 2 ? 'border-green' : ''}`} />
                         {activeRound <= 2 && 
                         
                         <img src="./../../Frontend_Web/Imagenes/superada.jpg" alt="Ronda" className='superada'/>
                         
                         }

                    </div>
                    <FaArrowRightLong className="arrow-icon" />
                    <div className="image-with-text">
                        <span className="text-overlay active">SEMIFINAL</span>
                        <img src="./../../Frontend_Web/Imagenes/fotoRonda.jpeg" alt="Ronda Torneo" className={`tournament-image ${activeRound === 2 ? 'border-blue' : activeRound <= 1 ? 'border-green' : ''}`} />
                        {activeRound <= 1 && 
                        
                        <img src="./../../Frontend_Web/Imagenes/superada.jpg" alt="Ronda" className='superada'/>
                        }
                    </div>
                    <FaArrowRightLong className="arrow-icon" />
                    <div className="image-with-text">
                        <span className="text-overlay active">FINAL</span>
                        <img src="./../../Frontend_Web/Imagenes/trofeo.png" alt="Ronda Torneo" className={`tournament-image ${activeRound === 1 ? 'border-blue' : ''}`} />
                    </div>
                </div>
            </div>
            <div>
            <button className="red-button" onClick={() => funtion(parametros)} ><FaArrowRightLong></FaArrowRightLong></button> {/* Botón rojo */}
            </div>
        </div>
    );
};

export default PageRoundsTournament;
