import { Button } from "@nextui-org/react";
import { useState } from 'react';
import { eliminateFriends, addFriends, acceptFriends, rejectFriends } from '../Context/FriendContext'; // Importa las funciones necesarias
import "./MyFriend.css";

export function MyFriend({ user, isFriendList, isRequestList, isFriendFind, type }) {
  const [requestSent, setRequestSent] = useState(false);

  const handleSendFriendRequest = async () => {
    try {
      const response = await addFriends(user._id);
      if (response.status === "success") {
        console.log("Invitación de amistad enviada con éxito");
        setRequestSent(true);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud de amistad:", error);
    }
  };

  const handleEliminateFriend = async () => {
    try {
      const response = await eliminateFriends(user._id);
      if (response.status === "success") {
        console.log("Amigo eliminado con éxito");
      } else {
        console.error("Error al eliminar amigo:", response.message);
      }
    } catch (error) {
      console.error("Error al eliminar amigo:", error.message);
    }
  };

  const handleAcceptFriend = async () => {
    try {
      const response = await acceptFriends(user._id);
      if (response.status === "success") {
        console.log("Amigo aceptado con éxito");
      } else {
        console.error("Error al aceptar amigo:", response.message);
      }
    } catch (error) {
      console.error("Error al aceptar amigo:", error.message);
    }
  };

  const handleRejectFriend = async () => {
    try {
      const response = await rejectFriends(user._id);
      if (response.status === "success") {
        console.log("Amigo rechazado con éxito");
      } else {
        console.error("Error al rechazar amigo:", response.message);
      }
    } catch (error) {
      console.error("Error al rechazar amigo:", error.message);
    }
  };

  return (
    <div className="circular-photo">
      <img src={user.avatar} alt="User" className="photo" />
      <span className="name">{user.name}</span>
      {isFriendList && (
        <div className="button-container">
          <Button className="nextui-button" onClick={handleEliminateFriend}>Eliminar</Button>
        </div>
      )}
      {isRequestList && (
        <div className="button-container">
          <Button className="button-accept" onClick={handleAcceptFriend}>Aceptar</Button>
          <Button className="button-reject" onClick={handleRejectFriend}>Rechazar</Button>
        </div>
      )}
      {isFriendFind && (
        <div className="button-container">
          {type === 1 && (
            <Button className="button-friend" onClick={handleSendFriendRequest} disabled={requestSent}>
              Enviar solicitud
            </Button>
          )}
          {type === 2 && (
            <Button className="button-friend-now" onClick={handleSendFriendRequest} disabled={requestSent}>
              Ya es tu amigo
            </Button>
          )}
          {type !== 1 && type !== 2 && (
            <Button className="button-friend-send" onClick={handleSendFriendRequest} disabled={requestSent}>
              Solicitud enviada
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
