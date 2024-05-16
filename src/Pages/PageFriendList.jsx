import { useState, useEffect } from 'react';
import { returnFriendsAvatar, returnFriends } from '../Context/FriendContext';
import { MyFriend } from "../Components/MyFriend";
import { MyNav } from "../Components/MyNav";
import { MdNotificationAdd } from "react-icons/md";
import { Button } from "@nextui-org/react";
import { FaUserFriends } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import "./PageFriendList.css"
import constants from '../constants';
import { Link, useNavigate } from "react-router-dom";

export function PageFriendList() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [avatarsFetched, setAvatarsFetched] = useState(false);

    useEffect(() => {
        if (!avatarsFetched) {
            returnFriends()
                .then(response => {
                    if (response.status === "success") {
                        console.log("Usuarios cargados exitosamente:", response.data);
                        if (response.data.length > 0) {
                            console.log("Comenzando la carga de avatares...");
                            returnFriendsAvatar(response.data)
                                .then(avatarResponse => {
                                    console.log("Respuesta de returnFriendsAvatar:", avatarResponse);
                                    if (avatarResponse.status === "success") {
                                        console.log("Avatares cargados exitosamente:", avatarResponse.data);
                                        setUsers(avatarResponse.data);
                                        setAvatarsFetched(true);
                                    } else {
                                        setError(avatarResponse.message);
                                    }
                                })
                                .catch(err => setError(err.message));
                        } else {
                            console.log("La lista de usuarios está vacía.");
                            setAvatarsFetched(true); 
                        }
                    } else {
                        setError(response.message);
                    }
                })
                .catch(err => setError(err.message));
        } else {
            console.log("Los avatares ya se han cargado.");
        }
    }, [avatarsFetched]);

    const handleReloadPage = () => {
        window.location.reload(); 
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="page-friend">
            <MyNav isLoggedIn={false} isDashboard={false} />
            <div className="friend-div">
                <div className="info-square">
                    <FaUserFriends className="emoji" />
                    <span className="content">Lista de amigos</span>
                </div>
                <div className="buttons-container">
                    <Link to={constants.root + "PageFriendRequest"}>
                        <Button className="button-friend">
                            <MdNotificationAdd className="emote-friend" />
                        </Button>
                    </Link>
                    <Link to={constants.root + 'PageFriendFind'}>
                        <Button className="button-friend">
                            <MdPersonAddAlt1 className="emote-friend" />
                        </Button>
                    </Link>
                </div>
            </div>
            {users.length > 0 ? (
                <div className="friend">
                    <ul className="friend-list">
                        {users.map(user => (
                            <li className="friend-list-item" key={user._id} onClick={() => navigate(constants.root + "PageStatsFriend/" + user._id)}>
                                <MyFriend user={user} isFriendList={true} isRequestList={false} isFriendFind={false}  setReloadParent={handleReloadPage}  />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="no-friends">
                    No se encontraron amigos
                </div>
            )}
        </div>
    );
}
