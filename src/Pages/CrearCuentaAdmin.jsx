import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios'

import '../CrearCuentaAdmin.css';
import constants from '../constants';
import { MyForm } from '../Components/MyForm';
import { MyFormPasswd } from '../Components/MyFormPasswd';

const CrearCuentaAdmin = () => {

    //const { signup } = useAuth();

    // Estados para los campos de entrada
    const [nick, setNick] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nombreCorreo, setNombreCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    // Manejador para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            nick: nick,
            name: nombre,
            surname: apellido,
            email: nombreCorreo,
            password: contrasena
        };

        try {
            const response = await axios.post('/user/add', formData)
            if (response.status == 200) {
                history.push('/HomeAdmin');
            }
            else {
                console.log("Fallo al añadir el usuario: ", response.data);
                throw new Error('Error al añadir usuario');
            }
            console.log('Respuesta:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
        // Limpiar los campos después de enviar el formulario
        setNick('');
        setNombre('');
        setApellido('');
        setNombreCorreo('');
        setContrasena('');
    };

    return (
        <div className="CrearCuentaAdmin">
            <div className="rectangle">
                <img src="/Frontend_Web/Imagenes/logoprincipal.png" alt="Logo" className="corner-image" />
            </div>
            <form className="questionnaire-container" onSubmit={handleSubmit}>
                <h2 className="questionnaire-title">Creación de nuevo usuario</h2>
                <MyForm
                    typeForm="nickname"
                    placeholderForm="Enter your nickname"
                    labelText="Nickname"
                    className="form-element"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                />
                <MyForm
                    typeForm="name"
                    placeholderForm="Enter your name"
                    labelText="Name"
                    className="form-element"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <MyForm
                    typeForm="surname"
                    placeholderForm="Enter your surname"
                    labelText="Surname"
                    className="form-element"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                />
                <MyForm
                    typeForm="email"
                    placeholderForm="Enter your email"
                    labelText="Email"
                    className="form-element"
                    value={nombreCorreo}
                    onChange={(e) => setNombreCorreo(e.target.value)}
                />
                <MyFormPasswd
                    placeholderForm="Introduce su contraseña"
                    labelText="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                />
                {/* <button type="submit" className="submit-button">Confirmar</button> */}
                <Link to={constants.root} onClick={handleSubmit} className="submit-button">Confirmar</Link>
                
            </form>
        </div>
    );
}

export default CrearCuentaAdmin;