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
import { MyNav } from "../../Components/MyNav"
import { MdCallSplit } from "react-icons/md";

import { RxCross2 } from "react-icons/rx";
import { MdExposurePlus1 } from "react-icons/md";
import { FaHandPaper } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import MyLoading from "../../Components/MyLoading"
let socket
const bankLevels = [
    { level: "beginner", image: "./../../../Frontend_Web/Imagenes/cards/Ace-Clubs.png"},
    { level: "medium", image: "./../../../Frontend_Web/Imagenes/cards/2-Clubs.png"},
    { level: "expert", image: "./../../../Frontend_Web/Imagenes/cards/3-Clubs.png"}

];


const SingleBoard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [boardId, setBoardId] = useState("") // BoardId

    // Para mostrar o no mostrar resultados
    const [showResults, setShowResults] = useState(false);
    const [page, setPage] = useState(0);
    const [listo, setListo] = useState(false);

    // Objetos para inicializar la información de banca y jugadores
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

    // Inicialización useState información jugadores
    // Información todos los jugadores
    const [bank, setBank] = useState(objBank)   // Mano de la banca
    const [player, setPlayer] = useState(objPlayer);   // Mano del jugador

    ////////////////////////////////////////////////////////////////////////////
    // Manejo de Socket.io
    ////////////////////////////////////////////////////////////////////////////

    // Función entrar una partida solitario
    const partidaSingle = (bankLevel) => {
        socket.emit("enter single board", { body: { bankLevel: bankLevel, userId: user._id }})
        setListo(true);

    }

    useEffect(() => {
        socket = io(constants.dirApi)

        // Esperar api nos conteste par empezar partida
        socket.on("starting single board", async (boardId) => {
            setBoardId(boardId)

            // Emitir que estamos listos
            const req = { body: {boardId: boardId}}
            socket.emit("players single ready", req)
        })

        // Recibir play hand (se pueden hacer jugadas)
        socket.on("play hand", (initCards) => {
            // Dejar ver resultados
            setShowResults(false)
            setPage(1);
            setListo(false);
            // Inicializar la cartas
            // 1 carta del Bank
            // 2 cartas por jugador
            getInitCards(user._id, initCards, setBank, player, setPlayer)
        })

        // Recibir hand results (visionar resultados)
        socket.on("hand results", (results) => {

            // Guardar resultados
            getResults(user._id, results, bank, setBank, player, setPlayer)
            
            // Visionar resultados
            setShowResults(true)
        })
    }, [user, bank, player, navigate])

    return (
        <div>
            {listo && 
            <div className="page-publica">
                <MyLoading/>
            </div>
            }
            {!listo && page === 0 && <div className="single-board">
                <MyNav isLoggedIn={false} isDashboard={false} />
                <div className="info-square">
                    <span className="content">Elige nivel de banca</span>
                </div>


                <div className="container">
                    {bankLevels.map(bankLevel => (
                        <button key={bankLevel} onClick={() => partidaSingle(bankLevel.level)}>
                            <img src={bankLevel.image} alt={bankLevel.level} className="level-image" />
                            {bankLevel.level.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>}
            {       
                <div className="fondo-juego">
                    <MyNav isLoggedIn={false} isDashboard={false} isBoard={true} coinsCurrent={0} pausa={0}
                        salir={(e) => leave(e, boardId, navigate)}/>                     
                    <div className="cartas-banca">
                        <p>Banca: {bank.hand.total}</p>
                        <div key={'Bank'}> 
                            {bank.hand.active && (
                                <div className="cartas">
                                    {bank.hand.cards.map((card, cardIndex) => (
                                        <img
                                            className="carta"
                                            key={'-' + cardIndex + '-' + "Bank" + '-' + card.value + '-' + card.suit}
                                            src={bank.hand.show 
                                                ? constants.root + "Imagenes/cards/" + card.value + '-' + card.suit + ".png" 
                                                : ""}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                
                
                    <div className="cartas-jugador">
                        {[hand0, hand1].map(numHand => (
                            <div key={numHand}>
                                { player && player.hands[numHand].active && (
                                    <div>
                                        <p className="texto">Total: {player.hands[numHand].total}</p>
                                        {showResults && (
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
                                                <p className="texto"> Has ganado</p>
                                            ) : (
                                                <p className="texto"> Has perdido</p>
                                            )} 
                                        </div>
                                    )}
                                        <div className="cartas">
                                            {player.hands[numHand].cards.map((card, cardIndex) => (
                                                <img
                                                    className="carta"
                                                    key={numHand + '-' + cardIndex + '-' + player.playerId + '-' + card.value + '-' + card.suit}
                                                    src={player.hands[numHand].show ? `${constants.root}Imagenes/cards/${card.value}-${card.suit}.png` : ''}
                                                />
                                            ))}
                                        </div> 

                                        {!player.hands[numHand].defeat && 
                                        !player.hands[numHand].blackJack &&
                                        !player.hands[numHand].stick && 
                                                
                                            <div className="actions-container">
                                                <div className="action-game">
                                                    <Button onClick={(e) => drawCard(e, numHand, player, setPlayer, boardId)} className="button-game">
                                                        <MdExposurePlus1 className="emote-game" />
                                                    </Button>
                                                    <p>Otra carta</p>
                                                </div> 

                                                <div className="action-game">
                                                    <Button onClick={(e) => stick(e, numHand, player, setPlayer, boardId)} className="button-game">
                                                        <FaHandPaper className="emote-game" />
                                                    </Button>
                                                    <p>Plantar</p>
                                                </div>

                                                <div className="action-game">
                                                    <Button  onClick={(e) => double(e, numHand, player, setPlayer, boardId)} className="button-game">
                                                        <RxCross2 className="emote-game" />
                                                    </Button>
                                                    <p>
                                                    Doblar
                                                    </p>
                                                </div>

                                                {player.hands[hand0].active && 
                                                    !player.hands[hand1].active &&
                                                    player.hands[hand0].cards.length === 2 &&
                                                    player.hands[hand0].cards[0].value == player.hands[hand0].cards[1].value && (
                                                        <div className="action-game">
                                                            <Button onClick={(e) => split(e, player, setPlayer, boardId)} className="button-game">
                                                                <MdCallSplit className="emote-game" />
                                                            </Button>
                                                            <p>Split</p>
                                                        </div>
                                                    )
                                                }
                                        
                                            </div>
                                        }
                                    
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default SingleBoard