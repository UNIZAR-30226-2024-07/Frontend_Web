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
        const updatedPlayer = {...player}
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
export const getInitCards = (userId, initCards, setBank, setPlayer, setRestPlayers) => {
    // Guardar banca
    // Información de la banca en el último componente initCards
    const bankObj = {
        playerId: 'Bank',
        hand: {
                cards: initCards[initCards.length - 1].cards, 
                total: initCards[initCards.length - 1].totalCards,
                defeat: false, 
                blackJack: initCards[initCards.length - 1].blackJack, 
                active: true, 
                stick: false,   
                show: true,
                coinsEarned: 0
            }
    }
    setBank(bankObj)
                
    // Guardar primeras dos cartas usuario
    const infoPlayer = initCards.find(infPlayer => infPlayer.userId === userId);
    // Información de un jugador
    const playerObj = {
        playerId: infoPlayer.userId,
        hands: [
            {
                cards: infoPlayer.cards, 
                total: infoPlayer.totalCards, 
                defeat: false, 
                blackJack: infoPlayer.blackJack, 
                active: true, 
                stick: false,  
                show: true,
                coinsEarned: 0
            },{
                cards: [], 
                total: 0, 
                defeat: false, 
                blackJack: false, 
                active: false,
                stick: false,  
                show: true,
                coinsEarned: 0
            }
        ]
    }
    setPlayer(playerObj)

    // Asignar resto de jugadores
    const restPlayersArray = []
    // Recorrer initBoards menos última componente que es la Banca
    for (let i = 0; i < initCards.length - 1; i++) {
        // Si no es el usuario
        if (initCards[i].userId !== userId) {
            const otherPlayerObj = {
                playerId: initCards[i].userId,
                hands: [
                    {
                        cards: initCards[i].cards, 
                        total: initCards[i].totalCards, 
                        defeat: false, 
                        blackJack: initCards[i].blackJack, 
                        active: true,
                        stick: false,  
                        show: false,
                        coinsEarned: 0
                    },{
                        cards: [], 
                        total: 0, 
                        defeat: false, 
                        blackJack: false,
                        active: false,
                        stick: false,
                        show: false,
                        coinsEarned: 0
                    }
                ]
            }
            restPlayersArray.push(otherPlayerObj)
        }
    }
    setRestPlayers(restPlayersArray)
}

// Obtener la información de los resultados
export const getResults = (userId, results, bank, setBank, 
                           player, setPlayer, restPlayers, setRestPlayers) => {
    // Guardar banca
    // Información de la banca en el último componente results
    const updatedBank = {...bank}
    updatedBank.hand.cards = results[results.length - 1].cards
    updatedBank.hand.total = results[results.length - 1].total
    updatedBank.hand.active = true
    updatedBank.hand.show = true
    setBank(updatedBank)
    
    // Guardar resultados usuario
    const updatedPlayer = {...player}
    const infoPlayer = results.find(infoPlayer => infoPlayer.userId === userId);

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
    if (updatedPlayer.hands.length === 2) {
        updatedPlayer.hands[hand1].active = true
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
    setPlayer(updatedPlayer)

    // Asignar resto de jugadores
    const restPlayersArray = []
    // Recorrer initBoards menos última componente que es la Banca
    for (let i = 0; i < results.length - 1; i++) {
        // Si no es el usuario
        if (results[i].userId !== userId) {
            let cards1
            let cards2
            let total1
            let total2
            let coinsEarned1
            let coinsEarned2
            let active2 = false
            let show2 = false
            const infoPlayer = results.find(infoPlayer => infoPlayer.userId === results[i].userId);
            // Si ha confirmado la jugada
            if(restPlayers[i].hands[hand0].stick) {
                cards1 = infoPlayer.cards[hand0]
                total1 = infoPlayer.total[hand0]
                coinsEarned1 = infoPlayer.coinsEarned[hand0]

                // Si no ha confirmado la jugada
            } else {
                cards1 = restPlayers[i].cards[hand0]
                total1 = restPlayers[i].total[hand0]
                coinsEarned1 = 0
            }

            // Si tiene dos manos
            if (restPlayers[i].hands.length === 2) {
                active2 = true
                show2 = true
                // Si ha confirmado la jugada
                if(restPlayers[i].hands[hand1].stick) {
                    cards2 = infoPlayer.cards[hand1]
                    total2 = infoPlayer.total[hand1]
                    coinsEarned2 = infoPlayer.coinsEarned[hand1]

                    // Si no ha confirmado la jugada
                } else {
                    cards2 = restPlayers[i].cards[hand1]
                    total2 = restPlayers[i].total[hand1]
                    coinsEarned2 = 0
                }
            } 
            const otherPlayerObj = {
                playerId: results[i].userId,
                hands: [
                    {
                        cards: cards1, 
                        total: total1, 
                        defeat: false, // No haría falta
                        blackJack: false,  // No haría falta
                        active: true,
                        stick: false,  // No haría falta
                        show: true,
                        coinsEarned: coinsEarned1
                    },{
                        cards: cards2,
                        total: total2,
                        defeat: false, // No haría falta
                        blackJack: false,  // No haría falta
                        active: active2,
                        stick: false,  // No haría falta
                        show: show2,
                        coinsEarned: coinsEarned2 
                    }
                ]
            }
            restPlayersArray.push(otherPlayerObj)
        }
    }
    setRestPlayers(restPlayersArray)
}