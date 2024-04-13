import axios from "./axios";

// Añadir usuario (registrarse)
export const registerRequest = async (user) => axios.post('/user/add', user);

// Hacer login (iniciar sesión)
export const loginRequest = async (user) => await axios.post('/user/login', user);

// Verificar cookie usuario corresponde usuario en el sistema
export const verifyTokenRequest = async () =>  await axios.get('/user/verify');

//Obtener todos los usuarios menos el que hace la petición
export const returnAllUsers = async () => await axios.get ('/user/getAllUsers');



