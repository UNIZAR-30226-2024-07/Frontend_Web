// Imports
import axios from "../api/axios"
import { useEffect, useState } from "react"
import constants from '../constants'
import io from "socket.io-client"
import { useAuth } from "../Context/AuthContext"

// Variable que se usará para la gestión de la conexión
let socket

const PruebaMatch = () => {
    const [namePriv, setNamePriv] = useState("") // Nombre de la mesa privada
    const [passwdPriv, setPasswdPriv] = useState("") // Contraseña de la mesa privada
    const [bankLevel, setBankLevel] = useState("") // Nombre del nivel de la banca de la partida privada
    const [numPlayers, setNumPlayers] = useState("") // Número de jugadores de la partida privada
    const [bet, setBet] = useState("") // Apuesta fija de la partida privada

    const [cardsFirst, setCardsFirst] = useState([]) // Cartas de primeras
    const [totalFirst, setTotalFirst] = useState("") // Total de primeras
    const [defeatFirst, setDefeatFirst] = useState(false) // Is defeat primeras
    const [blackJackFirst, setBlackJackFirst] = useState(false) // Is blackJack de primeras
    const [cardsSecond, setCardsSecond] = useState([]) // Cartas de segundas
    const [totalSecond, setTotalSecond] = useState("") // Total de segundas
    const [defeatSecond, setDefeatSecond] = useState(false) // Is defeat primeras
    const [blackJackSecond, setBlackJackSecond] = useState(false) // Is blackJack de primeras
    const [boardId, setBoardId] = useState("") // BoardId

    const [tituloVisible, setTituloVisible] = useState(false) // Variable "tonta" para ver cuando se ha conseguido una partida
    const [partidasPublicas, setPartidasPublicas] = useState([]) // Lista de partidas públicas
    const { user } = useAuth()

    const partidaPublica = (partida) => {
        socket.emit("enter public board", { body: { typeId: partida._id, userId: user._id }})
    }

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

    // const getTorneos = async () => {
    //     try {
    //         const response = await axios.get()
    //     }
    // }

    const crearPriv = async (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe
        socket.emit("create private board", { body: { name: namePriv,
                                                      password: passwdPriv,
                                                      bankLevel: bankLevel,
                                                      numPlayers: numPlayers,
                                                      bet: bet,
                                                      userId: user._id}})
    }

    const joinPrivada = async (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe
        socket.emit("enter private board", { body: { name: namePriv, 
                                                     password: passwdPriv,
                                                     userId: user._id}})
    }

    const drawCard = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.put('/bank/drawCard', {
                boardId: boardId,
                typeBoardName: "public",
                cardsOnTable: cardsFirst
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            // console.log('DrawCard: ', response.data);
            setCardsFirst(response.data.cardsOnTable)
            setDefeatFirst(response.data.defeat)
            setBlackJackFirst(response.data.blackJack)
            setTotalFirst(response.data.totalCards)
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const split = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.put('/bank/split', {
                boardId: boardId,
                typeBoardName: "public",
                cardsOnTable: cardsFirst
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            // console.log('Avatares:', response);
            setCardsFirst(response.data.cardsOnTableFirst)
            setDefeatFirst(response.data.defeatFirst)
            setBlackJackFirst(response.data.blackJackFirst)
            setTotalFirst(response.data.totalCardsFirst)

            setCardsSecond(response.data.cardsOnTableSecond)
            setDefeatSecond(response.data.defeatSecond)
            setBlackJackSecond(response.data.blackJackSecond)
            setTotalSecond(response.data.totalCardsSecond)
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const double = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.put('/bank/double', {
                boardId: boardId,
                typeBoardName: "public",
                cardsOnTable: cardsFirst
            })
            if (response.status !== 200) {
                console.log("Fallo: ", response);
                throw new Error('Error', response);
            }
            // console.log('Avatares:', response);
            setCardsFirst(response.data.cardsOnTableFirst)
            setDefeatFirst(response.data.defeatFirst)
            setBlackJackFirst(response.data.blackJackFirst)
            setTotalFirst(response.data.totalCardsFirst)
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const stick = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.put('/bank/stick', {
                boardId: boardId,
                typeBoardName: "public",
                cardsOnTable: cardsFirst
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
        getPartidasPublicas()
        // getTorneos()
    })

    useEffect(() => {
        socket = io(constants.dirApi)

        socket.on("starting public board", (boardId, initCards) => {
            console.log("Que empieza la partida")
            setTituloVisible(!tituloVisible)
            setBoardId(boardId)
            console.log(initCards)
            const infoPlayer = initCards.find(infoPlayer => infoPlayer.userId === user._id);
            setCardsFirst(infoPlayer.cards)
            setTotalFirst(infoPlayer.totalCards)
            console.log(boardId)
        })

        socket.on("starting private board", (boardId, initCards) => {
            console.log("Partida Privada a punto de comenzar")
            setTituloVisible(!tituloVisible)
            setBoardId(boardId)
            console.log(initCards)
            const infoPlayer = initCards.find(infoPlayer => infoPlayer.userId === user._id);
            setCardsFirst(infoPlayer.cards)
            setTotalFirst(infoPlayer.totalCards)
            console.log(boardId)
        })
    }, [tituloVisible, user]) // Se ejecuta solo una vez cuando el componente se monta

    return (
        <div>
            <div>
                { tituloVisible ? (
                    <p style={{color: 'black'}}> BlackJack </p>
                ) : (
                    <p>  </p>
                ) 
                }
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

            <form>
                <p> Nombre de la partida privada </p>
                <input
                    type="text"
                    value={namePriv}
                    onChange={(e) => setNamePriv(e.target.value)}
                />
                <p> Contraseña de la partida privada </p>
                <input
                    type="text"
                    value={passwdPriv}
                    onChange={(e) => setPasswdPriv(e.target.value)}
                />
                <p> Nivel de la banca </p>
                <input
                    type="text"
                    value={bankLevel}
                    onChange={(e) => setBankLevel(e.target.value)}
                />
                <p> Número de jugadores </p>
                <input
                    type="text"
                    value={numPlayers}
                    onChange={(e) => setNumPlayers(e.target.value)}
                />
                <p> Apuesta fija </p>
                <input
                    type="text"
                    value={bet}
                    onChange={(e) => setBet(e.target.value)}
                />
                
                <button onClick={(e) => crearPriv(e)}>Crear Partida</button>
                <button onClick={(e) => joinPrivada(e)}>Entrar Partida</button>
            </form>

            <div style={{ backgroundColor: 'white'}}>

                <button onClick={(e) => drawCard(e)}>DrawCard</button>
                <button onClick={(e) => split(e)}>Split</button>
                <button onClick={(e) => double(e)}>Double</button>
                <button onClick={(e) => stick(e)}>Stick</button>

                <div style={{ backgroundColor: 'brown'}}>
                    <p>Cards: First</p>
                    <p>Total: {totalFirst}</p>
                    {cardsFirst.map((carta) => (
                        <div key={carta._id} style={{ backgroundColor: 'green'}}>
                        <p>Valor: {carta.value}</p>
                        <p>Carta: {carta.value} of {carta.suit}</p>
                        </div>
                    ))}
                    <p>Is defeat: {defeatFirst ? "Sí" : "No"}</p>
                    <p>Is BlackJack: {blackJackFirst ? "Sí" : "No"}</p>
                </div>

                <div style={{ backgroundColor: 'yellow'}}>
                    <p>Cards: Second</p>
                    <p>Total: {totalSecond}</p>
                    {cardsSecond.map((carta) => (
                        <div key={carta._id} style={{ backgroundColor: 'green'}}>
                        <p>Valor: {carta.value}</p>
                        <p>Carta: {carta.value} of {carta.suit}</p>
                        </div>
                    ))}
                    <p>Is defeat: {defeatSecond ? "Sí" : "No"}</p>
                    <p>Is BlackJack: {blackJackSecond ? "Sí" : "No"}</p>
                </div>                
            </div>
        </div>
    )
}

export default PruebaMatch