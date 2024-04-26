// Imports
import axios from "../api/axios"
import { useEffect, useState } from "react"
import constants from '../constants'
import io from "socket.io-client"
import { useAuth } from "../Context/AuthContext"

// Variable que se usará para la gestión de la conexión
let socket

const numPlayers = 2  // Esta información hay que obtenerla cuando se presiona en unir partida
const hand0 = 0      // Primera mano
const hand1 = 1     // Segunda mano
const indexUser = 0  // Indice del jugador en players

const PruebaPublicBoard = () => {
    const { user } = useAuth()
    const [boardId, setBoardId] = useState("") // BoardId

    // Mano de un jugador
    const hand = {
        cards: [], // Vector que contiene las cartas de la jugada
        total: 0, // Suma de la puntuación de las cartas
        defeat: false, // Si defeat = true, el jugador ha perdido esta mano
        blackJack: false, // blackJack = true cuando se tienen 21 puntos
        active: false, // TODO: 
        stick: false   // Indica si se ha plantado o no el jugador con stick
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
    // El jugador players[0] es el user
    const [bank, setBank] = useState(objBank)   // Información de la banca
    const [player, setPlayer] = useState(objPlayer);   
    const [restPlayers, setRestPlayers] = useState([]);   // Información resto jugadores

    const [tituloVisible, setTituloVisible] = useState(false) // Variable "tonta" para ver cuando se ha conseguido una partida
    const [partidasPublicas, setPartidasPublicas] = useState([]) // Lista de partidas públicas

    const getPartidasPublicas = async () => {
        try {
            const response = await axios.get('/publicBoardType/getAll')
            if (response.status !== 200) {
                return console.error(response.data)
            }
    
            setPartidasPublicas(response.data.publicBoardTypes)
        } catch (e) {
            console.error("Error al pedir las partidas. " + e.message)
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Lógica juego partidas
    ////////////////////////////////////////////////////////////////////////////

    // numHand: 0 si es la primera mano / 1 si es la segunda mano
    const drawCard = async (event, numHand, player, setPlayer) => {
        event.preventDefault()
        try {
            const response = await axios.put('/publicBoard/drawCard', {
                boardId: boardId,
                cardsOnTable: player.hands[numHand].cards
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }

            // console.log('DrawCard: ', response.data);
            const updatedPlayer = {...player}
            updatedPlayer.hands[numHand].cards = response.data.cardsOnTable
            updatedPlayer.hands[numHand].total = response.data.totalCards
            updatedPlayer.hands[numHand].defeat = response.data.defeat
            updatedPlayer.hands[numHand].blackJack = response.data.blackJack    
            updatedPlayer.hands[numHand].active = true
            setPlayer(updatedPlayer)

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const split = async (event, player, setPlayer) => {
        event.preventDefault()
        try {
            if ((player[hand0].active && player[hand1].active)
                 || (player[hand0].active && !player[hand1].active && player[hand1].length !== 2)) {
                console.log("Fallo: Solo se puede hacer split al principio de la partida con dos cartas y deben ser iguales");
                throw new Error('Error: Solo se puede hacer split al principio de la partida con dos cartas y deben ser iguales');
            }
            const response = await axios.put('/publicBoard/split', {
                boardId: boardId,
                cardsOnTable: player.hands[hand0].cards
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            // console.log('Avatares:', response);
            const updatedPlayer = {...player}

            updatedPlayer.hands[hand0].cards = response.data.cardsOnTableFirst
            updatedPlayer.hands[hand0].total = response.data.totalCardsFirst
            updatedPlayer.hands[hand0].defeat = response.data.defeatFirst
            updatedPlayer.hands[hand0].blackJack = response.data.blackJackFirst  
            updatedPlayer.hands[hand0].active = true

            updatedPlayer.hands[hand1].cards = response.data.cardsOnTableSecond
            updatedPlayer.hands[hand1].total = response.data.totalCardsSecond
            updatedPlayer.hands[hand1].defeat = response.data.defeatSecond
            updatedPlayer.hands[hand1].blackJack = response.data.blackJackSecond  
            updatedPlayer.hands[hand1].active = true

            setPlayer(updatedPlayer)

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const double = async (event, numHand, player, setPlayer) => {
        event.preventDefault()
        try {
            const response = await axios.put('/publicBoard/double', {
                boardId: boardId,
                cardsOnTable: player.hands[numHand].cards
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            // console.log('Avatares:', response);
            const updatedPlayer = {...player}
            updatedPlayer.hands[numHand].cards = response.data.cardsOnTable
            updatedPlayer.hands[numHand].total = response.data.totalCards
            updatedPlayer.hands[numHand].defeat = response.data.defeat
            updatedPlayer.hands[numHand].blackJack = response.data.blackJack    
            updatedPlayer.hands[numHand].active = true
            updatedPlayer.hands[numHand].stick = true
            setPlayer(updatedPlayer)
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const stick = async (event, numHand, player) => {
        event.preventDefault()
        try {
            const response = await axios.put('/publicBoard/stick', {
                boardId: boardId,
                cardsOnTable: player.hands[numHand].cards
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            console.log('RESULTADO GUARDADO CORRECTAMENTE');
            const updatedPlayer = {...player}
            updatedPlayer.hands[numHand].stick = true
            setPlayer(updatedPlayer)
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        getPartidasPublicas()
    }, [])

    ////////////////////////////////////////////////////////////////////////////
    // Manejo de Socket.io
    ////////////////////////////////////////////////////////////////////////////

    const partidaPublica = (partida) => {
        socket.emit("enter public board", { body: { typeId: partida._id, userId: user._id }})
    }

    useEffect(() => {
        socket = io(constants.dirApi)

        socket.on("starting public board", (boardId, initCards) => {
            console.log("Que empieza la partida")
            setTituloVisible(!tituloVisible)
            setBoardId(boardId)
            
            // Guardar banca
            // Información de la banca en el último componente initCards
            const bankObj = {
                playerId: 'Bank',
                hand: {
                        cards: initCards[initCards.length - 1].cards, // Vector que contiene las cartas de la jugada
                        total: initCards[initCards.length - 1].totalCards, // Suma de la puntuación de las cartas
                        defeat: false, // Si defeat = true, el jugador ha perdido esta mano
                        blackJack: initCards[initCards.length - 1].blackJack, // blackJack = true cuando se tienen 21 puntos
                        active: true, // TODO: 
                        stick: false   // Indica si se ha plantado o no el jugador con stick
                    }
            }
            setBank(bankObj)
                        
            // Guardar primeras dos cartas usuario
            const infoPlayer = initCards.find(infoPlayer => infoPlayer.userId === user._id);
            
            // Información de un jugador
            const playerObj = {
                playerId: infoPlayer.userId,
                hands: [
                    {
                        cards: infoPlayer.cards, // Vector que contiene las cartas de la jugada
                        total: infoPlayer.totalCards, // Suma de la puntuación de las cartas
                        defeat: false, // Si defeat = true, el jugador ha perdido esta mano
                        blackJack: infoPlayer.blackJack, // blackJack = true cuando se tienen 21 puntos
                        active: true, // TODO: 
                        stick: false   // Indica si se ha plantado o no el jugador con stick
                    },{
                        cards: [], // Vector que contiene las cartas de la jugada
                        total: 0, // Suma de la puntuación de las cartas
                        defeat: false, // Si defeat = true, el jugador ha perdido esta mano
                        blackJack: false, // blackJack = true cuando se tienen 21 puntos
                        active: false, // TODO: 
                        stick: false   // Indica si se ha plantado o no el jugador con stick
                    }
                ]
            }
            setPlayer(playerObj)

            // Asignar resto de jugadores
            const restPlayersArray = []
            // Recorrer initBoards menos última componente que es la Banca
            // let indexPlayers = 1
            for (let i = 0; i < initCards.length - 1; i++) {
                // Si no es el usuario
                if (initCards[i].userId !== user._id) {
                    const otherPlayerObj = {
                        playerId: initCards[i].userId,
                        hands: [
                            {
                                cards: initCards[i].cards, // Vector que contiene las cartas de la jugada
                                total: initCards[i].totalCards, // Suma de la puntuación de las cartas
                                defeat: false, // Si defeat = true, el jugador ha perdido esta mano
                                blackJack: initCards[i].blackJack, // blackJack = true cuando se tienen 21 puntos
                                active: true, // TODO: 
                                stick: false   // Indica si se ha plantado o no el jugador con stick
                            },{
                                cards: [], // Vector que contiene las cartas de la jugada
                                total: 0, // Suma de la puntuación de las cartas
                                defeat: false, // Si defeat = true, el jugador ha perdido esta mano
                                blackJack: false, // blackJack = true cuando se tienen 21 puntos
                                active: false, // TODO: 
                                stick: false   // Indica si se ha plantado o no el jugador con stick 
                            }
                        ]
                    }
                    restPlayersArray.push(otherPlayerObj)
                }
            }
            setRestPlayers(restPlayersArray)
        })
    }, [tituloVisible, user, bank]) // Se ejecuta solo una vez cuando el componente se monta

    // Imprimir información de los jugadores
    const imprimir = () => {
        console.log('Bank: ', bank)
        console.log('Player: ', player)
        console.log('Rest Players: ', restPlayers)
    }

    return (
        <div>
            <div>
                { tituloVisible ? (
                    <p style={{color: 'black'}}> BlackJack </p>
                ) : (
                    <p>  </p>
                )}
            </div>

            <button type="submit" className="matchPublic" onClick={partidaPublica}>
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
                                <img key={cardIndex} src={constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png"}/>    
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
                    <div key={numHand + "-" + indexUser} style={{ backgroundColor: 'brown' }}>
                        { player && player.hands[numHand].active && (
                            <div>
                                <p>Mano {numHand} / Total: {player.hands[numHand].total}</p>
                                {!player.hands[numHand].defeat && 
                                 !player.hands[numHand].blackJack &&
                                 !player.hands[numHand].stick ? (
                                    <div>
                                        <button onClick={(e) => drawCard(e, numHand, player, setPlayer)}>DrawCard</button>
                                        <button onClick={(e) => split(e, player, setPlayer)}>Split</button>
                                        <button onClick={(e) => double(e, numHand, player, setPlayer)}>Double</button>
                                        <button onClick={(e) => stick(e, numHand, player)}>Stick</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p>No puede realizar más jugadas. Se ha plantado.</p>
                                    </div>
                                )}
                                {/* Renderizar las cartas */}
                                {player.hands[numHand].cards.map((card, cardIndex) => (
                                    <img key={cardIndex} src={constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png"}/>
                                ))}
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
                                    <div key={numHand + "-" + index} style={{ backgroundColor: 'green' }}>
                                        {/* Renderizar las cartas */}
                                        {restPlayers[index].hands[numHand].cards.map((card, cardIndex) => (
                                            <img key={cardIndex} src={constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png"}/> 
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

        </div>
    )
}

export default PruebaPublicBoard