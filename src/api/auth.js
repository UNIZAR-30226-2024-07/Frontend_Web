import axios from "./axios";

// Añadir usuario (registrarse)
export const registerRequest = async (user) =>
  axios.post('/user/add', user);

// Hacer login (iniciar sesión)
export const loginRequest = async (user) => axios.post('/user/login', user);

// Verificar cookie usuario corresponde usuario en el sistema
export const verifyTokenRequest = async () => axios.get('/user/verify');

//Obtener la lista de amigos del usuario
export const listFriend = async () => axios.get('/friend/getAllFriends');

//Obtener el avatar de un usuario dado un ID
export const returnAvatarID = async () => axios.get('/avatar/currentAvatarById');

//Obtener todos los usuarios menos el que hace la petición
export const returnAllUsers = async () => axios.get ('/user/getAllUsers');





