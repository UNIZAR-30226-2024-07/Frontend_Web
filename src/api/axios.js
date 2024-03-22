import axios from "axios";
import constants from "../constants";

const instance = axios.create({
  baseURL: constants.dirApi + "/api",
  // withCredentials: true,
});

// Agregar un interceptor de solicitudes
instance.interceptors.request.use(
  function (config) {
    // Obtener el token de localStorage
    const token = localStorage.getItem("token");
    
    // Agregar la cabecera de Authorization a todas las solicitudes
    if (token) {
      config.headers["Authorization"] = token;
    }

    // Verificar si es una solicitud para subir foto
    if (config.url.endsWith('/avatar/add') || 
        config.url.endsWith('/card/add') || 
        config.url.endsWith('/rug/add')) {
      // Si es una solicitud para subir foto, ajustar la cabecera Content-Type
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      // Para otras solicitudes, mantener la cabecera Content-Type como application/json
      config.headers["Content-Type"] = "application/json";
    }
    
    return config;
  },
  function (error) {
    // Manejar errores de solicitud
    return Promise.reject(error);
  }
)

export default instance;
