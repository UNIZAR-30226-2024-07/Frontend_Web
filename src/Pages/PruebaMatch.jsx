import axios from "../api/axios"
import { useEffect, useState } from "react"
import io from "socket.io-client"
import { useAuth } from "../Context/AuthContext"

const endPoint = "http://localhost:8080"
let socket

const PruebaMatch = () => {
    const [namePriv, setNamePriv] = useState("")
    const [passwdPriv, setPasswdPriv] = useState("")
    const [bankLevel, setBankLevel] = useState("")
    const [numPlayers, setNumPlayers] = useState("")
    const [bet, setBet] = useState("")

    const [tituloVisible, setTituloVisible] = useState(false)
    const [partidasPublicas, setPartidasPublicas] = useState([])
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

    const crearPriv = async () => {
        socket.emit("create private board", { body: { name: namePriv,
                                                      password: passwdPriv,
                                                      bankLevel: bankLevel,
                                                      numPlayers: numPlayers,
                                                      bet: bet,
                                                      userId: user._id}})
    }

    const joinPrivada = async () => {
        socket.emit("enter private board", { body: { name: namePriv, 
                                                     password: passwdPriv,
                                                     userId: user._id}})
    }

    useEffect(() => {
        getPartidasPublicas()
    })

    useEffect(() => {
        socket = io(endPoint)

        socket.on("SC", () => {
            console.log("SC recibido")
            setTituloVisible(!tituloVisible)
        })

        socket.on("starting public board", (boardId) => {
            console.log("Que empieza la partida")
            setTituloVisible(!tituloVisible)
            console.log(boardId)
        })

        socket.on("starting private board", (boardId) => {
            console.log("Partida Privada a punto de comenzar")
            setTituloVisible(!tituloVisible)
            console.log(boardId)
        })
    }, []) // Se ejecuta solo una vez cuando el componente se monta

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
                
                <button onClick={() => crearPriv()}>Crear Partida</button>
                <button onClick={() => joinPrivada()}>Entrar Partida</button>
            </form>
        </div>
    )
}

export default PruebaMatch
