// AvatarList.jsx
import constants from '../constants'
import './ListaAvatares.css'
import { useState } from 'react';
import axios from '../api/axios';

const ListaAvatares = ({ avatars, name }) => {
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [precio, setPrecio] = useState(null);
  const [error, setError] = useState(null);
  
  const saberPrecio = async (avatar) => {
    try {
      const response = await axios.get(`/avatar/avatarById/${avatar}`);
      setPrecio(response.data.avatar.price);
    } catch (error) {
      console.error('Failed to load price of avatar:', error);
    }
  };

  const saberPrecio2 = async (avatar) => {
    try {
      const response = await axios.get(`/rug/rugById/${avatar}`);
      setPrecio(response.data.rug.price);
    } catch (error) {
      console.error('Failed to load price of tapete:', error);
    }
  };

  const saberPrecio3 = async (avatar) => {
    try {
      const response = await axios.get(`/card/cardById/${avatar}`);
      setPrecio(response.data.card.price);
    } catch (error) {
      console.error('Failed to load price of card:', error);
    }
  };

  const comprarAvatar = async (avatar) => {
    try {
      const response = await axios.put(`/user/buyAvatar`, {avatarName: avatar});
      console.log(response);
    } catch (error) {
      console.error('Failed to buy of avatar:', error);
      setError('No se ha podido comprar el avatar por insuficientes monedas');

    }
  };
  const comprarRug = async (avatar) => {
    try {
      const response = await axios.put(`/user/buyRug`, {rugName: avatar});
      console.log(response);
    } catch (error) {
      console.error('Failed to buy of tapete:', error);
      setError('No se ha podido comprar el tapete por insuficientes monedas');
    }
  };
  const comprarCard = async (avatar) => {
    try {
      const response = await axios.put(`/user/buyCard`, {cardName: avatar});
      console.log(response);
    } catch (error) {
      console.error('Failed to buy of card:', error);
      setError('No se ha podido comprar la carta por insuficientes monedas');
    }
  };

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
    if (name === 'Avatares') {
      saberPrecio(avatar._id);
    } else if (name === 'Tapetes') {
      saberPrecio2(avatar._id);
    } else if (name === 'Cartas') {
      saberPrecio3(avatar._id);
    }
    console.log("hola mundo");
  };
  
  const handleConfirm = (avatar) => {
    // Aquí puedes agregar la lógica para confirmar la compra
    if (name === 'Avatares') {
      comprarAvatar(avatar.image)
    } else if (name === 'Tapetes') {
      comprarRug(avatar.image);
    } else if (name === 'Cartas') {
      comprarCard(avatar.image);
    }
    setSelectedAvatar(null); // Cierra el cuadro de diálogo de confirmación
  };

  const handleCancel = () => {
    setSelectedAvatar(null); // Cierra el cuadro de diálogo de confirmación
  };

  const volver = () => {
    setSelectedAvatar(null); // Cierra el cuadro de diálogo de confirmación
    setError(null);
  }

  const render = () => {
    return (
      avatars.map(avatar => (
        <li key={avatar._id}>
          <img 
            src={constants.dirApi + "/" + constants.uploadsFolder + "/" + avatar.imageFileName}
            alt={avatar.image}
            className="avatar-imagee"
            onClick={() =>handleAvatarClick(avatar)}
          />
        </li> 
        )
        )
      );
  };

  return (
    <div>
      {(selectedAvatar == null || selectedAvatar) && (
        <div className='iguales'>
          <div className="saludo">{name}</div>
          <div className="avatar-container">
            <div className="avatar-scroll">
                <ul className="avatar-list">
                {render()}
                </ul>
            </div>
          </div>
        </div>)}
      {selectedAvatar && (
        <div className="confirmation-dialog">
          <div className='confirmar'>¿Confirmar compra?</div>
          <div className='fleex'>
            <img 
              src={constants.dirApi + "/" + constants.uploadsFolder + "/" + selectedAvatar.imageFileName}
              alt={selectedAvatar.image}
              className="avatar-imagee"
            />
            <div className='texto'>
              ¿Deseas comprar {selectedAvatar.image}?
              <div className="monedas">
                <img src="./../../Frontend_Web/Imagenes/moneda.png" className="monedas-icono" />
                {precio}
              </div>
            </div>
            
          </div>
          <div>
            <button onClick={() =>handleConfirm(selectedAvatar)}>Si</button>
            <button onClick={handleCancel}>No</button>
          </div>
        </div>
        
      )}
      {error && 
        <div className="confirmation-dialog">
          <div className="error-message">{error}</div>
          <button onClick={volver}>Okey</button>
        </div>}
    </div>
  );
};

export default ListaAvatares;
