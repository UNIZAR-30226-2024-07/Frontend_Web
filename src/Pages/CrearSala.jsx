import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios'

import './CrearSala.css';
import constants from '../constants';
import { MyForm } from '../Components/MyForm';
import {DropdownForm} from '../Components/DropdownForm';
import { MyNavAdmin } from '../Components/MyNavAdmin'

const CrearSala = () => {

    //const { signup } = useAuth();
    const navigate = useNavigate();
    // Estados para los campos de entrada
    const [nombre, setNombre] = useState('');
    const [apuesta, setApuesta] = useState('');
    const [nivel, setNivel] = useState('');
    const [jugadores, setJugadores] = useState('');

    // Manejador para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            name: nombre,
            bankLevel: nivel,
            bet: apuesta,
            numPlayers: jugadores

        };

        try {
            const response = await axios.post('/publicBoardType/add', formData)
            if (response.status == 200) {
                //history.push('/HomeAdmin');
                navigate(constants.root + 'HomeAdmin');
            }
            else {
                console.log("Fallo al añadir la sala: ", response.data);
                throw new Error('Error al añadir sala');
            }
            console.log('Respuesta:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
        // Limpiar los campos después de enviar el formulario
        setNombre('');
        setNivel('');
        setApuesta('');
        setJugadores('');
    };

    return (
        <div className="CrearSala">
            <MyNavAdmin></MyNavAdmin>
            <form className="questionnaire-container" onSubmit={handleSubmit}>
                <h2 className="questionnaire-title">Creación de nueva sala</h2>
                <MyForm
                    typeForm="nombreSala"
                    placeholderForm="Enter the game room name"
                    labelText="Game room"
                    className="form-element"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
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


                <MyForm
                    typeForm="apuesta"
                    placeholderForm="Enter the bet"
                    labelText="Bet"
                    className="form-element"
                    value={apuesta}
                    onChange={(e) => setApuesta(e.target.value)}
                />

                <DropdownForm
                    options={[
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" }
                    ]}
                    labelText="Number of players"
                    placeholderForm="Enter the number of players"
                    value={jugadores}
                    onChange={(e) => setJugadores(e.target.value)}
                />
                
                <Link to={constants.root} onClick={handleSubmit} className="submit-button">Confirmar</Link>
                
            </form>
        </div>
    );
}

export default CrearSala;