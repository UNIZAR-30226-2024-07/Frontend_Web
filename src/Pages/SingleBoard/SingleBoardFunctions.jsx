// Imports
import axios from "../../api/axios"
import constants from "../../constants"

export const hand0 = 0      // Primera mano
export const hand1 = 1     // Segunda mano

/********************* Funciones logica juego **********************************/

// Obtiene una carta de la baraja en la mano numHand
// numHand: 0 si es la primera mano / 1 si es la segunda mano
export const drawCard = async (event, numHand, player, setPlayer, boardId) => {
    event.preventDefault()
    try {
        const response = await axios.put('/singleBoard/drawCard', {
            boardId: boardId,
            cardsOnTable: player.hands[numHand].cards,
            handIndex: numHand
        })
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }

        let updatedPlayer = {...player}
        updatedPlayer.hands[numHand].cards = response.data.cardsOnTable
        updatedPlayer.hands[numHand].total = response.data.totalCards
        updatedPlayer.hands[numHand].defeat = response.data.defeat
        updatedPlayer.hands[numHand].blackJack = response.data.blackJack    
        updatedPlayer.hands[numHand].active = true

        // Si se ha confirmado jugada, marcar stick
        if (updatedPlayer.hands[numHand].defeat || updatedPlayer.hands[numHand].blackJack) {
            updatedPlayer.hands[numHand].stick = true
        }
        setPlayer(updatedPlayer)

    } catch (error) {
        console.error("Error:", error);
    }
}

// Hace un double en la mano numHand: pide carta y se planta
// numHand: 0 si es la primera mano / 1 si es la segunda mano
export const double = async (event, numHand, player, setPlayer, boardId) => {
    event.preventDefault()
    try {
        const response = await axios.put('/singleBoard/double', {
            boardId: boardId,
            cardsOnTable: player.hands[numHand].cards,
            handIndex: numHand
        })
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }
        let updatedPlayer = {...player}
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

// Hace un stick en la mano numHand: plantarse
// numHand: 0 si es la primera mano / 1 si es la segunda mano
export const stick = async (event, numHand, player, setPlayer, boardId) => {
    event.preventDefault()
    try {
        const response = await axios.put('/singleBoard/stick', {
            boardId: boardId,
            cardsOnTable: player.hands[numHand].cards,
            handIndex: numHand
        })
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }
        console.log('RESULTADO GUARDADO CORRECTAMENTE');
        let updatedPlayer = {...player}
        updatedPlayer.hands[numHand].stick = true
        setPlayer(updatedPlayer)
    } catch (error) {
        console.error("Error:", error);
    }
}

// Hace un split: ahora tendrá dos manos
export const split = async (event, player, setPlayer, boardId) => {
    event.preventDefault()
    try {
        const response = await axios.put('/singleBoard/split', {
            boardId: boardId,
            cardsOnTable: player.hands[hand0].cards
        })
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }
        let updatedPlayer = {...player}

        updatedPlayer.hands[hand0].cards = response.data.cardsOnTableFirst
        updatedPlayer.hands[hand0].total = response.data.totalCardsFirst
        updatedPlayer.hands[hand0].defeat = response.data.defeatFirst
        updatedPlayer.hands[hand0].blackJack = response.data.blackJackFirst  
        updatedPlayer.hands[hand0].active = true
        // Si se ha confirmado jugada, marcar stick
        if (updatedPlayer.hands[hand0].defeat || updatedPlayer.hands[hand0].blackJack) {
            updatedPlayer.hands[hand0].stick = true
        }

        updatedPlayer.hands[hand1].cards = response.data.cardsOnTableSecond
        updatedPlayer.hands[hand1].total = response.data.totalCardsSecond
        updatedPlayer.hands[hand1].defeat = response.data.defeatSecond
        updatedPlayer.hands[hand1].blackJack = response.data.blackJackSecond  
        updatedPlayer.hands[hand1].active = true
        // Si se ha confirmado jugada, marcar stick
        if (updatedPlayer.hands[hand1].defeat || updatedPlayer.hands[hand1].blackJack) {
            updatedPlayer.hands[hand1].stick = true
        }

        setPlayer(updatedPlayer)

    } catch (error) {
        console.error("Error:", error);
    }
}

// export const getPartidaPausada = async (setPartidaPausada) => {
//     try {
//         const response = await axios.get('/user/getPausedBoard')
//         if (response.status !== 200) {
//             console.log("Fallo: ", response);
//             throw new Error('Error', response);
//         } else {
//             if (response.data.exists) {
//                 setPartidaPausada({id: response.data.pausedBoard, 
//                                    boardType: response.data.boardType})
//             }
//         }
//     } catch (e) {
//         console.error("Error:", e)
//     }
// }

export const leave = async(event, boardId, navigate) => {
    event.preventDefault()
    try {
        const response = await axios.put('/singleBoard/leaveBoard/' + boardId)
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        } else {
            navigate(constants.root + 'PageDashboard')
        }
    } catch (e) {
        console.error("Error:", e)
    }
}

// export const pause = async (event, boardId, navigate) => {
//     event.preventDefault()
//     try {
//         const response = await axios.put('/publicBoard/pause/' + boardId)
//         if (response.status !== 200) {
//             console.log("Fallo: ", response);
//             throw new Error('Error', response);
//         } else {
//             navigate(constants.root + 'PageDashboard')
//         }
//     } catch (e) {
//         console.error("Error:", e)
//     }
// }

/********************** Funciones tratar useState ******************************/

// // Obtener todas las partidas públicas que hay
// export const getPartidasPublicas = async (setPartidasPublicas) => {
//     try {
//         const response = await axios.get('/publicBoardType/getAll')
//         if (response.status !== 200) {
//             return console.error(response.data)
//         }

//         setPartidasPublicas(response.data.publicBoardTypes)
//     } catch (e) {
//         console.error("Error al pedir las partidas. " + e.message)
//     }
// }

// // Inicializar los useState players y restPlayers
// // Se inicializan los campos por defecto y con el userId de los jugadores
// // Solo se hace una vez: al principio de la partida o cuando se reanuda
// export const initPlayers = (players, userId, setPlayer, restPlayers) => {
//     // Inicializar el resto de jugadores
//     for (const player of players) {
//         const hand = {
//             cards: [], 
//             total: 0, 
//             defeat: false, 
//             blackJack: false, 
//             active: false, 
//             stick: false,   
//             show: false, 
//             coinsEarned: 0  
//         }
//         // Información de un jugador
//         const objPlayer = {
//             playerId: player.player,
//             playing: true,
//             hands: [{ ...hand }, { ...hand }]
//         }
//         restPlayers.push(objPlayer)
//     }    
//     // Inicializar el jugador
//     const objPlayer = {
//         playerId: userId,
//         playing: true,
//         hands: [
//             {   cards: [], 
//                 total: 0, 
//                 defeat: false, 
//                 blackJack: false, 
//                 active: false, 
//                 stick: false,   
//                 show: false, 
//                 coinsEarned: 0   
//             }, 
//             {   cards: [], 
//                 total: 0, 
//                 defeat: false, 
//                 blackJack: false, 
//                 active: false, 
//                 stick: false,   
//                 show: false, 
//                 coinsEarned: 0   
//             }]
//     }
//     setPlayer(objPlayer)
// }

// Obtener las cartas al principio de cada play hand
// Banca obtiene una carta
// Cada jugador obtiene dos cartas
export const getInitCards = (userId, initCards, setBank, player, setPlayer) => {
    // Guardar banca
    const bankIndex = initCards.findIndex(init => init.userId === 'Bank')
    const bankObj = {
        playerId: 'Bank',
        hand: {
            cards: initCards[bankIndex].cards, 
            total: initCards[bankIndex].totalCards,
            defeat: false, 
            blackJack: initCards[bankIndex].blackJack, 
            active: true, 
            stick: false,   
            show: true,
        }
    }
    setBank(bankObj)
    
    // Guardar primeras dos cartas usuario
    let updatedPlayer = {...player}
    const infoPlayer = initCards.find(infPlayer => infPlayer.userId === userId);
    
    // storeInitCardsPlayer(true = es el jugador)
    updatedPlayer = storeInitCardsPlayer(true, updatedPlayer, infoPlayer)
    setPlayer(updatedPlayer)
}

// Obtener la información de los resultados
// Actualizar la información del jugador solo si se ha confirmado dicha mano
//      - Si es el jugador: actualizar player si stick = true en dicha mano
//      - Si es otro jugador: actualizar restPlayers[] si hay cartas en el results
export const getResults = (userId, results, bank, setBank, player, setPlayer) => {
    // Guardar banca
    // Información de la banca
    const bankIndex = results.findIndex(res => res.userId === 'Bank')
    const updatedBank = {...bank}
    updatedBank.hand.cards = results[bankIndex].cards
    updatedBank.hand.total = results[bankIndex].total
    updatedBank.hand.active = true
    updatedBank.hand.show = true
    setBank(updatedBank)

    console.log("Results: ", results)
    
    // Guardar resultados usuario
    let updatedPlayer = {...player}
    const infoPlayer = results.find(infoPlayer => infoPlayer.userId === userId);

    // storeResultPlayer (true = es el jugador)
    updatedPlayer = storeResultPlayer(true, updatedPlayer, infoPlayer)
    setPlayer(updatedPlayer)
}

// // Marca como eliminados los restPlayers (saldrán con un fondo gris)
// export const eliminatePlayers = (playersToDelete, restPlayers) => {
//     for (const playerToDelete of playersToDelete) {
//         const index = restPlayers.findIndex(player => player.playerId == playerToDelete)
//         if (index !== -1) {
//             restPlayers[index].playing = false
//         }
//     }
// }


/************************ Funciones *****************************************************/
const storeResultPlayer = (isPlayer, updatedPlayer, infoPlayer) => {

    // Mostrar primera mano si o si
    updatedPlayer.hands[hand0].active = true
    updatedPlayer.hands[hand0].show = true
    updatedPlayer.hands[hand0].cards = infoPlayer.cards[hand0]
    updatedPlayer.hands[hand0].total = infoPlayer.total[hand0]

    // Si tiene dos manos
    if (updatedPlayer.hands[hand1].active) {

        // Mostrar mano
        updatedPlayer.hands[hand1].show = true

        // Si ha confirmado la jugada
        if(updatedPlayer.hands[hand1].stick) {
            updatedPlayer.hands[hand1].cards = infoPlayer.cards[hand1]
            updatedPlayer.hands[hand1].total = infoPlayer.total[hand1]
        }
    }

    return updatedPlayer
}

const storeInitCardsPlayer = (isPlayer, updatedPlayer, infoPlayer) => {
    // Primera mano
    updatedPlayer.hands[hand0].cards = infoPlayer.cards
    updatedPlayer.hands[hand0].total = infoPlayer.totalCards
    updatedPlayer.hands[hand0].defeat= false
    updatedPlayer.hands[hand0].blackJack= infoPlayer.blackJack
    updatedPlayer.hands[hand0].active= true
    updatedPlayer.hands[hand0].stick = false
    updatedPlayer.hands[hand0].show = isPlayer

    // Segunda mano
    updatedPlayer.hands[hand1].cards = []
    updatedPlayer.hands[hand1].total = 0
    updatedPlayer.hands[hand1].defeat = false
    updatedPlayer.hands[hand1].blackJack = false
    updatedPlayer.hands[hand1].active = false
    updatedPlayer.hands[hand1].stick = false 
    updatedPlayer.hands[hand1].show = isPlayer

    return updatedPlayer
}

