import { useState, useEffect } from 'react';
import axios from '../api/axios';
import './SelectAvatar.css';
import { MyNav } from '../Components/MyNav';
import ListaAvatares from '../Components/ListaAvatares'

export function SelectAvatar() {
  const [avatars, setAvatars] = useState([]);
  const [rugs, setRugs] = useState([]);
  const [cards, setCards] = useState([]);
  const [defaulA, setDefaulA] = useState(null);
  const [defaulB, setDefaulB] = useState(null);
  const [defaulC, setDefaulC] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    handleListaAvataresClick();
  
    const timeout = setTimeout(() => {
        // Aquí colocas el código que deseas ejecutar después de unos segundos
        setMounted(true);
      }, 2000); // 3000 milisegundos = 3 segundos

    return () => clearTimeout(timeout);

   }, []);

   // Función para ejecutar el efecto useEffect nuevamente
  const handleListaAvataresClick = async () => {
    try {
      const [avatarsRes, rugsRes, cardsRes, defaultAvatarRes, defaultCardRes, defaultRugRes] = await Promise.all([
        axios.get('/avatar/getAllMyAvatars'),
        axios.get('/rug/getAllMyRugs'),
        axios.get('/card/getAllMyCards'),
        axios.get(`/avatar/currentAvatar`),
        axios.get(`/card/currentCard`),
        axios.get(`/rug/currentRug`)
      ]);

      setAvatars(avatarsRes.data.avatars);
      setRugs(rugsRes.data.rugs);
      setCards(cardsRes.data.cards);
      setDefaulA(defaultAvatarRes.data.avatar);
      setDefaulB(defaultCardRes.data.card);
      setDefaulC(defaultRugRes.data.rug);
    } catch (error) {
      console.error('Failed to reload data:', error);
    }
  };
  return (
    mounted && 
    <div className='page-select'>
      <MyNav isLoggedIn={false} isDashboard={true}/>

      <div className='div-a'>
        <ListaAvatares avatars={rugs} name="Tapetes" type='2' defaul={defaulC.image} onAvatarClick={handleListaAvataresClick}/> 
        <ListaAvatares avatars={cards} name="Cartas" type="2" defaul={defaulB.image} onAvatarClick={handleListaAvataresClick}/>
        <ListaAvatares avatars={avatars} name="Avatares" type="2" defaul={defaulA.image} onAvatarClick={handleListaAvataresClick}/>
      </div>   
    </div> 
  );
}