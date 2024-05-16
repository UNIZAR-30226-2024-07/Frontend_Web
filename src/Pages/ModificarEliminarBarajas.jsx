import { useState, useEffect} from "react";
import { MyNavAdmin } from "../Components/MyNavAdmin";
import axios from "../api/axios";
import './ModificarEliminarBarajas.css'
import { MyBarajaAdmin } from "../Components/MyBarajaAdmin";


const ModificarEliminarBarajas = () => {

    const [barajas, setBarajas] = useState([]) ;
    
    useEffect(() => {
        const getBarajas = async () => {
            try {
                const response = await axios.get('/card/getAllCards');
                if (response.status !== 200) {
                    return console.error(response.data.cards);
                } else {
                    console.log("Barajas cargadas correctamente");
                    console.log(response.data);
                    setBarajas(response.data.card);
                }
            } catch (e) {
                console.error("Error al pedir las barajas. " + e.message);
            }
        };

        getBarajas(); // Llama a la función al cargar el componente

    }, []); // El array de dependencias está vacío para que se ejecute solo una vez


    return (
        <><MyNavAdmin></MyNavAdmin>
        <div className="modificar-eliminar-barajas">
            <div className="lista">
                <div className="lista-contenedor">
                    {Array.isArray(barajas) && barajas.length > 0 ? (
                        barajas.map((baraja) => (
                            <li className="avatar-list-item" key={baraja._id}>
                                {
                                    <MyBarajaAdmin baraja={baraja}></MyBarajaAdmin>
                                }
                            </li>
                        ))
                    ) : (
                        <p>No se encontraron barajas.</p>
                    )}
                </div>
            </div>
        </div></>
    );
}

export default ModificarEliminarBarajas;
