import { useState, useEffect } from 'react';
import { returnUsers } from '../Context/UserContext';
import { returnFriendsAvatar } from '../Context/FriendContext';
import { MyUser } from "../Components/MyUser";
import { MyNavAdmin } from "../Components/MyNavAdmin";
import { HiMagnifyingGlass } from "react-icons/hi2";
import "./ModificarEliminarCuenta.css";

function ModificarEliminarCuenta() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState(null);
    const [avatarsFetched, setAvatarsFetched] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
        // Filtrar usuarios basados en el término de búsqueda
        const filtered = searchTerm === '' ? [] : users.filter(user =>
            user.name.includes(searchTerm) // No convertir a minúsculas el nombre del usuario
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <><MyNavAdmin></MyNavAdmin>
        <div className="modificar-eliminar-cuenta">
            <div className="find-user">
                <input
                    className="find"
                    type="text"
                    placeholder="Buscar usuario"
                    value={searchTerm}
                    onChange={handleSearchChange} />
                <HiMagnifyingGlass className="glass" />
            </div>
            {searchTerm !== '' && (
                <div className="user">
                    <ul className="user-list">
                        {filteredUsers.map(usuario => (

                            <li className="user-list-item" key={usuario._id}>
                                {
                                    <MyUser user={usuario}></MyUser>
                                    //<MyFriend user={usuario} isFriendList={false} isRequestList={false} isFriendFind={true} setReloadParent={handleFriendUpdate} type={usuario.type} />
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div></>
    );
}

export default ModificarEliminarCuenta;
