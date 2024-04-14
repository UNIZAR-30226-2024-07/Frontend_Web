import axios from "./axios";

//Devuelve la lista de amigos del usuario
export const returnListFriend =  async () =>  axios.get ('/friend/getAllFriends');

// Manda solicitud de amistad a un usuario
export const addFriend = async (ID) => {
  try {
    const response =  axios.post(`/friend/add/${ID}`);
    return response;
  } catch (error) {
    throw new Error(`Error al enviar la solicitud de amistad: ${error.message}`);
  }
};

//Devuelve los usuarios en pendiente de solicitud
export const PendingFriend = async () =>  axios.get('/friend/getAllPendingFriends');


//Elimina a un amigo de la lista de amigos
export const eliminateFriend = async (ID) => {
  try {
    console.log("El amigo a eliminar es: ", ID);
    console.log("la ruta para elimianar es: ", `/friend/eliminateFriend/${ID}`);
    const response =  await axios.delete(`/friend/eliminateFriend/${ID}`);
    console.log("hola");
    return response;
  } catch (error) {
    throw new Error(`Error al eliminar al amigo: ${error.message}`);
  }
};


//Rechaza la petición de amistad de un usuario.
export const rejectFriend = async (ID) => {
  try {
    const response = await axios.delete(`/friend/reject/${ID}`);
    return response;
  } catch (error) {
    throw new Error(`Error al rechazar petición de amistad: ${error.message}`);
  }
};

//Acepta la petición de amistad de un amigo 
export const acceptFriend = async (ID) => {
  try {
    console.log("El id es:",ID);
    console.log("la ruta es: ", `/friend/accept/${ID}`);
    const response =  await axios.put(`/friend/accept/${ID}`);
    return response;
  } catch (error) {
    throw new Error(`Error al aceptar petición de amistad: ${error.message}`);
  }
};


//Devuelve los usuarios que han enviado petición de amistad al usuario
export const returnAllReceivedFriends = async () =>  axios.get ('/friend/getAllReceivedFriends');