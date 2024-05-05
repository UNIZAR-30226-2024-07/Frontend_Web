// Imports
import axios from "../../api/axios"
import constants from "../../constants"

export const startLives = 4
export const timeOut = 30  // Tiempo cada play hand

/********************* Funciones logica juego **********************************/

// Obtiene una carta de la baraja
export const drawCard = async (event, player, setPlayer, boardId) => {
    event.preventDefault()
    try {
        const response = await axios.put('/tournamentBoard/drawCard', {
            boardId: boardId,
            cardsOnTable: player.hand.cards,
            handIndex: 0
        })
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }

        let updatedPlayer = {...player}
        updatedPlayer.hand.cards = response.data.cardsOnTable
        updatedPlayer.hand.total = response.data.totalCards
        updatedPlayer.hand.defeat = response.data.defeat
        updatedPlayer.hand.blackJack = response.data.blackJack    
        updatedPlayer.hand.active = true

        // Si se ha confirmado jugada, marcar stick
        if (updatedPlayer.hand.defeat || updatedPlayer.hand.blackJack) {
            updatedPlayer.hand.stick = true
        }
        setPlayer(updatedPlayer)

    } catch (error) {
        console.error("Error:", error);
    }
}

// Hace un stick
export const stick = async (event, player, setPlayer, boardId) => {
    event.preventDefault()
    try {
        const response = await axios.put('/tournamentBoard/stick', {
            boardId: boardId,
            cardsOnTable: player.hand.cards,
            handIndex: 0
        })
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        }
        let updatedPlayer = {...player}
        updatedPlayer.hand.stick = true
        setPlayer(updatedPlayer)
    } catch (error) {
        console.error("Error:", error);
    }
}

export const getPartidaPausada = async (setPartidaPausada) => {
    try {
        const response = await axios.get('/user/getPausedBoard')
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        } else {
            if (response.data.exists) {
                setPartidaPausada({id: response.data.pausedBoard, 
                                   boardType: response.data.boardType})
            }
        }
    } catch (e) {
        console.error("Error:", e)
    }
}

export const leave = async(event, boardId, navigate) => {
    event.preventDefault()
    try {
        if (boardId !== "") {
            const response = await axios.put('/tournamentBoard/leaveBoard/' + boardId)
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            } else {
                navigate(constants.root + 'PageDashboard')
            }
        }
    } catch (e) {
        console.error("Error:", e)
    }
}

export const pause = async (event, boardId, navigate) => {
    event.preventDefault()
    try {
        const response = await axios.put('/tournamentBoard/pause/' + boardId)
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

/********************** Funciones tratar useState ******************************/



/////////////////////////////////////////////////////////////////////////////
// Obtener todas las partidas públicas que hay
export const getTorneos = async (setTorneos) => {
    try {
        const response = await axios.get('/tournament/getAll')
        if (response.status !== 200) {
            return console.error(response.data)
        }

        setTorneos(response.data.tournaments)
    } catch (e) {
        console.error("Error al pedir las partidas. " + e.message)
    }
}
/////////////////////////////////////////////////////////////////////////////////

// Inicializar los useState players y restPlayers
// Se inicializan los campos por defecto y con el userId de los jugadores
// Solo se hace una vez: al principio de la partida o cuando se reanuda
export const initPlayers = (players, userId, setPlayer, restPlayers) => {
    // Inicializar el resto de jugadores
    for (const player of players) {
        const hand = {
            cards: [], 
            total: 0, 
            defeat: false, 
            blackJack: false, 
            active: false, 
            stick: false,   
            show: false
        }
        // Información de un jugador
        const objPlayer = {
            playerId: player.player,
            playing: true,
            lives: startLives,
            hand: {...hand}
        }
        restPlayers.push(objPlayer)
    }    
    // Inicializar el jugador
    const objPlayer = {
        playerId: userId,
        playing: true,
        lives: startLives,
        hand: {
            cards: [], 
            total: 0, 
            defeat: false, 
            blackJack: false, 
            active: false, 
            stick: false,   
            show: false, 
        }
    }
    setPlayer(objPlayer)
}

// Obtener las cartas al principio de cada play hand
// Banca obtiene una carta
// Cada jugador obtiene dos cartas
export const getInitCards = (userId, initCards, setBank, player, setPlayer, 
                                                restPlayers, setRestPlayers) => {
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
            show: true
        }
    }
    setBank(bankObj)
    
    // Guardar primeras dos cartas usuario
    let updatedPlayer = {...player}
    const infoPlayer = initCards.find(infPlayer => infPlayer.userId === userId);
    
    // storeInitCardsPlayer(true = es el jugador)
    updatedPlayer = storeInitCardsPlayer(true, updatedPlayer, infoPlayer)
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
                // storeInitCardsPlayer(false = es otro jugador)
                restPlayersArray[i] = storeInitCardsPlayer(false, restPlayersArray[i], initCards[index])
            }
        }
    }
    setRestPlayers(restPlayersArray)
}

// Obtener la información de los resultados
// Actualizar la información del jugador solo si se ha confirmado dicha mano
//      - Si es el jugador: actualizar player si stick = true en dicha mano
//      - Si es otro jugador: actualizar restPlayers[] si hay cartas en el results
export const getResults = (userId, results, bank, setBank, player, setPlayer, restPlayers) => {
    // Guardar banca
    // Información de la banca
    const bankIndex = results.findIndex(res => res.userId === 'Bank')
    const updatedBank = {...bank}
    updatedBank.hand.cards = results[bankIndex].cards
    updatedBank.hand.total = results[bankIndex].total
    updatedBank.hand.active = true
    updatedBank.hand.show = true
    setBank(updatedBank)
    
    // Guardar resultados usuario
    let updatedPlayer = {...player}
    const infoPlayer = results.find(infoPlayer => infoPlayer.userId === userId);

    // storeResultPlayer (true = es el jugador)
    updatedPlayer = storeResultPlayer(true, updatedPlayer, infoPlayer)
    setPlayer(updatedPlayer)

    // Asignar resto de jugadores
    // Recorrer initBoards
    for (let i = 0; i < results.length; i++) {
        // Si no es el usuario ni la banca
        if (results[i].userId !== userId && results[i].userId !== 'Bank') {
            const index = results.findIndex(res => res.userId === restPlayers[i].playerId);
            if (index !== -1) {
                // storeResultPlayer (false = es otro jugador)
                storeResultPlayer(false, restPlayers[i], results[index])
            }
        }
    }
}

// Marca como eliminados los restPlayers (saldrán con un fondo gris)
export const eliminatePlayers = (playersToDelete, restPlayers) => {
    for (const playerToDelete of playersToDelete) {
        const index = restPlayers.findIndex(player => player.playerId == playerToDelete)
        if (index !== -1) {
            restPlayers[index].playing = false
        }
    }
}
           

/************************ Funciones *****************************************************/
const storeResultPlayer = (isPlayer, updatedPlayer, infoPlayer) => {

    
    // Mostrar primera mano si o si
    updatedPlayer.hand.active = true
    updatedPlayer.hand.show = true
    
    // Si es el jugador
    if (isPlayer) {
        // Actualizar las vidas actuales
        updatedPlayer.lives = infoPlayer.lives
        
        // Si ha confirmado la jugada
        if(updatedPlayer.hand.stick) {
            updatedPlayer.hand.cards = infoPlayer.cards
            updatedPlayer.hand.total = infoPlayer.total
        } 

        // Es otro jugador, actualizar info primera mano, solo si hay info en result
    } else if (!isPlayer && infoPlayer.cards.length > 0) {
        updatedPlayer.hand.cards = infoPlayer.cards
        updatedPlayer.hand.total = infoPlayer.total
        updatedPlayer.lives = infoPlayer.lives
    }

    return updatedPlayer
}

const storeInitCardsPlayer = (isPlayer, updatedPlayer, infoPlayer) => {

    updatedPlayer.hand.cards = infoPlayer.cards
    updatedPlayer.hand.total = infoPlayer.totalCards
    updatedPlayer.hand.defeat= false
    updatedPlayer.hand.blackJack= infoPlayer.blackJack
    updatedPlayer.hand.active= true
    updatedPlayer.hand.stick = false
    updatedPlayer.hand.show = isPlayer

    return updatedPlayer
}

export const isInTournament = async (torneoId, setPage, setMensajeEnter, setTournament, setRound) => {
    try {
        const resIsIn = await axios.get('/tournament/isUserInTournament/' + torneoId)
        if (resIsIn.status !== 200) {
            console.log("Fallo: ", resIsIn);
            throw new Error('Error', resIsIn);
        } else if (resIsIn.data.status === "success") {
            setTournament(resIsIn.data.tournament)
            setPage(1)

            const resRound = await axios.get('/tournament/roundInTournament/' + torneoId)
            if (resRound.status !== 200) {
                console.log("Fallo: ", resRound);
                throw new Error('Error', resRound);
            } else {
                setRound(resRound.data.round)
            }
        } else {
            setRound(8)

            const resId = await axios.get('/tournament/tournamentById/' + torneoId)
            if (resId.status !== 200) {
                console.log("Fallo: ", resId);
                throw new Error('Error', resId);
            } else {
                setTournament(resId.data.tournament)
                setMensajeEnter(true)    
            }
        }

    } catch (e) {
        console.error(e.message)
    }
}

export const enterTournament = async (torneo, setPage) => {
    try {
        const response = await axios.put('/tournament/enterTournament/' + torneo._id)
        if (response.status !== 200) {
            console.log("Fallo: ", response);
            throw new Error('Error', response);
        } else {
            setPage(1)
        }
    } catch (e) {
        console.error(e.message)
    }
}