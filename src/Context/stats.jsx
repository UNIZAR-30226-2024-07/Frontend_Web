import { returnStats } from "../api/stats";

export async function getUserStats(nameUser, nameStat) {
  try {
    const response = await returnStats(nameUser, nameStat);
    if (response.status === 200) {
      console.log("Las estadísticas del usuario son:", response.data);
      return {
        status: "success",
        data: response.data
      };
    } else {
      throw new Error(response.data.message || "Error al enviar solicitud");
    }
  } catch (error) {
    return {
      status: "error",
      message: error.message
    };
  }
}
