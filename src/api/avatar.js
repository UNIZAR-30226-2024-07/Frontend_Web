import axios from "./axios";


//Obtener el avatar de un usuario dado un ID
export const returnAvatarByID = async (avatarID) => {
    try {
      const response = await axios.get(`/avatar/currentAvatarById/${avatarID}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener el avatar:`);
    }
};

export const retrunMyAvatar = async () =>  await axios.get('/avatar/currentAvatar');