// Imports
import axios from "../../api/axios"


export const numPlayers = 2  // Esta información hay que obtenerla cuando se presiona en unir partida
export const hand0 = 0      // Primera mano
export const hand1 = 1     // Segunda mano

// export function sleep(ms) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms)
//     })
// }

// numHand: 0 si es la primera mano / 1 si es la segunda mano
export const drawCard = async (event, numHand, player, setPlayer, boardId) => {
    event.preventDefault()
    try {
        const response = await axios.put('/publicBoard/drawCard', {
            boardId: boardId,
            cardsOnTable: player.hands[numHand].cards,
            handIndex: numHand
        })
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }

        // console.log('DrawCard: ', response.data);
        let updatedPlayer = {...player}
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


export const double = async (event, numHand, player, setPlayer, boardId) => {
    event.preventDefault()
    try {
        const response = await axios.put('/publicBoard/double', {
            boardId: boardId,
            cardsOnTable: player.hands[numHand].cards,
            handIndex: numHand
        })
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }
        // console.log('Avatares:', response);
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

export const stick = async (event, numHand, player, setPlayer, boardId) => {
    event.preventDefault()
    try {
        const response = await axios.put('/publicBoard/stick', {
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

export const split = async (event, player, setPlayer, boardId) => {
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
        let updatedPlayer = {...player}

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

export const getPartidasPublicas = async (setPartidasPublicas) => {
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

// Obtener las cartas al principio de cada play hand
export const getInitCards = (userId, initCards, setBank, player, setPlayer, restPlayers, setRestPlayers) => {
    // Guardar banca
    const bankIndex = initCards.findIndex(init => init.userId == 'Bank')
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
            coinsEarned: 0
        }
    }
    setBank(bankObj)
                
    // Guardar primeras dos cartas usuario
    let updatedPlayer = {...player}
    const infoPlayer = initCards.find(infPlayer => infPlayer.userId === userId);

    updatedPlayer = storeInitCardsPlayer(updatedPlayer, infoPlayer)
    setPlayer(updatedPlayer)

    // Asignar resto de jugadores
    let restPlayersArray = [...restPlayers]
    // Recorrer initBoards
    for (let i = 0; i < initCards.length; i++) {
        // Si no es el usuario ni la banca
        if (initCards[i].userId !== userId && initCards[i].userId !== 'Bank') {

            // Obtener el indice del player correcto
            const index = initCards.findIndex(infPlayer => infPlayer.userId === restPlayersArray[i].playerId);
            if (index !== -1) {
                restPlayersArray[i] = storeInitCardsPlayer(restPlayersArray[i], initCards[index])
            }
        }
    }
    setRestPlayers(restPlayersArray)
}

// Obtener la información de los resultados
export const getResults = (userId, results, bank, setBank, 
                           player, setPlayer, restPlayers, setRestPlayers) => {
    // Guardar banca
    // Información de la banca
    const bankIndex = results.findIndex(res => res.userId = 'Bank')
    const updatedBank = {...bank}
    updatedBank.hand.cards = results[bankIndex].cards
    updatedBank.hand.total = results[bankIndex].total
    updatedBank.hand.active = true
    updatedBank.hand.show = true
    setBank(updatedBank)
    
    // Guardar resultados usuario
    let updatedPlayer = {...player}
    const infoPlayer = results.find(infoPlayer => infoPlayer.userId === userId);

    updatedPlayer = storeResultPlayer(updatedPlayer, infoPlayer)
    setPlayer(updatedPlayer)

    // Asignar resto de jugadores
    let restPlayersArray = [...restPlayers]
    // Recorrer initBoards
    for (let i = 0; i < results.length; i++) {
        // Si no es el usuario ni la banca
        if (results[i].userId !== userId && results[i].userId !== 'Bank') {
            const index = results.findIndex(res => res.userId === restPlayersArray[i].playerId);
            if (index !== -1) {
                restPlayersArray[i] = storeResultPlayer(restPlayersArray[i], results[index])
            }
        }
    }
    setRestPlayers(restPlayersArray)
}
           

export const initPlayers = (players, userId, setPlayer, setRestPlayers) => {
    
    // Inicializar el jugador
    const objPlayer = {
        playerId: userId,
        hands: [
            {   cards: [], 
                total: 0, 
                defeat: false, 
                blackJack: false, 
                active: false, 
                stick: false,   
                show: false, 
                coinsEarned: 0   
            }, 
            {   cards: [], 
                total: 0, 
                defeat: false, 
                blackJack: false, 
                active: false, 
                stick: false,   
                show: false, 
                coinsEarned: 0   
            }]
    }
    setPlayer(objPlayer)

    // Inicializar el resto de jugadores
    const restPlayersArray = []
    for (const player of players) {
        const hand = {
            cards: [], 
            total: 0, 
            defeat: false, 
            blackJack: false, 
            active: false, 
            stick: false,   
            show: false, 
            coinsEarned: 0  
        }
        // Información de un jugador
        const objPlayer = {
            playerId: player.player,
            hands: [{ ...hand }, { ...hand }]
        }
        restPlayersArray.push(objPlayer)
    }
    setRestPlayers(restPlayersArray)
}

const storeResultPlayer = (updatedPlayer, infoPlayer) => {
    updatedPlayer.hands[hand0].active = true
    updatedPlayer.hands[hand0].show = true

    // Si ha confirmado la jugada
    if(updatedPlayer.hands[hand0].stick) {
        updatedPlayer.hands[hand0].cards = infoPlayer.cards[hand0]
        updatedPlayer.hands[hand0].total = infoPlayer.total[hand0]
        updatedPlayer.hands[hand0].coinsEarned = infoPlayer.coinsEarned[hand0]

        // Si no ha confirmado la jugada
    } else {
        updatedPlayer.hands[hand0].coinsEarned = 0
    }

    // Si tiene dos manos
    if (updatedPlayer.hands[hand1].active) {
        updatedPlayer.hands[hand1].show = true

        // Si ha confirmado la jugada
        if(updatedPlayer.hands[hand1].stick) {
            updatedPlayer.hands[hand1].cards = infoPlayer.cards[hand1]
            updatedPlayer.hands[hand1].total = infoPlayer.total[hand1]
            updatedPlayer.hands[hand1].coinsEarned = infoPlayer.coinsEarned[hand1]

            // Si no ha confirmado la jugada
        } else {
            updatedPlayer.hands[hand1].coinsEarned = 0
        }
    }
    return updatedPlayer
}

const storeInitCardsPlayer = (updatedPlayer, infoPlayer) => {
    // Primera mano
    updatedPlayer.hands[hand0].cards = infoPlayer.cards
    updatedPlayer.hands[hand0].total = infoPlayer.totalCards
    updatedPlayer.hands[hand0].defeat= false
    updatedPlayer.hands[hand0].blackJack= infoPlayer.blackJack
    updatedPlayer.hands[hand0].active= true
    updatedPlayer.hands[hand0].stick = false
    updatedPlayer.hands[hand0].show = true
    updatedPlayer.hands[hand0].coinsEarned = 0

    // Segunda mano
    updatedPlayer.hands[hand1].cards = []
    updatedPlayer.hands[hand1].total = 0
    updatedPlayer.hands[hand1].defeat = false
    updatedPlayer.hands[hand1].blackJack = false
    updatedPlayer.hands[hand1].active = false
    updatedPlayer.hands[hand1].stick = false 
    updatedPlayer.hands[hand1].show = true
    updatedPlayer.hands[hand1].coinsEarned = 0

    return updatedPlayer
}