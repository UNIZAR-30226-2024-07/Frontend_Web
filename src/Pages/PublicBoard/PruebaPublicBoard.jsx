// Imports
import axios from "../../api/axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import constants from '../../constants'
import io from "socket.io-client"
import { useAuth } from "../../Context/AuthContext"
import './PruebaPublicBoard.css'
import { numPlayers, hand0, hand1, 
         drawCard, split, double, stick, 
         getPartidasPublicas, getInitCards,
         getResults, initPlayers, eliminatePlayers
        //  sleep
        } from './PublicBoardFunctions'
// Variable que se usará para la gestión de la conexión
let socket
const timeOut = 30

const PruebaPublicBoard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [boardId, setBoardId] = useState("") // BoardId

    const [mensajeExpulsion, setMensajeExpulsion] = useState(false)
    const [seconds, setSeconds] = useState(timeOut);  // Intervalo de tiempo
    const [showCoinsEarned, setShowCoinsEarned] = useState(false);  // Intervalo de tiempo

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

    const [partidasPublicas, setPartidasPublicas] = useState([]) // Lista de partidas públicas

    // Información usuario
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
    // Lógica juego partidas
    ////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        getPartidasPublicas(setPartidasPublicas)
    }, [])

    ////////////////////////////////////////////////////////////////////////////
    // Manejo de Socket.io
    ////////////////////////////////////////////////////////////////////////////

    const partidaPublica = (partida) => {
        socket.emit("enter public board", { body: { typeId: partida._id, userId: user._id }})
    }

    useEffect(() => {
        socket = io(constants.dirApi)

        //// Evento
        socket.on("starting public board", async (boardId) => {
            console.log("Que empieza la partida")
            setBoardId(boardId)

            // Obtener reverso carta
            await getReverseCard(setReverseCardUrl)
            
            // Si eres el guest, se envía el evento 'players public ready'
            const response = await axios.get('/publicBoard/boardById/' + boardId)
            if (response.status !== 200){
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            const board = response.data.board

            // Inicializar los useState de los jugadores
            initPlayers(board.players, user._id, setPlayer, restPlayers)
            
            if (board && board.players && board.players.length > 0) {
                const player = board.players.find(player => player.player === user._id);

                // Si se encontró al jugador, actualizar el estado de guestStatus con su valor
                if (player.guest) {
                    const req = { body: {boardId: boardId}}
                    socket.emit("players public ready", req)

                    console.log("Emitir: players public ready")///////////////////////////////////////////////////////////////////////
                }
            }
        })

        socket.on("play hand", (initCards) => {
            setSeconds(timeOut)
            // Dejar visionar las monedas ganadas
            setShowCoinsEarned(false)
            console.log("Ha llegado: play hand")

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

        socket.on("players deleted", (playersToDelete) => {
            // Al llegar este evento, se debe comprobar si el usuario ha sido
            // expulsado. En tal caso, se abandonará la partida y se volverá al
            // menú principal
            if (playersToDelete.includes(user._id)) {
                setMensajeExpulsion(true)
                setTimeout(() => {
                    navigate(constants.root + "PageDashboard")
                }, 3000)
            } else {
                eliminatePlayers(playersToDelete, restPlayers)
            }
            console.log("Jugadores eliminar: ", playersToDelete)
        })

        socket.on("hand results", (results) => {

            console.log(results)

            // Guardar resultados
            getResults(user._id, results, bank, setBank, player, setPlayer, restPlayers)
            
            // Visionar las monedas ganadas
            setShowCoinsEarned(true)
        })

    }, [user, bank, player, restPlayers, navigate]) // Se ejecuta solo una vez cuando el componente se monta


    /************************************************************************************************** */
    // Imprimir información de los jugadores
    const imprimir = () => {
        console.log('Bank: ', bank)
        console.log('Player: ', player)
        console.log('Rest Players: ', restPlayers)
    }
    /*************************************************************************************************** */

    return (
        <div>
            {/* Mensaje en caso de ser expulsado de la partida */}
            { mensajeExpulsion &&
                <div className="mensaje-expulsion">
                    <p className="titulo-mensaje-expulsion"> Expulsado por inactividad </p>
                    <p className="cuerpo-mensaje-expulsion"> Has sido expulsado de la partida por inactividad durante dos jugadas </p>
                </div>
            }
            {/* Listado partidas publicas para unirse */}
            <button type="submit" className="matchPublic">
                Solicitar partida pública
            </button>
            <div>
                {partidasPublicas.map(partida => (
                    <button style={{ marginRight: '10px' }} key={partida._id} onClick={() => partidaPublica(partida)}>
                        {partida.name}
                    </button>
                ))}
            </div>

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
                <p>Jugador:</p>
                {[hand0, hand1].map(numHand => (
                    <div key={numHand} style={{ backgroundColor: 'brown' }}>
                        { player && player.hands[numHand].active && (
                            <div>
                                <p>Mano {numHand} / Total: {player.hands[numHand].total}</p>
                                {showCoinsEarned && (
                                    <div key={numHand + 'player'}>
                                        <p>CoinsEarned: {player.hands[numHand].coinsEarned}</p>
                                    </div>
                                )}
                                {/* Mostrar botones interactuar solo si sus cartas no están confirmadas */}
                                {!player.hands[numHand].defeat && 
                                 !player.hands[numHand].blackJack &&
                                 !player.hands[numHand].stick ? (
                                    <div>
                                        <button style={{ marginRight: '10px' }} onClick={(e) => drawCard(e, numHand, player, setPlayer, boardId)}>DrawCard</button>
                                        <button style={{ marginRight: '10px' }} onClick={(e) => double(e, numHand, player, setPlayer, boardId)}>Double</button>
                                        <button style={{ marginRight: '10px' }} onClick={(e) => stick(e, numHand, player, setPlayer, boardId)}>Stick</button>
                                        
                                        {player.hands[hand0].active && 
                                        !player.hands[hand1].active &&
                                        player.hands[hand0].cards.length === 2 &&
                                        player.hands[hand0].cards[0].value == player.hands[hand0].cards[1].value && (
                                            // Split solo si no se ha hecho split y son dos cartas
                                            <button style={{ marginRight: '10px' }} onClick={(e) => split(e, player, setPlayer, boardId)}>Split</button>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <p>No puede realizar más jugadas. Se ha plantado.</p>
                                    </div>
                                )}
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
                            </div>
                        )}
                    </div>
                ))}
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
                        [hand0, hand1].forEach(numHand => {
                            if ( restPlayers[index] && restPlayers[index].hands[numHand].active) {
                                const restPlayerClassName = restPlayers[index].playing ? "rest-cards-playing" : "rest-cards-not-playing"
                                const handJSX = (
                                    <div className={restPlayerClassName} key={restPlayers[index].playerId + "-" + numHand}>
                                        {showCoinsEarned && (
                                            <div key={'restPlayer' + numHand}>
                                                <p>Mano {numHand} / Total: {restPlayers[index].hands[numHand].total}</p>
                                                <p>CoinsEarned: {restPlayers[index].hands[numHand].coinsEarned}</p>
                                            </div>
                                        )}
                                        <div className="cartas" 
                                             key={restPlayers[index].playerId + "-" + numHand} 
                                             style={{ backgroundColor: 'green' }}
                                        >  
                                            {/* Renderizar las cartas */}
                                            {restPlayers[index].hands[numHand].cards.map((card, cardIndex) => (
                                                <img
                                                    className="carta"
                                                    key={numHand + '-' + cardIndex + '-' + restPlayers[index].playerId + '-' + card.value + '-' + card.suit}
                                                    src={restPlayers[index].hands[numHand].show 
                                                        ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                                        : reverseCardUrl}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                                playerHands.push(handJSX);
                            }
                        });
                        jsxArray.push(playerHands);
                    }
                    return jsxArray;
                })()}
            </div>  

            <button type="submit" className="imprimir" onClick={imprimir}>
                Imprimir info jugadores
            </button>

            <p>Time remaining: {seconds} seconds</p>

        </div>
    )
}

export default PruebaPublicBoard