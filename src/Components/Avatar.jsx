import { useState, useEffect } from 'react';
import constants from '../constants'
import axios from '../api/axios'

const Avatar = ({ avatarId }) => {
  // Información avatar
  const [avatarData, setAvatarData] = useState(null);

  useEffect(() => {

    // Obtener un avatar dado su id
    // Es más eficiente pasar la información del avatar mediante 'props' al componente
    // Ya que el getAllAvatars devuelve toda la información de los avatares
    const fetchAvatar = async () => {
      try {
        const response = await axios.get(`/avatar/avatarById/${avatarId}`)
        if (response.status !== 200) {
            console.log("Fallo al obtener un avatar: ", response.data);
            throw new Error('Error al obtener un avatar');
        }
        console.log('Avatar:', response.data);
        setAvatarData(response.data.avatar);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchAvatar();
  }, [avatarId]);

    const handleDelete = async () => {
        try {
          const response = await axios.delete(`/avatar/eliminate/${avatarId}`)
          if (response.status !== 200) {
              console.log("Fallo al eliminar un avatar: ", response.data);
              throw new Error('Error al eliminar un avatar');
          }
          console.log('Respuesta:', response.data);
          setAvatarData(null);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el avatar.');
        }
    };

    if (!avatarData) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
        <h2>Avatar: {avatarData.image}</h2>
        <p>Precio: {avatarData.price}</p>
        <p>Nombre de archivo: {avatarData.imageFileName}</p>
        
        {/* Obtener la imagen del avatar */}
        <img src={constants.dirApi + "/" + constants.uploadsFolder + "/" + avatarData.imageFileName}/>
        <button onClick={handleDelete}>Eliminar Avatar</button>
        {/* Aquí puedes agregar más información del avatar si lo deseas */}
        </div>
    );
};

export default Avatar;
