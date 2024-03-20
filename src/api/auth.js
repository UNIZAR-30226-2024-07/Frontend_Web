import axios from "./axios";

// Añadir usuario (registrarse)
export const registerRequest = async (user) =>
  axios.post('/user/add', user);

// Hacer login (iniciar sesión)
export const loginRequest = async (user) => axios.post('/user/login', user);

// Verificar cookie usuario corresponde usuario en el sistema
export const verifyTokenRequest = async () => axios.get('/user/verify');
