import { useState, useEffect } from 'react';
import axios from '../api/axios';
import './SelectAvatar.css';
import { MyNav } from '../Components/MyNav';
import ListaAvatares from '../Components/ListaAvatares'
import MyLoading from '../Components/MyLoading';

export function SelectAvatar() {
  const [avatars, setAvatars] = useState([]);
  const [rugs, setRugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [defaulA, setDefaulA] = useState(null);
  const [defaulB, setDefaulB] = useState(null);
  const [defaulC, setDefaulC] = useState(null);

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

  useEffect(() => {
    handleListaAvataresClick();
    if (defaulC && avatars && defaulB && defaulA && defaulC && cards && rugs) {
      setLoading(false);
    }
  }, [defaulC, avatars, defaulB ,defaulA, cards,rugs]);

  if (loading) {
    return <div> <MyLoading/> </div>;
  }

  
  return (
    <div className='page-select'>
      <MyNav isLoggedIn={false} isDashboard={false}/>

      <div className='div-a'>
        <ListaAvatares avatars={rugs} name="Tapetes" type='2' defaul={defaulC.image} onAvatarClick={handleListaAvataresClick}/> 
        <ListaAvatares avatars={cards} name="Cartas" type="2" defaul={defaulB.image} onAvatarClick={handleListaAvataresClick}/>
        <ListaAvatares avatars={avatars} name="Avatares" type="2" defaul={defaulA.image} onAvatarClick={handleListaAvataresClick}/>
      </div>   
    </div> 
  );
}