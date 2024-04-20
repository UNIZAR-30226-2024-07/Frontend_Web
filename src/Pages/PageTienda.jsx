import { useState, useEffect } from 'react';
import axios from '../api/axios';
import './PageTienda.css';
import { MyNav } from '../Components/MyNav';
import ListaAvatares from '../Components/ListaAvatares'

export function PageTienda() {
  const [avatars, setAvatars] = useState([]);
  const [rugs, setRugs] = useState([]);
  const [coins, setCoins] = useState(null);
  const [cards, setCards] = useState([]);


  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await axios.get('/avatar/getAvatarStore');
        setAvatars(response.data.avatar);
      } catch (error) {
        console.error('Failed to load avatars:', error);
      }
    };

    const fetchRugs = async () => {
      try {
        const response = await axios.get('/rug/getRugStore');
        setRugs(response.data.rug);
      } catch (error) {
        console.error('Failed to load rugs:', error);
      }
    };

    const fetchCards = async () => {
      try {
        const response = await axios.get('/card/getCardStore');
        setCards(response.data.card);
      } catch (error) {
        console.error('Failed to load cards:', error);
      }
    };

    const saberMonedas = async () => {
      try {
        const response = await axios.get('/user/verify');
        setCoins(response.data.user.coins);
      } catch (error) {
        console.error('Failed to load cards:', error);
      }
    };
    fetchAvatars();
    fetchRugs();
    fetchCards();
    saberMonedas();
   }, []);


  return (
    <div className='page-tienda'>
      <MyNav isLoggedIn={false} isDashboard={true}/>

      <div className='div-inicial'>
        <div className='moneda'>
          <img src="./../../Frontend_Web/Imagenes/moneda.png" className="moneda-icono" />
          {coins}
        </div>
        <ListaAvatares avatars={rugs} name="Tapetes"/> 
        <ListaAvatares avatars={cards} name="Cartas"/>
        <ListaAvatares avatars={avatars} name="Avatares"/>
      </div>   
    </div> 
  );
}