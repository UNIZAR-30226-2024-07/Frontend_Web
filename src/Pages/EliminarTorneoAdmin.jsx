import { useState, useEffect} from "react";
import { MyNavAdmin } from "../Components/MyNavAdmin";
import { MyButton } from "../Components/MyButton";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom"
import constants from '../constants'
import "./EliminarTorneoAdmin.css"
import { getTorneos } from './TournamentBoard/TournamentBoardFunctions'


function EliminarTorneoAdmin() {

    const navigate = useNavigate();
    const [torneos, setTorneos] = useState([]) ;
    useEffect(() => {
        getTorneos(setTorneos)
    }, [])
    const handleEliminateTorneo = async (torneo) => {
        try{
            console.log("ID DEL TORNEO A ELIMINAR: " + torneo._id);
            const response =  await axios.delete('/tournament/eliminate/' + torneo._id);
            if(response.status != 200){
                console.log("Fallo al eliminar torneo: ", response.data);
                throw new Error('Error al eliminar torneo');
            }
            else{
                navigate(constants.root + 'HomeAdmin');
            }
        }
        catch (error){
            throw new Error(`Error al eliminar el torneo: ${error.message}`);
        }
    }

    return (
        <><MyNavAdmin></MyNavAdmin>
        <div className="EliminarTorneo">
            <div className="lista">
                {Array.isArray(torneos) && torneos.length > 0 ? (
                    torneos.map((torneo) => (
                        <div key={torneo._id}>
                            <div className="container">
                                <div className="containerr">
                                    <div className='primero'>{torneo.name} <hr /> </div>
                                    <div className="description">
                                        <div className="dif-bet">
                                            <p className="dificultad">Dificultad: <span className={torneo.bankLevel}>{torneo.bankLevel}</span></p>
                                            <p> Precio de entrada: {torneo.price} </p>
                                            <p className="premios">
                                                {torneo.coins_winner}
                                                <img className="medalla"
                                                    key={'winner' + torneo._id}
                                                    style={{ marginRight: '20px' }}
                                                    src={constants.root + "Imagenes/medalla_ganador.png"} />
                                                {torneo.coins_subwinner}
                                                <img className="medalla"
                                                    key={'subwinner' + torneo._id}
                                                    src={constants.root + "Imagenes/medalla_segundo.png"} />
                                            </p>
                                        </div>
                                        <MyButton
                                            className="jugar"
                                            color="midnightblue"
                                            size="xxl"
                                            type="submit"
                                            onClick={() => handleEliminateTorneo(torneo)}>
                                            Eliminar
                                        </MyButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron torneos.</p>
                )}
            </div>
        </div></>
    );
}

export default EliminarTorneoAdmin;
