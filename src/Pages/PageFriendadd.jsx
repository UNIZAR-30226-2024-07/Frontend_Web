import { useState, useEffect } from 'react';
import { returnListFriend, returnAvatarByID } from '../api/auth';
import constants from '../constants'; 

export function AllUsersComponent() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [avatarsFetched, setAvatarsFetched] = useState(false); // Bandera para controlar si los avatares ya se han obtenido

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await returnListFriend();
        if (response.data.user !== undefined) {
          setUsers(response.data.user);
        } else {
          throw new Error('No users found');
        }
      } catch (error) {
        setError(error.message);
      } 
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAvatars = async () => {
      if (users.length === 0 || avatarsFetched) return; 

      try {
        const updatedUsers = await Promise.all(users.map(async user => {
          if (!user._id) {
            throw new Error('User ID is not defined');
          }
          
          try {
            const avatarResponse = await returnAvatarByID(user._id);

            // Construir la URL completa del avatar utilizando las constantes
            const avatarUrl = `${constants.dirApi}/${constants.uploadsFolder}/${avatarResponse.avatar.imageFileName}`;

            // Devolver una copia del usuario actualizado con la URL del avatar
            return { ...user, avatar: avatarUrl };
          } catch (avatarError) {
            // Si hay un error al obtener el avatar, simplemente devolvemos el usuario sin avatar
            return user;
          }
        }));

        // Actualizar el estado con los usuarios actualizados
        setUsers(updatedUsers);
        setAvatarsFetched(true); // Establecer la bandera en true para indicar que los avatares se han obtenido
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAvatars();
  }, [users, avatarsFetched]); // Dependencias: users y avatarsFetched


  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <p>Nickname: {user._id}</p>
            <p>Email: {user.email}</p>
            {user.avatar && <img src={user.avatar} alt="User Avatar" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

