import { useEffect, useState } from 'react';
import "./AvatarId.css"
import axios from '../api/axios';
import constants from '../constants';

export function AvatarId({user}) {
  const [avatarData, setAvatarData] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener avatar
        // const avatar = await GetMyAvatar();
        // setAvatarData(avatar.data);
        const response = await axios.get('/avatar/currentAvatarById/' + user);
        if (response.status !== 200){
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }
        setAvatarData(response.data.avatar.imageFileName);

        const response2 = await axios.get('/user/userById/' + user);
        if (response.status !== 200){
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }
        console.log(response2);
        setUserName(response2.data.user.nick);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    }

    fetchData();

  }, [user]);

  return (
    <div className="my-avatar-containera">
      <img 
          src={constants.dirApi + "/" + constants.uploadsFolder + "/" + avatarData}
          alt={0}
          className="avatar-imagea"
      />
      <p className="avatar-descriptiona">{userName}</p>
    </div>
  );
}
