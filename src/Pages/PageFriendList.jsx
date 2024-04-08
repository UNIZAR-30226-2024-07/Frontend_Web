import { MyFriend } from "../Components/MyFriend";
import { MyNav } from "../Components/MyNav";
import { MdNotificationAdd } from "react-icons/md";
import { Button } from "@nextui-org/react";
import { FaUserFriends } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import "./PageFriendList.css"
import constants from '../constants';
import { Link } from "react-router-dom";
export function PageFriendList() {
    return (
      <div className="page-friend">
        <MyNav isLoggedIn={false} isDashboard={false} />
        <div className="friend-div">
          <div className="info-square">
            <FaUserFriends className="emoji" />
            <span className="content">Lista de amigos</span>
          </div>
          <div className="buttons-container">
          <Link to={constants.root + "PageLogin"}>
            <Button className="button-friend">
                <MdNotificationAdd className="emote-friend"/>
            </Button>
            </Link>       
          <Link to={constants.root + "PageLogin"}>
            <Button className="button-friend">
              <MdPersonAddAlt1 className="emote-friend"/>
            </Button>
          </Link>  
          </div>
        </div>
        <div className="friend">
          <ul className="friend-list">
            <li className="friend-list-item">
              <MyFriend imageUrl='public/Imagenes/logo.png' name="Amigo 1" isFriendList={true} isRequestList={false} />
            </li>
            <li className="friend-list-item">
              <MyFriend imageUrl='public/Imagenes/logo.png' name="Amigo 2" isFriendList={true} isRequestList={false} />
            </li>
            <li className="friend-list-item">
              <MyFriend imageUrl='public/Imagenes/logo.png' name="Amigo 3" isFriendList={true} isRequestList={false} />
            </li>
          </ul>
        </div>
      </div>
    );
  }
  