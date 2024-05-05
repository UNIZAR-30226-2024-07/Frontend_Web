import { useEffect, useState } from 'react';
import { GetMyAvatar } from "../Context/AvatarContext";
import { returnMyName } from "../Context/AuthContext";
import "./MyAvatar.css"

export function MyAvatar() {
  const [avatarData, setAvatarData] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener avatar
        const avatar = await GetMyAvatar();
        setAvatarData(avatar.data);

        // Obtener nombre de usuario
        const nameResponse = await returnMyName();
        if (nameResponse.status === "success") {
          console.log("Mi nombre es: ", nameResponse.data.name);
          setUserName(nameResponse.data.nick);
        } else {
          throw new Error(nameResponse.message || 'No se pudo obtener el nombre del usuario');
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    }

    fetchData();

  }, []);

  return (
    <div className="my-avatar-container">
      <img src={avatarData} className="avatar-image" alt="Avatar" />
      <p className="avatar-description">{userName}</p>
    </div>
  );
}
