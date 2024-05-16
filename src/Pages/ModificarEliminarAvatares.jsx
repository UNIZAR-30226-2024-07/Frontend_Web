import { useState, useEffect} from "react";
import { MyNavAdmin } from "../Components/MyNavAdmin";
import axios from "../api/axios";
import './ModificarEliminarAvatares.css'
import { MyAvatarAdmin } from "../Components/MyAvatarAdmin";


function ModificarEliminarAvatares() {

    const [avatars, setAvatars] = useState([]) ;
    
    useEffect(() => {
        const getAvatars = async () => {
            try {
                const response = await axios.get('/avatar/getAllAvatars');
                if (response.status !== 200) {
                    return console.error(response.data.avatars);
                } else {
                    console.log("Avatares cargados correctamente");
                    console.log(response.data);
                    setAvatars(response.data.avatar);
                }
            } catch (e) {
                console.error("Error al pedir los avatares. " + e.message);
            }
        };

        getAvatars(); // Llama a la función al cargar el componente

    }, []); // El array de dependencias está vacío para que se ejecute solo una vez


    return (
        <><MyNavAdmin></MyNavAdmin>
        <div className="modificar-eliminar-avatares">
            <div className="lista">
                <div className="lista-contenedor">
                    {Array.isArray(avatars) && avatars.length > 0 ? (
                        avatars.map((avatar) => (
                            <li className="avatar-list-item" key={avatar._id}>
                                {
                                    <MyAvatarAdmin avatar={avatar}></MyAvatarAdmin>
                                }
                            </li>
                        ))
                    ) : (
                        <p>No se encontraron avatares.</p>
                    )}
                </div>
            </div>
        </div></>
    );
}

export default ModificarEliminarAvatares;
