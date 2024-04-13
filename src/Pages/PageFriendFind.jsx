import { useState, useEffect, useCallback } from 'react';
import { returnUsers } from '../Context/UserContext';
import { returnFriendsAvatar } from '../Context/FriendContext';
import { MyFriend } from "../Components/MyFriend";
import { MyNav } from "../Components/MyNav";
import { HiMagnifyingGlass } from "react-icons/hi2";
import "./PageFriendList.css"
import "./PageFriendFind.css"

export function PageFriendFind() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState(null);
    const [avatarsFetched, setAvatarsFetched] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [triggerUpdate, setTriggerUpdate] = useState(false); // Nuevo estado

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
                                        setFilteredUsers(avatarResponse.data); // Inicializar la lista filtrada con todos los usuarios
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
        // Filtrar usuarios basados en el término de búsqueda
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users, triggerUpdate]); // Añadir triggerUpdate como dependencia

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFriendUpdate = useCallback(() => {
        setTriggerUpdate(prev => !prev); // Invierte el estado de triggerUpdate
    }, []);

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
                <HiMagnifyingGlass className="glass"></HiMagnifyingGlass>
            </div>
            {searchTerm !== '' && (
                <div className="friend">
                    <ul className="friend-list">
                        {filteredUsers.map(usuario => (
                            <li className="friend-list-item" key={usuario._id}>
                                <MyFriend user={usuario} isFriendList={false} isRequestList={false} isFriendFind={true} updateParent={handleFriendUpdate} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
