import { Button } from "@nextui-org/react";
import "./MyFriend.css"

export function MyFriend({ imageUrl, name, isFriendList, isRequestList, isFriendFind}) {
  return (
    <div className="circular-photo">
      <img src={imageUrl} alt="User" className="photo" />
      <span className="name">{name}</span>
      {isFriendList && (
        <div className="button-container">
        <Button className="nextui-button">Eliminar</Button>
      </div>
      )}
      {isRequestList && (
         <div className="button-container">
         <Button className="button-accept">Aceptar</Button>
         <Button className="button-reject">Rechazar</Button>
       </div>
      )}
      {isFriendFind && (
        <div className="button-container">
          <Button className="button-friend">Enviar solicitud</Button>
        </div>
      )}
    </div>
  );
}
