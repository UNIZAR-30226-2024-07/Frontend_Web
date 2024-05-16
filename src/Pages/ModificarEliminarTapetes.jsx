import { useState, useEffect} from "react";
import { MyNavAdmin } from "../Components/MyNavAdmin";
import axios from "../api/axios";
import './ModificarEliminarTapetes.css'
import { MyTapeteAdmin } from "../Components/MyTapeteAdmin";


function ModificarEliminarTapetes() {

    const [tapetes, setTapetes] = useState([]) ;
    
    useEffect(() => {
        const getTapetes= async () => {
            try {
                const response = await axios.get('/rug/getAllRugs');
                if (response.status !== 200) {
                    return console.error(response.data.rug);
                } else {
                    console.log("Tapetes cargados correctamente");
                    console.log(response.data);
                    setTapetes(response.data.rug);
                }
            } catch (e) {
                console.error("Error al pedir los tapetes. " + e.message);
            }
        };

        getTapetes(); // Llama a la función al cargar el componente

    }, []); // El array de dependencias está vacío para que se ejecute solo una vez


    return (
        <><MyNavAdmin></MyNavAdmin>
        <div className="modificar-eliminar-tapetes">
            <div className="lista">
                <div className="lista-contenedor">
                    {Array.isArray(tapetes) && tapetes.length > 0 ? (
                        tapetes.map((tapete) => (
                            <li className="avatar-list-item" key={tapete._id}>
                                {
                                    <MyTapeteAdmin tapete={tapete}></MyTapeteAdmin>
                                }
                            </li>
                        ))
                    ) : (
                        <p>No se encontraron tapetes.</p>
                    )}
                </div>
            </div>
        </div></>
    );
}

export default ModificarEliminarTapetes;
