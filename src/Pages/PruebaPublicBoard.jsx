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
        active: false // TODO: 
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
    const [players, setPlayers] = useState([]);   
    const [bank, setBank] = useState(objBank)   // Información de la banca

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
    const drawCard = async (event, numHand, players, setPlayers) => {
        event.preventDefault()
        try {
            const response = await axios.put('/publicBoard/drawCard', {
                boardId: boardId,
                cardsOnTable: players[indexUser].hands[numHand].cards
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }

            // console.log('DrawCard: ', response.data);
            const updatedPlayers = [...players]
            updatedPlayers[indexUser].hands[numHand].cards = response.data.cardsOnTable
            updatedPlayers[indexUser].hands[numHand].total = response.data.totalCards
            updatedPlayers[indexUser].hands[numHand].defeat = response.data.defeat
            updatedPlayers[indexUser].hands[numHand].blackJack = response.data.blackJack    
            updatedPlayers[indexUser].hands[numHand].active = true
            setPlayers(updatedPlayers)

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const split = async (event, players, setPlayers) => {
        event.preventDefault()
        try {
            const response = await axios.put('/publicBoard/split', {
                boardId: boardId,
                cardsOnTable: players[indexUser].hands[hand0].cards
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            // console.log('Avatares:', response);
            const updatedPlayers = [...players]

            updatedPlayers[indexUser].hands[hand0].cards = response.data.cardsOnTableFirst
            updatedPlayers[indexUser].hands[hand0].total = response.data.totalCardsFirst
            updatedPlayers[indexUser].hands[hand0].defeat = response.data.defeatFirst
            updatedPlayers[indexUser].hands[hand0].blackJack = response.data.blackJackFirst  
            updatedPlayers[indexUser].hands[hand0].active = true

            updatedPlayers[indexUser].hands[hand1].cards = response.data.cardsOnTableSecond
            updatedPlayers[indexUser].hands[hand1].total = response.data.totalCardsSecond
            updatedPlayers[indexUser].hands[hand1].defeat = response.data.defeatSecond
            updatedPlayers[indexUser].hands[hand1].blackJack = response.data.blackJackSecond  
            updatedPlayers[indexUser].hands[hand1].active = true

            setPlayers(updatedPlayers)

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const double = async (event, numHand, players, setPlayers) => {
        event.preventDefault()
        try {
            const response = await axios.put('/publicBoard/double', {
                boardId: boardId,
                cardsOnTable: players[0].hand[numHand].cards
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            // console.log('Avatares:', response);
            const updatedPlayers = [...players]
            updatedPlayers[indexUser].hands[numHand].cards = response.data.cardsOnTable
            updatedPlayers[indexUser].hands[numHand].total = response.data.totalCards
            updatedPlayers[indexUser].hands[numHand].defeat = response.data.defeat
            updatedPlayers[indexUser].hands[numHand].blackJack = response.data.blackJack    
            updatedPlayers[indexUser].hands[numHand].active = true
            setPlayers(updatedPlayers)
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const stick = async (event, numHand, players) => {
        event.preventDefault()
        try {
            const response = await axios.put('/publicBoard/stick', {
                boardId: boardId,
                cardsOnTable: players[indexUser].hands[numHand].cards
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            console.log('RESULTADO GUARDADO CORRECTAMENTE');
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        const newPlayers = []
        for (let i = 0; i < numPlayers; i++) {
            const playerCopy = {...objPlayer}
            newPlayers.push(playerCopy)
        }
        setPlayers(newPlayers)
        console.log("newPlayers", newPlayers)
    }, [])

    useEffect(() => {
        getPartidasPublicas()
    })

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
            const updatedBank = {...bank}
            updatedBank.hand.cards = initCards[initCards.length - 1].cards
            updatedBank.hand.total = initCards[initCards.length - 1].totalCards
            updatedBank.hand.blackJack = initCards[initCards.length - 1].blackJack
            updatedBank.hand.active = true
            setBank(updatedBank)
            
            // const updatedPlayers = [...players]
            const updatedPlayers = []
            
            console.log("Inicial:", updatedPlayers)////////////////////////////////////////////////////////////////
            
            // Guardar primeras dos cartas usuario
            const infoPlayer = initCards.find(infoPlayer => infoPlayer.userId === user._id);
            let playerObj
            playerObj.playerId = infoPlayer.userId
            playerObj.hands[hand0].cards = infoPlayer.cards
            playerObj.hands[hand0].total = infoPlayer.totalCards
            playerObj.hands[hand0].blackJack = infoPlayer.blackJack
            updatedPlayers.push(playerObj)


            console.log("Antes asignar:", updatedPlayers)////////////////////////////////////////////////////////////////

            // Asignar resto de jugadores
            // Recorrer initBoards menos última componente que es la Banca
            // let indexPlayers = 1
            for (let i = 0; i < initCards.length - 1; i++) {
                // Si no es el usuario
                if (initCards[i].userId !== user._id) {
                    let otherPlayerObj
                    otherPlayerObj.playerId = initCards[i].userId
                    otherPlayerObj.hands[hand0].cards = initCards[i].cards
                    otherPlayerObj.hands[hand0].total = initCards[i].totalCards
                    otherPlayerObj.hands[hand0].blackJack = initCards[i].blackJack
                    otherPlayerObj.hands[hand0].active = true
                    updatedPlayers.push(otherPlayerObj)
                    // indexPlayers = indexPlayers + 1
                }
            }

            console.log("Después asignar:", updatedPlayers)////////////////////////////////////////////////////////////////

            setPlayers(updatedPlayers)
        })
    }, [tituloVisible, user, bank, players]) // Se ejecuta solo una vez cuando el componente se monta

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
                        <div>
                            {/* Renderizar las cartas */}
                            {bank.hand.cards.map((card, cardIndex) => (
                                <p key={cardIndex}>{card.value + '-' + card.suit}</p>    // Cambiar por imagen
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
                        { players[indexUser] && players[indexUser].hands[numHand].active && (
                            <div>
                                <p>Mano {numHand}</p>
                                {!players[indexUser].hands[numHand].defeat && 
                                 !players[indexUser].hands[numHand].blackJack && (
                                    <div>
                                        <button onClick={(e) => drawCard(e, numHand, players, setPlayers)}>DrawCard</button>
                                        <button onClick={(e) => split(e, players, setPlayers)}>Split</button>
                                        <button onClick={(e) => double(e, numHand, players, setPlayers)}>Double</button>
                                        <button onClick={(e) => stick(e, numHand, players)}>Stick</button>
                                    </div>
                                )}
                                {/* Renderizar las cartas */}
                                {players[indexUser].hands[numHand].cards.map((card, cardIndex) => (
                                    <p key={cardIndex}>{card.value + '-' + card.suit}</p>    // Cambiar por imagen
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
                {(() => {
                    const jsxArray = [];
                    // for (let index = indexUser + 1; index < numPlayers; index++) {
                    for (let index = indexUser + 1; index < players.length; index++) {
                        const playerHands = [];
                        [hand0, hand1].forEach(numHand => {
                            if ( players[index] && players[index].hands[numHand].active) {
                                const handJSX = (
                                    <div key={numHand + "-" + index} style={{ backgroundColor: 'green' }}>
                                        {/* Renderizar las cartas */}
                                        {players[index].hands[numHand].cards.map((card, cardIndex) => (
                                            <p key={cardIndex}>{card.value + '-' + card.suit}</p> // Cambiar por imagen
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
        </div>
    )
}

export default PruebaPublicBoard