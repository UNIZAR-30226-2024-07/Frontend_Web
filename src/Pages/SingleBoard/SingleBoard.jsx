// Imports
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import constants from '../../constants'
import io from "socket.io-client"
import { useAuth } from "../../Context/AuthContext"
import './SingleBoard.css'
import { hand0, hand1,
         drawCard, split, double, stick, leave,
         getInitCards, getResults
        } from './SingleBoardFunctions'

// Variable que se usará para la gestión de la conexión
let socket

const SingleBoard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [boardId, setBoardId] = useState("") // BoardId

    const [showCoinsEarned, setShowCoinsEarned] = useState(false);  // Intervalo de tiempo
    // Para ganar:
    //   - si se ha hecho double: coinsEarned > betFicticio * 2 para ganar a la banca
    //   - si no se ha hecho double: coinsEarned > betFicticio para ganar a la banca

    const bankLevels = ["beginner", "medium", "expert"]

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


    ////////////////////////////////////////////////////////////////////////////
    // Manejo de Socket.io
    ////////////////////////////////////////////////////////////////////////////

    const partidaSingle = (bankLevel) => {
        socket.emit("enter single board", { body: { bankLevel: bankLevel, userId: user._id }})
    }

    useEffect(() => {
        socket = io(constants.dirApi)

        //// Evento
        socket.on("starting single board", async (boardId) => {
            console.log("Que empieza la partida")
            setBoardId(boardId)

            const req = { body: {boardId: boardId}}
            socket.emit("players single ready", req)
            console.log("Emitir: players single ready")//////////////////////////////////////////////////////
        })

        socket.on("play hand", (initCards) => {
            // Dejar visionar las monedas ganadas
            setShowCoinsEarned(false)
            console.log("Ha llegado: play hand")

            // Inicializar la cartas
            // 1 carta del Bank
            // 2 cartas por jugador
            getInitCards(user._id, initCards, setBank, player, setPlayer)
        })

        socket.on("hand results", (results) => {

            console.log(results)

            // Guardar resultados
            getResults(user._id, results, bank, setBank, player, setPlayer)
            
            // Visionar las monedas ganadas
            setShowCoinsEarned(true)
        })

    }, [user, bank, player, navigate]) // Se ejecuta solo una vez cuando el componente se monta


    /************************************************************************************************** */
    // Imprimir información de los jugadores
    const imprimir = () => {
        console.log('Bank: ', bank)
        console.log('Player: ', player)
    }
    /*************************************************************************************************** */

    return (
        <div>
            {/* Listado partidas publicas para unirse */}
            {boardId === "" ? (
                <>
                <button type="submit" className="matchPublic">
                    Solicitar partida solitario
                </button>
                <div>
                    {bankLevels.map(bankLevel => (
                        <button style={{ marginRight: '10px' }} key={bankLevel} onClick={() => partidaSingle(bankLevel)}>
                            {bankLevel.toUpperCase()}
                        </button>
                    ))}
                </div>

                <hr/>     {/* Linea separación */}
                </>
            ) : (
                <>
                
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
                                    src={constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png"}
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
                <button style={{ marginRight: '10px' }} onClick={(e) => leave(e, boardId, navigate)}> Leave </button>
                {[hand0, hand1].map(numHand => (
                    <div key={numHand} style={{ backgroundColor: 'brown' }}>
                        { player && player.hands[numHand].active && (
                            <div>
                                <p>Mano {numHand} / Total: {player.hands[numHand].total}</p>
                                {showCoinsEarned && (
                                    <div key={numHand + 'player'}>
                                        {   // Banca mayor que 21 y jugador menor que 21
                                            ((player.hands[numHand].total <= 21) &&
                                            (bank.hand.total > 21 ))
                                            ||
                                            // Mayor que banca siendo los dos menor que 21
                                            ((player.hands[numHand].total <= 21) &&
                                            (bank.hand.total <= 21 ) &&
                                            (player.hands[numHand].total > bank.hand.total))

                                        ? (
                                            <p>¡¡ GANADOR !!</p>
                                        ) : (
                                            <p>DERROTA :(</p>
                                        )} 
                                    </div>
                                )}
                                {/* Mostrar botones interactuar solo si sus cartas no están confirmadas */}
                                {!player.hands[numHand].defeat && 
                                 !player.hands[numHand].blackJack &&
                                 !player.hands[numHand].stick ? (
                                    <div>
                                        <button style={{ marginRight: '10px' }} onClick={(e) => drawCard(e, numHand, player, setPlayer, boardId)}> DrawCard </button>
                                        <button style={{ marginRight: '10px' }} onClick={(e) => double(e, numHand, player, setPlayer, boardId)}> Double </button>
                                        <button style={{ marginRight: '10px' }} onClick={(e) => stick(e, numHand, player, setPlayer, boardId)}> Stick </button>
                                        
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
                                            src={constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png"}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button type="submit" className="imprimir" onClick={imprimir}>
                Imprimir info jugadores
            </button>
                </>
            )}
        </div>
    )
}

export default SingleBoard