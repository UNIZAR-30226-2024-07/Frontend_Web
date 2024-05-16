import { useState, useEffect, useRef  } from 'react';
import { getUserStats } from "../Context/stats";
import { returnUsers } from "../Context/UserContext";
import { returnFriendsAvatar } from '../Context/FriendContext';
import { GetMyAvatar } from "../Context/AvatarContext";
import { returnMyName } from "../Context/AuthContext";
import { MyNav } from "../Components/MyNav";
import { Button } from "@nextui-org/react";
import { MyRanking } from "../Components/MyRanking";
import MyLoading from '../Components/MyLoading';
import { Link } from "react-router-dom";
import { TfiMenuAlt } from "react-icons/tfi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GoTrophy } from "react-icons/go";
import constants from '../constants';

import "./PageTrophyRanking.css";

export function PageMoneyRanking() {
    const [userRanking, setUserRanking] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarData, setAvatarData] = useState(null);
    const [userName, setUserName] = useState(null);

    const isFirstEffectComplete = useRef(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Obtener avatar
                const avatar = await GetMyAvatar();
                console.log("EL NOMBRE ESSSSSS", avatar.data);
                setAvatarData(avatar.data);

                // Obtener nombre de usuario
                const nameResponse = await returnMyName();
                if (nameResponse.status === "success") {
                    console.log("Mi nombre essssssssssssssssSSSSS: ", nameResponse.data.name);
                    setUserName(nameResponse.data);
                } else {
                    throw new Error(nameResponse.message || 'No se pudo obtener el nombre del usuario');
                }

                // Indicar que el primer useEffect ha terminado
                isFirstEffectComplete.current = true;
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                // Verificar si el primer useEffect ha terminado de ejecutarse
                if (!isFirstEffectComplete.current) {
                    return; // Salir si el primer useEffect no ha terminado
                }
                console.log("MI NOOMBREE EESSS",userName );
                console.log('Cargando lista de usuarios...');
                const usersResponse = await returnUsers();
                console.log('Respuesta de returnUsers:', usersResponse);
                if (usersResponse.status === 'success') {
                    console.log('Lista de usuarios cargada exitosamente:', usersResponse.data);

                    // Filtrar usuarios con rol "admin"
                    const filteredUsers = usersResponse.data.filter(user => user.rol !== 'admin');

                    console.log("Comenzando la carga de avatares...");
                    const avatarsResponse = await returnFriendsAvatar(filteredUsers);
                    console.log('Respuesta de returnUsersAvatar:', avatarsResponse);
                    if (avatarsResponse.status === 'success') {
                        console.log('Avatares cargados exitosamente:', avatarsResponse.data);

                        const usersWithAvatars = avatarsResponse.data.map((user, index) => {
                            return { ...filteredUsers[index], avatar: user.avatar};
                        });

                        usersWithAvatars.push({ ...userName, avatar: avatarData });

                        console.log('Usuarios con avatares:', usersWithAvatars);

                        console.log("LA VARIBLE CONTIENE",  usersWithAvatars);

                        const updatedRanking = await Promise.all(usersWithAvatars.map(async (user) => {
                            const statsResponse = await getUserStats(user._id, "Monedas ganadas en partida");
                            console.log(`Respuesta de getUserStats para ${user.name}:`, statsResponse.data.stat.value);
                            if (statsResponse.status === 'success') {
                                console.log(`Estadísticas obtenidas exitosamente para ${user.name}:`, statsResponse.data);
                                return { ...user, statValue: statsResponse.data.stat.value };
                            } else {
                                const errorMessage = `Error al obtener estadísticas para ${user.name}: ${statsResponse.message}`;
                                console.error(errorMessage);
                                setError(errorMessage);
                                return null;
                            }
                        }));

                        // Ordenar la lista de usuarios según los valores de las estadísticas
                        updatedRanking.sort((a, b) => b.statValue - a.statValue);

                        setUserRanking(updatedRanking.filter(user => user !== null));
                        setLoading(false);
                    } else {
                        setError(avatarsResponse.message);
                        setLoading(false);
                    }
                } else {
                    setError(usersResponse.message);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error inesperado:', error.message);
                setError(error.message);
                setLoading(false);
            }
        }

        fetchData();
    }, [ isFirstEffectComplete.current]);


    console.log("Usuarios con avatares y nombres:", userRanking);

    return (
        <div className='ranking-trophy-page'>
            {loading && <MyLoading />}
            {error && <p>Error: {error}</p>}
            {!loading && (
                <>
                    <MyNav isLoggedIn={false} isDashboard={false} />
                    <div className="friend-div">
                        <div className="info-square">
                            <TfiMenuAlt className="emoji" />
                            <span className="content">Ranking</span>
                        </div>
                        <div className="buttons-container">
                            <Link to={constants.root + 'PageTrophyRanking'}>
                                <Button className="button-friend">
                                    <GoTrophy className="emote-friend" />
                                </Button>
                            </Link>
                            <Link to={constants.root + 'PageMoneyRanking'}>
                                <Button className="button-friend">
                                    <MdOutlineAttachMoney className="emote-friend" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <ul className="friend-list">
                            {userRanking.map((userData, index) => (
                                <li key={index} className="friend-list-item">
                                    <MyRanking
                                        user={userData}
                                        numberRanking={index + 1}
                                        isTrophyList={false} 
                                        isCoinsList={true} 
                                        value={userData.statValue} 
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
