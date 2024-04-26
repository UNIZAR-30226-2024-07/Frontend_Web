// Imports
import axios from "../../api/axios"
import { useEffect, useState } from "react"
import constants from '../../constants'
import io from "socket.io-client"
import { useAuth } from "../../Context/AuthContext"
import './PruebaPublicBoard.css'
import { numPlayers, hand0, hand1, drawCard, split, double, stick, getPartidasPublicas, getInitCards} from './PublicBoardFunctions'
// Variable que se usará para la gestión de la conexión
let socket
const timeOut = 5

const PruebaPublicBoard = () => {
    const { user } = useAuth()
    const [boardId, setBoardId] = useState("") // BoardId

    const [seconds, setSeconds] = useState(timeOut);  // Intervalo de tiempo

    // Mano de un jugador
    const hand = {
        cards: [], // Cartas jugador
        total: 0, // Total cartas
        defeat: false, // Si defeat = true, el jugador ha perdido esta mano
        blackJack: false, // blackJack = true cuando se tienen 21 puntos
        active: false, // La mano se debe mostrar
        stick: false,   // Indica si se ha plantado o no el jugador con stick
        show: false  // Mostrar carta o no
    }
    // Información de un jugador
    const objPlayer = {
        playerId: '',
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
            if (board && board.players && board.players.length > 0) {
                const player = board.players.find(player => player.player === user._id);

                // Si se encontró al jugador, actualizar el estado de guestStatus con su valor
                if (player.guest) {
                    const req = { body: {boardId: boardId}}
                    socket.emit("players public ready", req)
                }
            }
        })

        socket.on("play hand", (initCards) => {
            setSeconds(timeOut)
            console.log("Ha llegado: play hand")

            // Inicializar la cartas
            // 1 carta del Bank
            // 2 cartas por jugador
            getInitCards(user._id, initCards, setBank, setPlayer, setRestPlayers)

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

    }, [user, bank]) // Se ejecuta solo una vez cuando el componente se monta


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
            {/* Listado partidas publicas para unirse */}
            <button type="submit" className="matchPublic">
                Solicitar partida pública
            </button>
            <div>
                {partidasPublicas.map(partida => (
                    <button key={partida._id} onClick={() => partidaPublica(partida)}>
                        {partida.name}
                    </button>
                ))}
            </div>

            <hr/>     {/* Linea separación */}

            {/* Mostrar mano BANCA */}
            <div style={{ backgroundColor: 'white'}}>
                <p>Banca</p>
                <div key={'Bank'} style={{ backgroundColor: 'yellow' }}>
                    {bank.hand.active && (
                        <div className="cartas">
                            {/* Renderizar las cartas */}
                            {bank.hand.cards.map((card, cardIndex) => (
                                // <img className="carta" key={cardIndex} src={constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png"}/>    
                                <img
                                    className="carta"
                                    key={cardIndex}
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
                                {/* Mostrar botones interactuar solo si sus cartas no están confirmadas */}
                                {!player.hands[numHand].defeat && 
                                 !player.hands[numHand].blackJack &&
                                 !player.hands[numHand].stick ? (
                                    <div>
                                        <button onClick={(e) => drawCard(e, numHand, player, setPlayer, boardId)}>DrawCard</button>
                                        <button onClick={(e) => double(e, numHand, player, setPlayer, boardId)}>Double</button>
                                        <button onClick={(e) => stick(e, numHand, player, setPlayer, boardId)}>Stick</button>
                                        
                                        {player.hands[hand0].active && 
                                        !player.hands[hand1].active &&
                                        player.hands[hand0].cards.length === 2 && (
                                            // Split solo si no se ha hecho split y son dos cartas
                                            <button onClick={(e) => split(e, player, setPlayer, boardId)}>Split</button>
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
                                        // <img className="carta" key={cardIndex} src={constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png"}/>
                                        <img
                                            className="carta"
                                            key={cardIndex}
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
                                const handJSX = (
                                    <div className="cartas" key={numHand + "-" + index} style={{ backgroundColor: 'green' }}>
                                        {/* Renderizar las cartas */}
                                        {restPlayers[index].hands[numHand].cards.map((card, cardIndex) => (
                                            // <img className="carta" key={cardIndex} src={constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png"}/> 
                                            <img
                                                className="carta"
                                                key={cardIndex}
                                                src={restPlayers[index].hands[numHand].show 
                                                    ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                                    : reverseCardUrl}
                                            />
                                        ))}
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