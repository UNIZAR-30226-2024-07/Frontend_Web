import { useState, useEffect } from 'react';
import { getUserStats } from "../Context/stats";
import { returnUsers } from "../Context/UserContext";
import { MyNav } from "../Components/MyNav";
import { TfiMenuAlt } from "react-icons/tfi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GoTrophy } from "react-icons/go";
import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import constants from '../constants';
import { MyRanking } from "../Components/MyRanking";
import { returnFriendsAvatar } from '../Context/FriendContext';
import MyLoading from '../Components/MyLoading';

import "./PageTrophyRanking.css";

export function PageMoneyRanking() {
    const [userRanking, setUserRanking] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsFetched, setStatsFetched] = useState(false);
    const [avatarsFetched, setAvatarsFetched] = useState(false);

    useEffect(() => {
        console.log('Cargando lista de usuarios...');
        async function fetchData() {
            try {
                const usersResponse = await returnUsers();
                console.log('Respuesta de returnUsers:', usersResponse);
                if (usersResponse.status === 'success') {
                    console.log('Lista de usuarios cargada exitosamente:', usersResponse.data);

                    if (!avatarsFetched) {
                        console.log("Comenzando la carga de avatares...");
                        const avatarsResponse = await returnFriendsAvatar(usersResponse.data);
                        console.log('Respuesta de returnUsersAvatar:', avatarsResponse);
                        if (avatarsResponse.status === 'success') {
                            console.log('Avatares cargados exitosamente:', avatarsResponse.data);
                            const usersWithAvatars = avatarsResponse.data.map((user, index) => {
                                return { ...usersResponse.data[index], avatar: user.avatar };
                            });
                            setUserRanking(usersWithAvatars);
                            setAvatarsFetched(true);
                        } else {
                            setError(avatarsResponse.message);
                        }
                    } else {
                        console.log("Los avatares ya se han cargado.");
                    }
                } else {
                    setError(usersResponse.message);
                }
            } catch (error) {
                console.error('Error inesperado:', error.message);
                setError(error.message);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (userRanking.length > 0 && !statsFetched) {
            console.log('Obteniendo estadísticas para cada usuario...');
            const updateUserRanking = async () => {
                try {
                    const updatedRanking = [];
                    const statsPromises = userRanking.map(async (user) => {
                        const statsResponse = await getUserStats(user._id, "Monedas ganadas en partida");
                        console.log(`Respuesta de getUserStats para ${user.name}:`, statsResponse.data.stat.value);
                        if (statsResponse.status === 'success') {
                            console.log(`Estadísticas obtenidas exitosamente para ${user.name}:`, statsResponse.data);
                            updatedRanking.push({ ...user, statValue: statsResponse.data.stat.value });
                        } else {
                            const errorMessage = `Error al obtener estadísticas para ${user.name}: ${statsResponse.message}`;
                            console.error(errorMessage);
                            setError(errorMessage);
                        }
                    });

                    await Promise.all(statsPromises);
                    setUserRanking(updatedRanking);
                    console.log('Ranking actualizado con estadísticas:', updatedRanking);
                    setStatsFetched(true);
                } catch (error) {
                    console.error('Error inesperado:', error.message);
                    setError(error.message);
                }
            };
            updateUserRanking();
        }
    }, [userRanking, statsFetched]);

    useEffect(() => {
        if (statsFetched && avatarsFetched) {
            setLoading(false);
        }
    }, [statsFetched, avatarsFetched]);

    if (loading) {
        return <div> <MyLoading/> </div>;
    }

    return (
        <div className='ranking-trophy-page'>
            {error && <p>Error: {error}</p>}
            <MyNav isLoggedIn={false} isDashboard={false} />
            <div className="friend-div">
                <div className="info-square">
                    <TfiMenuAlt className="emoji" />
                    <span className="content">Ranking</span>
                </div>
                <div className="buttons-container">
                    <Link to={constants.root + 'PageMoneyRanking'}>
                        <Button className="button-friend">
                            <MdOutlineAttachMoney className="emote-friend" />
                        </Button>
                    </Link>
                    <Link to={constants.root + 'PageTrophyRanking'}>
                        <Button className="button-friend">
                            <GoTrophy className="emote-friend" />
                        </Button>
                    </Link>
                </div>
            </div>
            <div>
                <ul className="friend-list">
                {userRanking.map((userData, index) => (
    <li key={index} className="friend-list-item">
        {userData.rol === "user" && (
            <MyRanking
                user={userData}
                numberRanking={index + 1}
                isTrophyList={false} 
                isCoinsList={true} 
                value={userData.statValue}
            />
        )}
        </li>
    ))}
                    </ul>
            </div>
        </div>
    );
}
