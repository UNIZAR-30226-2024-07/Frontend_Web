// AvatarList.jsx
import constants from '../constants'
// import { useEffect } from 'react';
import './ListaAvatares.css'
import { useState } from 'react';
import axios from '../api/axios';

const ListaAvatares = ({ avatars, name, type, defaul }) => {
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [precio, setPrecio] = useState(null);
  const [error, setError] = useState(null);

  
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     // Aquí colocas el código que deseas ejecutar después de unos segundos
  //     console.log('Se han pasado 3 segundos');
  //   }, 3000); // 3000 milisegundos = 3 segundos

  //   return () => clearTimeout(timeout); // Limpiar el temporizador al desmontar el componente
  // }, []); // El segundo argumento de useEffect indica que el efecto solo se ejecuta una vez

  
  // type == 1
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
      await axios.put(`/user/buyAvatar`, {avatarName: avatar});
    } catch (error) {
      console.error('Failed to buy of avatar:', error);
      setError('No se ha podido comprar el avatar por insuficientes monedas');

    }
  };
  const comprarRug = async (avatar) => {
    try {
      await axios.put(`/user/buyRug`, {rugName: avatar});
    } catch (error) {
      console.error('Failed to buy of tapete:', error);
      setError('No se ha podido comprar el tapete por insuficientes monedas');
    }
  };
  const comprarCard = async (avatar) => {
    try {
      await axios.put(`/user/buyCard`, {cardName: avatar});
    } catch (error) {
      console.error('Failed to buy of card:', error);
      setError('No se ha podido comprar la carta por insuficientes monedas');
    }
  };

  
  const handleAvatarClick = (avatar) => {
    if (type === "1") {
      setSelectedAvatar(avatar);
      if (name === 'Avatares') {
        saberPrecio(avatar._id);
      } else if (name === 'Tapetes') {
        saberPrecio2(avatar._id);
      } else if (name === 'Cartas') {
        saberPrecio3(avatar._id);
      }

    } else {
      handleConfirm(avatar);
    }
  };
  

  const seleccionarAvatar = async (avatar) => {
    try {
      await axios.put(`/user/changeAvatar`, {avatarName: avatar});
    } catch (error) {
      console.error('Failed to buy of card:', error);
      setError('No se ha podido comprar la carta por insuficientes monedas');
    }
  };

  const seleccionarTapete = async (avatar) => {
    try {
      await axios.put(`/user/changeRug`, {rugName: avatar});
    } catch (error) {
      console.error('Failed to buy of card:', error);
      setError('No se ha podido comprar la carta por insuficientes monedas');
    }
  };

  const seleccionarCarta = async (avatar) => {
    try {
      await axios.put(`/user/changeCard`, {cardName: avatar});
    } catch (error) {
      console.error('Failed to buy of card:', error);
      setError('No se ha podido comprar la carta por insuficientes monedas');
    }
  };


  // Función para reiniciar el componente
  // const resetComponent = () => {
  //   // setResetCounter(prevCounter => prevCounter + 1);
  // };

  const handleConfirm = (avatar) => {
    // Aquí puedes agregar la lógica para confirmar la compra
    if (type === "1") {
      if (name === 'Avatares') {
        comprarAvatar(avatar.image)
      } else if (name === 'Tapetes') {
        comprarRug(avatar.image);
      } else if (name === 'Cartas') {
        comprarCard(avatar.image);
      }
      setSelectedAvatar(null); // Cierra el cuadro de diálogo de confirmación
    } else {
      if (name === 'Avatares') {
        seleccionarAvatar(avatar.image)
      } else if (name === 'Tapetes') {
        seleccionarTapete(avatar.image);
      } else if (name === 'Cartas') {
        seleccionarCarta(avatar.image);
      }
    }
    setTimeout(() => {
      window.location.reload();
    }, 3000); // 3000 milisegundos = 3 segundos
  };

  const handleCancel = () => {
    setSelectedAvatar(null); // Cierra el cuadro de diálogo de confirmación
  };

  const volver = () => {
    setSelectedAvatar(null); // Cierra el cuadro de diálogo de confirmación
    setError(null);
  }

  // type == 2
  
  const render = () => {
    return (
      avatars.map(avatar => (
        <li key={avatar.image}>
         {avatar.image === defaul ? (
          <img 
            src={constants.dirApi + "/" + constants.uploadsFolder + "/" + avatar.imageFileName}
            alt={avatar.image}
            className='avatar-images'
            onClick={() =>handleAvatarClick(avatar)}
          />
          ) : (
          <img 
            src={constants.dirApi + "/" + constants.uploadsFolder + "/" + avatar.imageFileName}
            alt={avatar.image}
            className='avatar-imagee'
            onClick={() => handleAvatarClick(avatar)}
          />
          )}
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
      {type == 1 && selectedAvatar && (
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
      {error && type == 1 && 
        <div className="confirmation-dialog">
          <div className="error-message">{error}</div>
          <button onClick={volver}>Okey</button>
        </div>}
    </div>
  );
};

export default ListaAvatares;
