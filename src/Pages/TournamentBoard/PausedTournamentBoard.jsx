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

// Variable que se usará para la gestión de la conexión
let socket

const PausedTournamentBoard = () => {
    const { user } = useAuth()
    const { id } = useParams()
    const navigate = useNavigate()
    const [boardId, setBoardId] = useState("") // BoardId

    const [page, setPage] = useState(0)
    const [mensajeExpulsion, setMensajeExpulsion] = useState(false)
    const [mensajeFin, setMensajeFin] = useState(false)

    // Tiempo para ejecutar una partida o no
    const [seconds, setSeconds] = useState(timeOut);  
    // Para mostrar o no mostrar resultados en una partida
    const [showResults, setShowResults] = useState(false);  

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

        socket.on("connect", (socket) => {
            console.log("hey")
            reanudarPartida()
        })

        // Recibir play hand (se pueden hacer jugadas)
        socket.on("play hand", (initCards) => {
            console.log("page = ", page)
            if (page != 1) {
                console.log("Hey2")
                setPage(1)
            } 

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
                setMensajeExpulsion(true)
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
            setMensajeFin(true)
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

    return (
        <div>
        { page == 0 ? (
            <div className='page-publica'>
            <MyNav isLoggedIn={false} isDashboard={false} monedas={true}/>
            <div className='mensaje-esperando'>
                <p> Será readmitido en la partida cuando la ronda actual finalice </p>
            </div>
            </div>
        ) : (
            <div>
            {/* Mensaje en caso de ser expulsado de la partida */}
            { mensajeExpulsion &&
                <div className="mensaje-expulsion">
                    <p className="titulo-mensaje-expulsion"> Expulsado por inactividad </p>
                    <p className="cuerpo-mensaje-expulsion"> Has sido expulsado de la partida por inactividad durante dos jugadas </p>
                </div>
            }
            { mensajeFin &&
                <div className="mensaje-fin">
                    <p className="titulo-mensaje-fin"> FIN </p>
                    <p className="cuerpo-mensaje-fin"> La partida finalizó. Cargando...</p>
                </div>
            }

            <hr/>     {/* Linea separación */}

            {/* Mostrar mano BANCA */}
            <div style={{ backgroundColor: 'white'}}>
                <p>Banca / Total: {bank.hand.total}</p>
                <div key={'Bank'} style={{ backgroundColor: 'yellow' }}>
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
            </div>

            <hr/>     {/* Linea separación */}

            {/* Mostrar manos JUGADOR */}
            <div style={{ backgroundColor: 'white'}}>
                <p>Jugador</p>
                <button style={{ marginRight: '10px' }} onClick={(e) => pause(e, boardId, navigate)}> Pause </button>
                <button style={{ marginRight: '10px' }} onClick={(e) => leave(e, boardId, navigate)}> Leave </button>
               
                <div key={"handTournament"} style={{ backgroundColor: 'brown' }}>
                    { player && player.hand.active && (
                        <div>
                            <p>Total: {player.hand.total}</p>
                            {showResults && (
                                <div key={'player'}>
                                    <p>CurrentLives: {player.lives}</p>
                                </div>
                            )}
                            {/* Mostrar botones interactuar solo si sus cartas no están confirmadas */}
                            {   !player.hand.defeat && 
                                !player.hand.blackJack &&
                                !player.hand.stick ? (
                                <div>
                                    <button style={{ marginRight: '10px' }} onClick={(e) => drawCard(e, player, setPlayer, boardId)}> DrawCard </button>
                                    <button style={{ marginRight: '10px' }} onClick={(e) => stick(e, player, setPlayer, boardId)}> Stick </button>
                                </div>
                            ) : (
                                <div>
                                    <p>No puede realizar más jugadas. Se ha plantado.</p>
                                </div>
                            )}
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
            </div>

            <hr/>     {/* Linea separación */}

            {/* Mostrar resto JUGADORES */}

            <div style={{ backgroundColor: 'blue' }}>
                {/* Iterar sobre los jugadores */}
                <p>Resto jugadores:</p>
                {(() => {
                    const jsxArray = [];
                    for (let index = 0; index < restPlayers.length; index++) {
                        const playerHands = [];
                        if ( restPlayers[index] && restPlayers[index].hand.active) {
                            const restPlayerClassName = restPlayers[index].playing ? "rest-cards-playing" : "rest-cards-not-playing"
                            const handJSX = (
                                <div className={restPlayerClassName} key={restPlayers[index].playerId}>
                                    {showResults && (
                                        <div key={'restPlayer'}>
                                            <p>Total: {restPlayers[index].hand.total}</p>
                                            <p>CurrentLives: {restPlayers[index].lives}</p>
                                        </div>
                                    )}
                                    <div className="cartas" 
                                            key={restPlayers[index].playerId + "-"} 
                                            style={{ backgroundColor: 'green' }}
                                    >  
                                        {/* Renderizar las cartas */}
                                        {restPlayers[index].hand.cards.map((card, cardIndex) => (
                                            <img
                                                className="carta"
                                                key={'-' + cardIndex + '-' + restPlayers[index].playerId + '-' + card.value + '-' + card.suit}
                                                src={restPlayers[index].hand.show 
                                                    ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                                    : reverseCardUrl}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                            playerHands.push(handJSX);
                        }
                        jsxArray.push(playerHands);
                    }
                    return jsxArray;
                })()}
            </div>  

            <p>Time remaining: {seconds} seconds</p>
            <div>
                <div>
                    {/* Renderizar cada mensaje */}
                    {messages.map((message, index) => (
                        <div className="message" key={index}>
                            <p className="emitter">{message.userId === user._id ? 'Yo' : message.name }</p>
                            <p className="msg-text">{message.message}</p>
                        </div>
                    ))}
                </div>
                
                <form>
                    <input
                        type="text"
                        value={newMessage}
                        className="input-text"
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button className="enviar" onClick={(e) => sendMessage(e)}> Enviar </button>
                </form>
            </div>
        </div>

        )}
        </div>
       
    )
}

export default PausedTournamentBoard