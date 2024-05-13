// Imports
// import '../MenuPartidaPublica.css'; // Importa el archivo CSS
// import { MyButton } from "../../Components/MyButton";
import { MyNav } from '../../Components/MyNav';
import axios from "../../api/axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import constants from '../../constants'
import io from "socket.io-client"
import { useAuth } from "../../Context/AuthContext"
import "./PrivateBoard.css"
import { hand0, hand1, timeOut,
         drawCard, split, double, stick, pause, leave,
         eliminatePlayers,
         initPlayers, getInitCards, getResults,
        } from './PrivateBoardFunctions'
import { GoTrophy } from "react-icons/go";
import {AvatarId} from "../../Components/AvatarId"
import { FaRegPaperPlane } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdExposurePlus1 } from "react-icons/md";
import { FaHandPaper } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import MyLoading from "../../Components/MyLoading"

// Variable que se usará para la gestión de la conexión
let socket

const PausedPrivateBoard = () => {
    const { user } = useAuth()
    const { id } = useParams()
    const navigate = useNavigate()
    const [boardId, setBoardId] = useState("") // BoardId

    const [page, setPage] = useState(0)

    // Tiempo para ejecutar una partida o no
    const [seconds, setSeconds] = useState(timeOut);  
    // Para mostrar o no mostrar resultados en una partida
    const [showResults, setShowResults] = useState(false);  
    const [primero, setPrimero] = useState(0)   // Mano de la banca
    const [primera, setPrimera] = useState(0)   // Mano de la banca
    const [listo, setListo] = useState(false)   // Mano de la banca
    const [hecho, setHecho] = useState(1)   // Mano de la banca
    const [error, setError] = useState(null)   // Mano de la banca
    const [pageKey, setPageKey] = useState(false); // Estado para forzar la actualización del MyNav

    // Vector de mensajes de la partida
    const [messages, setMessages] = useState([]) 
    // Mensaje a enviar
    const [newMessage, setNewMessage] = useState("") 

    // Objetos para inicializar la información de banca y jugadores
    // Mano de un jugador
    const hand = {
        cards: [], // Cartas jugador
        total: 0, // Total cartas
        defeat: false, // Si defeat = true, el jugador ha perdido esta mano
        blackJack: false, // blackJack = true cuando se tienen 21 puntos
        active: false, // La mano se debe mostrar
        stick: false,   // Indica si se ha plantado o no el jugador con stick
        show: false,  // Mostrar carta o no
        coinsEarned: 0  // Monedas ganadas
    }
    // Información de un jugador
    const objPlayer = {
        playerId: '',
        playing: true, // Si playing = true, significa que el usuario está 
                       // dentro de la partida (no ha abandonado ni ha sido expulsado)
        hands: [{ ...hand }, { ...hand }]
    }
    // Información banca
    const objBank = {
        playerId: 'Bank',
        hand: {...hand}
    }

    // Información todos los jugadores
    const [bank, setBank] = useState(objBank)   // Mano de la banca
    const [player, setPlayer] = useState(objPlayer);   // Mano del jugador
    const [restPlayers, setRestPlayers] = useState([]);   // Mnos resto jugadores

    // Información usuario
    // Carta boca abajo
    const [reverseCardUrl, setReverseCardUrl] = useState('')
    // Las monedas actuales. Se irán actualizando cuando lleguen los resultados
    const [currentCoins, setCurrentCoins] = useState(user.coins)
    // Función obtener reverso carta
    const getReverseCard = async(setReverseCardUrl) => {
        const response = await axios.get('/card/currentCard')
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }
        setReverseCardUrl(constants.dirApi + "/" + constants.uploadsFolder + "/" + response.data.card.imageFileName)
    }

    ////////////////////////////////////////////////////////////////////////////
    // Manejo de Socket.io
    ////////////////////////////////////////////////////////////////////////////
    
    // Reanudar Partida
    const reanudarPartida = () => {
        console.log("Partida pausada id: ", id)
        console.log("UserId", user._id)
        socket.emit("resume private board", ({ body: { boardId: id, userId: user._id }}))
        setPage(1);
        setHecho(0);  
    }

    // Enviar mensaje
    const sendMessage = async (event) => {
        event.preventDefault()
        socket.emit("new private message", { body: { boardId: boardId,
                                                     userId: user._id,
                                                     message: newMessage }})
        setNewMessage("")
    }
    useEffect(() => {
        if(primero==0){
            const saberMonedas = async () => {
                try {
                const response = await axios.get('/user/verify');
                setCurrentCoins(response.data.user.coins);
                } catch (error) {
                console.error('Failed to load cards:', error);
                }
            };
            saberMonedas(); 
        }
        if(primero === 0 && hecho === 0 ) { 
            setHecho(1);
            if(primera === 0){
                setListo(true);
                setPrimera(1);
            }
        }
        
    }, [hecho, currentCoins, user, primero, primera]);
    useEffect(() => {
        socket = io(constants.dirApi)

        socket.on("connect", (socket) => {
            console.log("hey")
            reanudarPartida()
        })

        // Recibir play hand (se pueden hacer jugadas)
        socket.on("play hand", (initCards) => {
            setPrimero(2);
            setPageKey(prevKey => prevKey + 1);
            if(primera === 0){
                setListo(false);
            }
            setError("");
            // Inicializar contador
            setSeconds(timeOut)

            // Dejar visionar resultados
            setShowResults(false)

            // Inicializar la cartas
            // 1 carta del Bank
            // 2 cartas por jugador
            getInitCards(user._id, initCards, setBank, player, setPlayer, restPlayers, setRestPlayers)

            let intervalId // Variable para almacenar el ID del intervalo
            // Función para iniciar el contador de tiempo
            const startTimer = () => {
                intervalId = setInterval(() => {
                    setSeconds(prevSeconds => {
                        if (prevSeconds === 0) {
                        clearInterval(intervalId);
                        return 0;
                        }
                        return prevSeconds - 1;
                    });
                }, 1000);
            };
            startTimer()
            if (messages.current) {
                // Acción que involucra messages.current
                messages.current.scrollTop = messages.current.scrollHeight;
            }
            // Limpiar el intervalo cuando el componente se desmonte o el temporizador se detenga
            return () => clearInterval(intervalId);
        })

        
        // Al llegar este evento, se debe comprobar si el usuario ha sido
        // expulsado. En tal caso, se abandonará la partida y se volverá al
        // menú principal
        socket.on("players deleted", (playersToDelete) => {

            if (playersToDelete.includes(user._id)) {
                setError("Has sido expulsado por dos o mas veces sin jugar")
                setTimeout(() => {
                    navigate(constants.root + "PageDashboard")
                }, 3000)
            } else {
                eliminatePlayers(playersToDelete, restPlayers)
            }
        })

        // Recibir hand results (visionar resultados)
        socket.on("hand results", (results) => {

            // Visionar resultados
            setShowResults(true)

            // Guardar resultados
            getResults(user._id, results, bank, setBank, player, setPlayer, restPlayers, setCurrentCoins)
        })

        // Api acepta que reaunudes la partida
        socket.on("resume accepted", async () => {
            
            // Vuelves a inicialiar 
            setBoardId(id)

            // Obtener reverso carta
            await getReverseCard(setReverseCardUrl)
        
            // Obtener información board
            const response = await axios.get('/privateBoard/boardById/' + id)
            if (response.status !== 200){
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            const board = response.data.board
            
            // Inicializar los useState de los jugadores
            // En el "documento json" de cada jugador, se pone su playerId
            // De tal manera que cada "documento json" va asociado a un jugador
            initPlayers(board.players, user._id, setPlayer, restPlayers)

        })

        // Api comunica que h terminado la partida
        socket.on("finish board", () => {
            setError("Se termino la partida");
            setTimeout(() => {
                navigate(constants.root + "PageDashboard")
            }, 3000)
        })

        // Llega un mensaje al chat
        socket.on("new message", (args) => {

            const message = args.message
            const name = args.name
            const userId = args.userId
            // Se añade al messages el mensaje message junto con su emisor
            // 'userId' si no es el mismo usuario
            setMessages(prevMessages => [
                ...prevMessages,
                { message, name, userId }
            ])
        })
    }, [user, bank, player, restPlayers, navigate, id])

    // por si la pantalla de cargando dura mucho rato
    useEffect(() => {
        let timeoutId;
        if (listo) {
            // Si loading está activado, configuramos un temporizador para 40 segundos
            timeoutId = setTimeout(() => {
            // Aquí se ejecuta la acción cuando loading ha estado activo durante 40 segundos
            // Por ejemplo, puedes hacer algo como:
            console.log("Han pasado 40 segundos con loading activado. Realizando acción X.");
            // Realiza la acción que necesitas aquí
            setError("Ha ocurrido un error al iniciar la partida");
            {(e) => leave(e, boardId, navigate)}; 
            timeoutId = setTimeout(() => {
                navigate(constants.root + "PageDashboard")
            }, 2000); // 40 segundos en milisegundos
        }, 100000); // 45 segundos en milisegundos
    }

    return () => {
        // Si loading se desactiva antes de que pasen los 40 segundos, limpiamos el temporizador
        clearTimeout(timeoutId);
    };
}, [navigate, listo]);

    return (
        <div>
        {listo && 
            <div className="page-publica">
                <MyLoading/>
            </div>
        }
        { !listo && page == 0 ? (
            <div className='page-publica'>
            <MyNav isLoggedIn={false} isDashboard={false} monedas={true}/>
            <div className='mensaje-esperando'>
                <p> Será readmitido en la partida cuando la ronda actual finalice </p>
            </div>
            </div>
        ) : (
           // para el juego en si mismo (no se sale de aqui)
           <div className="fondo-juego">
           <div key={pageKey}>
               <MyNav isLoggedIn={false} isDashboard={false} isBoard={true} coinsCurrent={currentCoins} 
               pausa={(e) => pause(e, boardId, navigate)}
               salir={(e) => leave(e, boardId, navigate)}/> 
           </div>
           {!showResults && <div className="cartas-banca">  {/* Mostrar mano BANCA */}
               <p>Banca: {bank.hand.total}</p>
               <div key={'Bank'}> {/*cartas banco*/}
                   {bank.hand.active && (
                       <div className="cartas">
                           {/* Renderizar las cartas */}
                           {bank.hand.cards.map((card, cardIndex) => (
                               <img
                                   className="carta"
                                   key={'-' + cardIndex + '-' + "Bank" + '-' + card.value + '-' + card.suit}
                                   src={bank.hand.show 
                                       ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                       : reverseCardUrl}
                               />
                           ))}
                       </div>
                   )}
               </div>
           </div>}
           {showResults && <div className="cartas-banca-resul">  {/* Mostrar mano BANCA */}
               <p className="texto">Banca: {bank.hand.total}</p>
               <div key={'Bank'}> {/*cartas banco*/}
                   {bank.hand.active && (
                       <div className="cartas">
                           {/* Renderizar las cartas */}
                           {bank.hand.cards.map((card, cardIndex) => (
                               <img
                                   className="carta"
                                   key={'-' + cardIndex + '-' + "Bank" + '-' + card.value + '-' + card.suit}
                                   src={bank.hand.show 
                                       ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                       : reverseCardUrl}
                               />
                           ))}
                       </div>
                   )}
               </div>
           </div>}

           {/* Mostrar manos JUGADOR */}
           {!showResults && <div className="cartas-jugador">
               {[hand0, hand1].map(numHand => (
                   <div key={numHand}>
                       { player && player.hands[numHand].active && (
                           <div>
                               <p className="texto">Total: {player.hands[numHand].total}</p>
                               {showResults && (
                                   <div className="texto" key={numHand + 'player'}>
                                       <p>CoinsEarned: {player.hands[numHand].coinsEarned}</p>
                                   </div>
                               )}
                               {/* Mostrar botones interactuar solo si sus cartas no están confirmadas */}
                               <div className="cartas">
                                   {/* Renderizar las cartas */}
                                   {player.hands[numHand].cards.map((card, cardIndex) => (
                                       <img
                                           className="carta"
                                           key={numHand + '-' + cardIndex + '-' + player.playerId + '-' + card.value + '-' + card.suit}
                                           src={player.hands[numHand].show 
                                               ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                               : reverseCardUrl}
                                       />
                                   ))}
                               </div>
                               <div style={{ width: '30px' }}></div> {/* Espacio entre manos */}

                               {!player.hands[numHand].defeat && 
                               !player.hands[numHand].blackJack &&
                               !player.hands[numHand].stick && 
                                       
                                   <div className="actions-container">
                                       <div className="action-game">
                                           <Button onClick={(e) => drawCard(e, numHand, player, setPlayer, boardId)} className="button-game">
                                               <MdExposurePlus1 className="emote-game" />
                                           </Button>
                                           <p>Otra carta</p>
                                       </div> 

                                       <div className="action-game">
                                           <Button onClick={(e) => stick(e, numHand, player, setPlayer, boardId)} className="button-game">
                                               <FaHandPaper className="emote-game" />
                                           </Button>
                                           <p>Plantar</p>
                                       </div>

                                       <div className="action-game">
                                           <Button  onClick={(e) => double(e, numHand, player, setPlayer, boardId)} className="button-game">
                                               <RxCross2 className="emote-game" />
                                           </Button>
                                           <p>
                                           Doblar
                                           </p>
                                       </div>

                                       {player.hands[hand0].active && 
                                           !player.hands[hand1].active &&
                                           player.hands[hand0].cards.length === 2 &&
                                           player.hands[hand0].cards[0].value == player.hands[hand0].cards[1].value && (
                                               <div className="action-game">
                                                   <Button onClick={(e) => split(e, player, setPlayer, boardId)} className="button-game">
                                                       <GoTrophy className="emote-game" />
                                                   </Button>
                                                   <p>Split</p>
                                               </div>
                                           )
                                       }
                               
                                   </div>
                               }
                           
                           </div>
                       )}
                   </div>
               ))}
           </div>}

           {showResults && <div className="cartas-jugador-resul">
               {[hand0, hand1].map(numHand => (
                   <div key={numHand}>
                       { player && player.hands[numHand].active && (
                           <div>
                               <p className="texto">Total: {player.hands[numHand].total}</p>
                               {showResults && (
                                   <div className="texto" key={numHand + 'player'}>
                                       <p>CoinsEarned: {player.hands[numHand].coinsEarned}</p>
                                   </div>
                               )}
                               {/* Mostrar botones interactuar solo si sus cartas no están confirmadas */}
                               <div className="cartas">
                                   {/* Renderizar las cartas */}
                                   {player.hands[numHand].cards.map((card, cardIndex) => (
                                       <img
                                           className="carta"
                                           key={numHand + '-' + cardIndex + '-' + player.playerId + '-' + card.value + '-' + card.suit}
                                           src={player.hands[numHand].show 
                                               ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                               : reverseCardUrl}
                                       />
                                   ))}
                               </div>
                               <div style={{ width: '30px' }}></div> {/* Espacio entre manos */}

                               {!player.hands[numHand].defeat && 
                               !player.hands[numHand].blackJack &&
                               !player.hands[numHand].stick && 
                               !showResults &&        
                                   <div className="actions-container">
                                       <div className="action-game">
                                           <Button onClick={(e) => drawCard(e, numHand, player, setPlayer, boardId)} className="button-game">
                                               <MdExposurePlus1 className="emote-game" />
                                           </Button>
                                           <p>Otra carta</p>
                                       </div> 

                                       <div className="action-game">
                                           <Button onClick={(e) => stick(e, numHand, player, setPlayer, boardId)} className="button-game">
                                               <FaHandPaper className="emote-game" />
                                           </Button>
                                           <p>Plantar</p>
                                       </div>

                                       <div className="action-game">
                                           <Button  onClick={(e) => double(e, numHand, player, setPlayer, boardId)} className="button-game">
                                               <RxCross2 className="emote-game" />
                                           </Button>
                                           <p>
                                           Doblar
                                           </p>
                                       </div>

                                       {player.hands[hand0].active && 
                                           !player.hands[hand1].active &&
                                           player.hands[hand0].cards.length === 2 &&
                                           player.hands[hand0].cards[0].value == player.hands[hand0].cards[1].value && (
                                           !showResults &&        
                                           <div className="action-game">
                                                   <Button onClick={(e) => split(e, player, setPlayer, boardId)} className="button-game">
                                                       <GoTrophy className="emote-game" />
                                                   </Button>
                                                   <p>Split</p>
                                               </div>
                                           )
                                       }
                               
                                   </div>
                               }
                           
                           </div>
                       )}
                   </div>
               ))}
           </div>}
           {/* Mostrar resto JUGADORES */}
           <div className="cards-enemys">
                   {/* Iterar sobre los jugadores */}
                   {restPlayers.map(player => {
                       const playerHands = []; // Array para almacenar las manos activas del jugador
                       // Iterar sobre las manos del jugador
                       //Verificar si la mano está activa
                       if (player.hands[hand0].active) {
                           const restPlayerClassName = player.playing ? "rest-cards-playing" : "rest-cards-not-playing";
                           // JSX para la mano
                           const handJSX = (
                               <div className={restPlayerClassName} key={`${player.playerId}-${hand0}`}>
                                   {/* Mostrar resultados si showResults es verdadero */}
                                   
                                       <div>
                                           <AvatarId user={player.playerId}/>
                                           {showResults && (<div className=''>
                                               <p className="texto">CoinsEarned: {player.hands[hand0].coinsEarned + player.hands[hand1].coinsEarned}</p>
                                               </div>
                                           )}
                                       </div>
                                   
                                   <div className="cartas-pequeñas-container">
                                       <div className="cartas-pequeñas">
                                           {/* Renderizar las cartas de la mano0 */} 
                                           {player.hands[hand0].cards.map((card, cardIndex) => (
                                               <img
                                                   className={(player.hands[hand1].cards.length > 0 ) ? "carta-peq" : "carta-gran"}
                                                   key={`${hand0}-${cardIndex}-${player.playerId}-${card.value}-${card.suit}`}
                                                   src={player.hands[hand0].show 
                                                       ? `${constants.root}Imagenes/cards/${card.value}-${card.suit}.png` 
                                                       : reverseCardUrl}
                                               />
                                           ))}
                                           <div style={{ width: '30px' }}></div> {/* Espacio entre manos */}
                                           {/* Renderizar las cartas de la mano1 */}
                                           {player.hands[hand1].cards.map((card, cardIndex) => (
                                               <img
                                                   className="carta-peq"
                                                   key={`${hand1}-${cardIndex}-${player.playerId}-${card.value}-${card.suit}`}
                                                   src={player.hands[hand1].show 
                                                       ? `${constants.root}Imagenes/cards/${card.value}-${card.suit}.png` 
                                                       : reverseCardUrl}
                                               />
                                           ))} 
                                   </div>
                               </div>
                               </div>
                           );
                           playerHands.push(handJSX);
                       }
                   return playerHands;
                   })} 
               </div>  
       { !listo && !showResults && <div className="cuadrado-derecha">
           <div className="lista-mensajesa">
               {messages.map((message, index) => (
               <div className="messagea" key={index}>
                   <div className="msg-contenta">
                       <div className="msg-avatara">
                           <AvatarId user={message.userId}/>
                       </div>
                       <div className="msg-texta">
                           <p>{message.message}</p>
                       </div>
                   </div>
               </div>
           ))}
           </div>
           <form className="formulario-mensaje" onSubmit={(e) => sendMessage(e)}>
               <input
                   type="text"
                   value={newMessage}
                   className="input-text"
                   onChange={(e) => setNewMessage(e.target.value)}
                   placeholder="Escribe tu mensaje aquí"
               />
               <button type="submit" className="icono-enviar"><FaRegPaperPlane/></button>
           </form>
       </div>}
   {/*IMPORTANTE QUITARLO*/}
   {/* <p>Time remaining: {seconds} seconds</p>  */}
       </div>
   )}
   {error &&  
   <div className="error-login">
       {error}
   </div>}
   </div>            
   
       
    )
}

export default PausedPrivateBoard