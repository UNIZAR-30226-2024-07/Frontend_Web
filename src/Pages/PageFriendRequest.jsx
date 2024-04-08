import { MyFriend } from "../Components/MyFriend";
import { MyNav } from "../Components/MyNav";
import { FaUserFriends } from "react-icons/fa";
import "./PageFriendList.css"
import "./PageFriendRequest.css"

export function PageFriendRequest () {
    return (
    <div className="page-friend">
        <MyNav isLoggedIn={false} isDashboard={false} />
        <div className="request-page">
            <FaUserFriends className="emoji" />
            <span className="content">Solicitudes Recibidas</span>
        </div>
        <div className="friend">
            <ul className="friend-list">
            <li className="friend-list-item">
                <MyFriend imageUrl='public/Imagenes/logo.png' name="Amigo 1" isFriendList={false} isRequestList={true} />
            </li>
            <li className="friend-list-item">
                <MyFriend imageUrl='public/Imagenes/logo.png' name="Amigo 2" isFriendList={false} isRequestList={true} />
            </li>
            <li className="friend-list-item">
                <MyFriend imageUrl='public/Imagenes/logo.png' name="Amigo 3" isFriendList={false} isRequestList={true} />
            </li>
     
            </ul>
        </div>
    </div>
    );
}