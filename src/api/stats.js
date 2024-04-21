import axios from "./axios";

// Devuelve una estadística dado un ‘name’ de estadística y el usuario a la que pertenece ‘user’.
export const returnStats = async (nameUser, nameStat) => {
  try {
    const response = await axios.get(`/stat/statByNameAndUser/${nameUser}/${nameStat}`);
    return response;
  } catch (error) {
    throw new Error(`Error al revisar las stats en la llamada: ${error.message}`);
  }
};
