import { useState, useEffect} from "react";
import { MyNavAdmin } from "../Components/MyNavAdmin";
import { MyButton } from "../Components/MyButton";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom"
import constants from '../constants'
import "./EliminarSalaAdmin.css"
import { getPartidasPublicas } from './PublicBoard/PublicBoardFunctions'


const EliminarSalaAdmin = () => {

    const navigate = useNavigate();
    const [salas, setSalas] = useState([]) ;
    useEffect(() => {
        getPartidasPublicas(setSalas)
    }, [])
    const handleEliminateSala = async (sala) => {
        const body = {
            name: sala.name
        };
        try{
            const response = await axios.delete(`/publicBoardType/eliminate`, { data: body });
            if(response.status != 200){
                console.log("Fallo al eliminar sala: ", response.data);
                throw new Error('Error al eliminar sala');
            }
            else{
                navigate(constants.root + 'HomeAdmin');
            }
        }
        catch (error){
            throw new Error(`Error al eliminar la sala: ${error.message}`);
        }
    }

    return (
        <><MyNavAdmin></MyNavAdmin>
        <div className="EliminarSala">
            <div className="lista">
                {Array.isArray(salas) && salas.length > 0 ? (
                    salas.map((sala) => (
                        <div key={sala._id}>
                            <div className="container">
                                <div className="containerr">
                                    <div className='primero'>{sala.name} <hr /> </div>
                                    <div className="description">
                                        <div className="dif-bet">
                                            <p className="dificultad">Dificultad: <span className={sala.bankLevel}>{sala.bankLevel}</span></p>
                                            <p> Precio de entrada: {sala.bet} </p>
                                        </div>
                                        <MyButton
                                            className="jugar"
                                            color="midnightblue"
                                            size="xxl"
                                            type="submit"
                                            onClick={() => handleEliminateSala(sala)}>
                                            Eliminar
                                        </MyButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron salas.</p>
                )}
            </div>
        </div></>
    );
}

export default EliminarSalaAdmin;
