import { useState, useEffect, useCallback } from 'react';
import { returnUsers } from '../Context/UserContext';
import { returnFriendsAvatar, returnFriends, returnPendingFriends } from '../Context/FriendContext';
import { MyFriend } from "../Components/MyFriend";
import { MyNav } from "../Components/MyNav";
import { HiMagnifyingGlass } from "react-icons/hi2";
import "./PageFriendList.css";
import "./PageFriendFind.css";

export function PageFriendFind() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState(null);
    const [avatarsFetched, setAvatarsFetched] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [friendsLoaded, setFriendsLoaded] = useState(false);

    useEffect(() => {
        if (!avatarsFetched) {
            returnUsers()
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
                                        setFilteredUsers(avatarResponse.data);
                                        setAvatarsFetched(true);
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
        } else {
            console.log("Los avatares ya se han cargado.");
        }
    }, [avatarsFetched]);

    useEffect(() => {
        // Evitar llamadas duplicadas
        if (avatarsFetched && !friendsLoaded) {
            loadFriendData();
            setFriendsLoaded(true);
        }
    }, [avatarsFetched, friendsLoaded]);

    useEffect(() => {
        // Filtrar usuarios basados en el término de búsqueda
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]); // Solo se ejecutará cuando searchTerm o users cambien

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFriendUpdate = useCallback(() => {
        setAvatarsFetched(false);
        setFriendsLoaded(false);
    }, []);

    async function loadFriendData() {
        try {
            const friendsResponse = await returnFriends();
            const pendingFriendsResponse = await returnPendingFriends();

            if (friendsResponse.status === "success") {
                const friendsIds = friendsResponse.data.map(friend => friend._id);
                const pendingFriendsIds = pendingFriendsResponse.data ? pendingFriendsResponse.data.map(pending => pending._id) : [];

                console.log('Friends IDs:', friendsIds);
                console.log('Pending Friends IDs:', pendingFriendsIds);

                // Actualizar tipo para cada usuario
                const updatedUsers = users.map(user => {
                    console.log('User ID:', user._id);
                    if (friendsIds.includes(user._id)) {
                        return { ...user, type: 2 }; // Usuario es amigo
                    } else if (pendingFriendsIds.includes(user._id)) {
                        return { ...user, type: 1 }; // Usuario tiene solicitud pendiente
                    } else {
                        return { ...user, type: 0 }; // Usuario no es amigo ni tiene solicitud
                    }
                });

                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
            } else {
                setError(friendsResponse.message);
            }
        } catch (error) {
            setError(error.message);
        }
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="page-friend">
            <MyNav isLoggedIn={false} isDashboard={false} />
            <div className="find-friend">
                <input
                    className="find"
                    type="text"
                    placeholder="Buscar amigos"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <HiMagnifyingGlass className="glass" />
            </div>
            {searchTerm !== '' && (
                <div className="friend">
                    <ul className="friend-list">
                        {filteredUsers.map(usuario => (
                            <li className="friend-list-item" key={usuario._id}>
                                <MyFriend user={usuario} isFriendList={false} isRequestList={false} isFriendFind={true} setReloadParent={handleFriendUpdate} type={usuario.type} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
