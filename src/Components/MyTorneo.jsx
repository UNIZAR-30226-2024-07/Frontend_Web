import { Button } from "@nextui-org/react";
import axios from "./axios";
import "./MyTorneo.css";
import { useNavigate } from 'react-router-dom';
import constants from '../constants';

export function MyTorneo({ torneo }) {

    const navigate = useNavigate();
    const handleEliminateTorneo = async () => {
        try{
            const response =  await axios.delete(`/tournament/eliminate/${torneo._id}`);
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
    <div className="torneo">
      <span className="name">{torneo.name}</span>
      <Button className="nextui-button" onClick={handleEliminateTorneo}>Eliminar</Button>
    </div>
  );
}
