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
    const fetchAvatars = async () => {
      try {
        const response = await axios.get('/avatar/getAllMyAvatars');
        setAvatars(response.data.avatars);
        console.log(response);
      } catch (error) {
        console.error('Failed to load avatars:', error);
      }
    };

    const fetchRugs = async () => {
      try {
        const response = await axios.get('/rug/getAllMyRugs');
        setRugs(response.data.rugs);
      } catch (error) {
        console.error('Failed to load rugs:', error);
      }
    };

    const fetchCards = async () => {
      try {
        const response = await axios.get('/card/getAllMyCards');
        setCards(response.data.cards);
      } catch (error) {
        console.error('Failed to load cards:', error);
      }
    };
    const defaultAvatar = async () => {
        try {
          const response = await axios.get(`/avatar/currentAvatar`);
          setDefaulA(response.data.avatar);

        } catch (error) {
          console.error('Failed to buy of card:', error);
        }
    };

    const defaultCard = async () => {
        try {
            const response = await axios.get(`/card/currentCard`);
            setDefaulB(response.data.card);
        } catch (error) {
            console.error('Failed to buy of card:', error);
        }
    };

    const defaultRug = async () => {
        try {
            const response = await axios.get(`/rug/currentRug`);
            setDefaulC(response.data.rug);
        } catch (error) {
            console.error('Failed to buy of card:', error);
        }
    };
    const timeout = setTimeout(() => {
        // Aquí colocas el código que deseas ejecutar después de unos segundos
        setMounted(true);
        console.log('Se han pasado 3 segundos');
      }, 1000); // 3000 milisegundos = 3 segundos
  

    defaultAvatar();
    defaultRug();
    defaultCard();
    fetchAvatars();
    fetchRugs();
    fetchCards();
    return () => clearTimeout(timeout);

   }, []);


  return (
    mounted && <div className='page-select'>
      <MyNav isLoggedIn={false} isDashboard={true}/>

      <div className='div-a'>
        <ListaAvatares avatars={rugs} name="Tapetes" type='2' defaul={defaulC.image}/> 
        <ListaAvatares avatars={cards} name="Cartas" type="2" defaul={defaulB.image}/>
        <ListaAvatares avatars={avatars} name="Avatares" type="2" defaul={defaulA.image}/>
      </div>   
    </div> 
  );
}