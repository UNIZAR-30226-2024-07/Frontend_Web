import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios'

import './AgnadirTorneo.css';
import constants from '../constants';
import { MyForm } from '../Components/MyForm';
import {DropdownForm} from '../Components/DropdownForm';
import { MyNavAdmin } from '../Components/MyNavAdmin'

const AgnadirTorneo = () => {

    //const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Estados para los campos de entrada
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [nivel, setNivel] = useState('');

    // Manejador para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            name: nombre,
            price: precio,
            bankLevel: nivel
        };

        if(formData.name =='' || formData.price =='' || formData.bankLevel ==''){
            setError('Todos los campos deben de estar completados')
            return;
          }

        try {
            const response = await axios.post('/tournament/add',formData)
            if (response.status == 200) {
                navigate(constants.root + 'HomeAdmin');
            }
            else {
                console.log("Fallo al crear el torneo: ", response.data);
                throw new Error('Error al crear torneo');
            }
            console.log('Respuesta:', response.data);
        } catch (error) {
            console.error('Error:', error);
            setError('El nombre de torneo que estás intentando utilizar ya está en uso')
        }
        // Limpiar los campos después de enviar el formulario
        setNombre('');
        setNivel('');
        setPrecio('');
    };

    return (
        <div className="AgnadirTorneo">
            <MyNavAdmin></MyNavAdmin>
            <form className="questionnaire-container" onSubmit={handleSubmit}>
                <h2 className="questionnaire-title">Creación de nuevo torneo</h2>
                <MyForm
                    typeForm="text"
                    placeholderForm="Enter the tournament name"
                    labelText="Tournament name"
                    className="form-element"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

                <MyForm
                    typeForm="number"
                    placeholderForm="Enter the entry price"
                    labelText="Price"
                    className="form-element"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />

                <DropdownForm
                    options={[
                        { label: "Beginner", value: "beginner" },
                        { label: "Medium", value: "medium" },
                        { label: "Expert", value: "expert" }
                    ]}
                    labelText="Bot level"
                    placeholderForm="Enter the level of the bot"
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value)}
                />
                
                <Link to={constants.root} onClick={handleSubmit} className="submit-button">Confirmar</Link>
                
            </form>
            {error && <div className="error-login">{error}</div>}
        </div>
    );
}

export default AgnadirTorneo;