import { useState, useEffect } from 'react'; 
import { MyFriend } from "../Components/MyFriend";
import { MyNav } from "../Components/MyNav";
import { FaUserFriends } from "react-icons/fa";
import { returnFriendsAvatar, returnAllReceived } from '../Context/FriendContext'; 
import "./PageFriendList.css";
import "./PageFriendRequest.css";

export function PageFriendRequest() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []); 

  const fetchUsers = () => {
    returnAllReceived()
      .then(response => {
        console.log(response.status);
        if (response.status === "success") {
          if (response.data.length > 0) {
            console.log("Comenzando la carga de avatares...");
            returnFriendsAvatar(response.data)
              .then(avatarResponse => {
                console.log("Respuesta de returnFriendsAvatar:", avatarResponse);
                if (avatarResponse.status === "success") {
                  console.log("Avatares cargados exitosamente:", avatarResponse.data);
                  setUsers(avatarResponse.data);
                } else {
                  setError(avatarResponse.message);
                }
              })
              .catch(err => setError(err.message));
          } else {
            console.log("La lista de usuarios está vacía.");
          }
        } else {
          setError(response.message);
        }
      })
      .catch(err => setError(err.message));
  };

  const handleReloadPage = () => {
    window.location.reload(); 
  };

  if (error) {
    return <p>Error: {error}</p>;
  }


  return (
    <div className="page-friend">
      <MyNav isLoggedIn={false} isDashboard={false} />
      <div className="request-page">
        <FaUserFriends className="emoji" />
        <span className="content">Solicitudes Recibidas</span>
      </div>
      <div className="friend">
        <ul className="friend-list">
          {users.length === 0 ? (
            <div className="no-requests">
              No se encontraron solicitudes de amistad
            </div>
          ) : (
            users.map((user, index) => (
              <li className="friend-list-item" key={index}>
                <MyFriend 
                  user={user} 
                  isFriendList={false} 
                  isRequestList={true} 
                  setReloadParent={handleReloadPage}
                /> 
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );  
}
