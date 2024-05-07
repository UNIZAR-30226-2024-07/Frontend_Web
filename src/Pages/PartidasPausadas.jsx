import { MyNav } from '../Components/MyNav';
import axios from "../api/axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import './PartidasPausadas.css'
import constants from '../constants';

const PartidasPausadas = () => {
    const navigate = useNavigate()
    const [partidaPausada, setPartidaPausada] = useState("")

    const tiposPartidas = [
        { name: "Pública", type: "public", path: constants.root + "PausedPublicBoard/" },
        { name: "Privada", type: "private", path: constants.root + "PausedPrivateBoard/" },
        { name: "Torneo", type: "tournament", path: constants.root + "PausedTournamentBoard/" },
    ];
    
    const getPartidaPausada = async () => {
        try {
            const response = await axios.get('/user/getPausedBoard')
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            } else {
                if (response.data.exists) {
                    setPartidaPausada({id: response.data.pausedBoard, 
                                       boardType: response.data.boardType})
                }
            }
        } catch (e) {
            console.error("Error:", e)
        }
    }
        
    useEffect(() => {
        getPartidaPausada()
    }, [])

    return (
        <div className='page-publica'>
        <MyNav isLoggedIn={false} isDashboard={false} monedas={true}/>
        <div className='lista-pausadas'>
            <div className='tipo-partida'>
            {tiposPartidas.map((item, index) => (
                <div className={item.name} key={index}>
                    <div className='cont-partida'>
                    <div className='partida'>
                        <p> Partida {item.name} </p>
                    </div>
                    {partidaPausada != "" && item.type == partidaPausada.boardType ? (
                        <div className='partida-pausada'>
                            <p> Partida pausada </p>
                            <button className='reanudar' onClick={() => navigate(item.path + partidaPausada.id)}> Reanudar </button>
                        </div>
                    ) : (
                        <div className='no-partida-pausada'>
                            <p> No hay partidas pausadas </p>
                        </div>
                    )}
                    </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    )
}

export default PartidasPausadas