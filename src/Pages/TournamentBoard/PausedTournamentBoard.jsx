// Imports
// import '../MenuPartidaPublica.css'; // Importa el archivo CSS
import { MyButton } from "../../Components/MyButton";
import { MyNav } from '../../Components/MyNav';
import axios from "../../api/axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import constants from '../../constants'
import io from "socket.io-client"
import { useAuth } from "../../Context/AuthContext"
import "./TournamentBoard.css"
import { startLives, timeOut,
         drawCard, stick, pause, leave,
         eliminatePlayers,
         initPlayers, getInitCards, getResults,
        } from './TournamentBoardFunctions'
    import {AvatarId} from "../../Components/AvatarId"
    import { FaRegPaperPlane } from "react-icons/fa";
    import { MdExposurePlus1 } from "react-icons/md";
    import { FaHandPaper } from "react-icons/fa";
    import { Button } from "@nextui-org/react";
// Variable que se usará para la gestión de la conexión
let socket

const PausedTournamentBoard = () => {
    const { user } = useAuth()
    const { id } = useParams()
    const navigate = useNavigate()
    const [boardId, setBoardId] = useState("") // BoardId

    const [page, setPage] = useState(0)

    // Tiempo para ejecutar una partida o no
    const [seconds, setSeconds] = useState(timeOut);  
    // Para mostrar o no mostrar resultados en una partida
    const [showResults, setShowResults] = useState(false);  

    // Vector de mensajes de la partida
    const [messages, setMessages] = useState([]) 
    // Mensaje a enviar
    const [newMessage, setNewMessage] = useState("") 
    const [tapete, setTapete] = useState(null)   // Mano de la banca
    const [error, setError] = useState(null)   // Mano de la banca
    const [pageKey, setPageKey] = useState(false); // Estado para forzar la actualización del MyNav
    const [prevContador, setContador] = useState(false); // Estado para forzar la actualización del MyNav
    const [vidas, setVidas] = useState(4);
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
    }
    // Información de un jugador
    const objPlayer = {
        playerId: '',
        playing: true, // Si playing = true, significa que el usuario está 
        lives: startLives,  // Vidas le quedan al jugador

                       // dentro de la partida (no ha abandonado ni ha sido expulsado)
        hand: {...hand}
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
        socket.emit("resume tournament board", ({ body: { boardId: id, userId: user._id }}))
    }

    // Enviar mensaje
    const sendMessage = async (event) => {
        event.preventDefault()
        socket.emit("new tournament message", { body: { boardId: boardId,
                                                     userId: user._id,
                                                     message: newMessage }})
        setNewMessage("")
    }

    useEffect(() => {
        socket = io(constants.dirApi)

        socket.on("connect", async (socket) => {
            console.log("hey")
            reanudarPartida()
            try {
                const response = await axios.get('/rug/currentRug');
                console.log(response.data)
                setTapete(response.data.rug.imageFileName);
            } catch (error) {
                console.error('Failed to load cards:', error);
            }
            setError("Se unira en la siguiente ronda")
        })

        // Recibir play hand (se pueden hacer jugadas)
        socket.on("play hand", (initCards) => {
            console.log("page = ", page)
            setPageKey((pageKey) => pageKey+1)

            console.log("Momento 3", player.lives)
            setPage(3);
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

            // Limpiar el intervalo cuando el componente se desmonte o el temporizador se detenga
            return () => clearInterval(intervalId);
        })

        
        // Al llegar este evento, se debe comprobar si el usuario ha sido
        // expulsado. En tal caso, se abandonará la partida y se volverá al
        // menú principal
        socket.on("players deleted", (playersToDelete) => {

            if (playersToDelete.includes(user._id)) {
                if(vidas == 0){
                    navigate(constants.root + "PageLose")
                }
                setTimeout(() => {
                    navigate(constants.root + "PageDashboard")
                }, 3000)
            } else {
                eliminatePlayers(playersToDelete, restPlayers)
            }
        })

        // Recibir hand results (visionar resultados)
        socket.on("hand results", (results) => {
            setError("")
            // Visionar resultados
            setShowResults(true)
            console.log(results)

            // Guardar resultados
            getResults(user._id, results, bank, setBank, player, setPlayer, restPlayers)
        })

        // Api acepta que reaunudes la partida
        socket.on("resume accepted", async () => {
            
            // Vuelves a inicialiar 
            setBoardId(id)

            // Obtener reverso carta
            await getReverseCard(setReverseCardUrl)
        
            // Obtener información board
            const response = await axios.get('/publicBoard/boardById/' + id)
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
            setShowResults(false)
            if(vidas <= 0){
                navigate(constants.root + "PageLose")
            }
            else {
                navigate(constants.root + "PageWin")
            }            
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
    useEffect(() => {
        if (showResults) {
            setContador(prevContador => prevContador + 1);
        }
    }, [showResults]);
    
    useEffect(() => {
        setVidas(player.lives)
    }, [prevContador])
    return (
        <div>
        { page == 0 ? (
            <div className='page-publica'>
            <MyNav isLoggedIn={false} isDashboard={false} monedas={true}/>
            </div>
        ): (
            <div>
                <div key={pageKey}>
                    <MyNav isLoggedIn={false} isDashboard={false} isBoard={false} isBoardWithLives={true} lives={vidas} 
                    pausa={(e) => pause(e, boardId, navigate)}
                    salir={(e) => leave(e, boardId, navigate)}/> 
                </div>
                {/* {!showResults && <div className="timer-box">
                    <p>Segundos: {seconds}</p>
                </div>} */}
                <div className="fondo-juego" 
                    style={showResults ? { backgroundImage: `url(${constants.dirApi}/${constants.uploadsFolder}/${tapete})`, 
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain', // Ajusta la propiedad backgroundSize para cambiar el tamaño de la imagen
                    width: '100%',
                    height: '90%',    overflow: 'hidden',
                    position: 'absolute' } 
                    : { backgroundImage: `url(${constants.dirApi}/${constants.uploadsFolder}/${tapete})`,backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '84%',
                    height: '84%',
                    position: 'absolute',
                    overflow: "hidden"
                }}>                   
                    
                    {!showResults && 
                    <div className="cartas-banca">  {/* Mostrar mano BANCA */}
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
                        <div className="seconds">
                            {seconds}
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
                        
                            <div>
                                { player && player.hand.active && (
                                    <div>
                                        <p className="texto">Total: {player.hand.total}</p>
                                        <div key={'player'}>
                                        <p>CurrentLives: {player.lives}</p>
                                    </div>{/* Mostrar botones interactuar solo si sus cartas no están confirmadas */}
                                        <div className="cartas">
                                            {/* Renderizar las cartas */}
                                            {player.hand.cards.map((card, cardIndex) => (
                                                <img
                                                    className="carta"
                                                    key={cardIndex + '-' + player.playerId + '-' + card.value + '-' + card.suit}
                                                    src={player.hand.show 
                                                        ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                                        : reverseCardUrl}
                                                />
                                            ))}
                                        </div>
                                        <div style={{ width: '30px' }}></div> {/* Espacio entre manos */}

                                        {!player.hand.defeat && 
                                        !player.hand.blackJack &&
                                        !player.hand.stick && 
                                                
                                            <div className="actions-container">
                                                <div className="action-game">
                                                    <Button onClick={(e) => drawCard(e, player, setPlayer, boardId)} className="button-game">
                                                        <MdExposurePlus1 className="emote-game" />
                                                    </Button>
                                                    <p>Otra carta</p>
                                                </div> 

                                                <div className="action-game">
                                                    <Button onClick={(e) => stick(e, player, setPlayer, boardId)} className="button-game">
                                                        <FaHandPaper className="emote-game" />
                                                    </Button>
                                                    <p>Plantar</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )}
                            </div>
                        
                    </div>}
                    {/*Para mostrar resultados del jugador*/}
                    {showResults && <div className="cartas-jugador-resul">
                            <div>
                                { player && player.hand.active && (
                                    <div>
                                        <p className="texto">Total: {player.hand.total}</p>
                                        <div className="texto">
                                            <p>CoinsEarned: {player.hand.coinsEarned}</p>
                                        </div>
                                        {/* Mostrar botones interactuar solo si sus cartas no están confirmadas */}
                                        <div className="cartas">
                                            {/* Renderizar las cartas */}
                                            {player.hand.cards.map((card, cardIndex) => (
                                                <img
                                                    className="carta"
                                                    key={cardIndex + '-' + player.playerId + '-' + card.value + '-' + card.suit}
                                                    src={player.hand.show 
                                                        ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                                        : reverseCardUrl}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                    </div>}
                     {/* Mostrar resto JUGADORES */}
                <div className="cards-enemysa">
                    {/* Iterar sobre los jugadores */}
                    {restPlayers.map(player => {
                        const playerHands = []; // Array para almacenar las manos activas del jugador
                        // Iterar sobre las manos del jugador
                        //Verificar si la mano está activa
                        if (player.hand.active) {
                            const restPlayerClassName = player.playing ? "rest-cards-playing" : "rest-cards-not-playing";
                            // JSX para la mano
                            const handJSX = (
                                <div className={restPlayerClassName}>
                                    {/* Mostrar resultados si showResults es verdadero */}
                                    {showResults && (
                                        <div className="">
                                            <AvatarId user={player.playerId}/>
                                            <p>CurrentLives: {restPlayers[0].lives}</p>
                                        </div>
                                    )}
                                    <div className="cartas-pequeñas-container">
                                        <div className="cartas-pequeñas">
                                            {/* Renderizar las cartas de la mano0 */} 
                                            {player.hand.cards.map((card, cardIndex) => (
                                                <img
                                                    className="carta-grande"                                                  
                                                    key={`${cardIndex}-${player.playerId}-${card.value}-${card.suit}`}
                                                    src={player.hand.show 
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
            </div>

            
                { !showResults && 
                <div className="cuadrado-derecha">
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
            </div>
        )}
        
        {error &&  
        <div className="error-login">
            {error}
        </div>}
        </div>
       
    )
}

export default PausedTournamentBoard