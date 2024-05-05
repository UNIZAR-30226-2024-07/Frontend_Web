import { useState, useEffect } from 'react';
import axios from '../api/axios';
import './PageTienda.css';
import { MyNav } from '../Components/MyNav';
import ListaAvatares from '../Components/ListaAvatares'
import MyLoading from '../Components/MyLoading';

export function PageTienda() {
  const [avatars, setAvatars] = useState([]);
  const [rugs, setRugs] = useState([]);
  const [coins, setCoins] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  const fetchData = async () => {
    try {
      const [avatarsRes, rugsRes, cardsRes, verify] = await Promise.all([
        axios.get('/avatar/getAvatarStore'),
        axios.get('/rug/getRugStore'),
        axios.get('/card/getCardStore'),
        axios.get('/user/verify')
      ]);

      setAvatars(avatarsRes.data.avatar);
      setRugs(rugsRes.data.rug);
      setCards(cardsRes.data.card);
      setCoins(verify.data.user.coins);

      
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  useEffect(() => {
    fetchData();
    if (coins && avatars && cards && rugs) {
      setLoading(false);
    }
  }, [coins, avatars, cards, rugs]);

  if (loading) {
    return <div> <MyLoading/> </div>;
  }




  return (
    <div className='page-tienda'>
      <MyNav isLoggedIn={false} isDashboard={false}/>

      <div className='div-inicial'>
        <div className='moneda'>
          <img src="./../../Frontend_Web/Imagenes/moneda.png" className="moneda-icono" />
          {coins}
        </div>
        <ListaAvatares avatars={rugs} name="Tapetes" type="1"  defaul="" onAvatarClick={fetchData}/> 
        <ListaAvatares avatars={cards} name="Cartas" type="1" defaul="" onAvatarClick={fetchData}/>
        <ListaAvatares avatars={avatars} name="Avatares" type="1" defaul="" onAvatarClick={fetchData}/>
      </div>   
    </div> 
  );
}