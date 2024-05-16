import { useState, useEffect} from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import './ModificarBaraja.css';
import constants from '../constants';
import { Input, CircularProgress } from "@nextui-org/react";
import { MyNavAdmin } from '../Components/MyNavAdmin';
import React from "react";

const ModificarBaraja = () => {

  const navigate = useNavigate();
  const {id} = useParams()



  const [newBaraja, setNewBaraja] = useState(
    {
        image: '',
        price: ''
    }
  )

  const [barajaLoaded, setBarajaLoaded] = useState(false)

  useEffect(() => {
    const getBaraja = async () => {
        try {
          console.log("El id de baraja recibida es " + id);
          const response = await axios.get('/card/cardById/' + id);
          if (response.status !== 200) {
              return console.error(response.data);
          } else {
              console.log("Datos de avatar cargados correctamente");
              console.log(response.data);
              console.log(response.data.card.image)
              setNewBaraja({
                image: response.data.card.image,
                price: response.data.card.price
              });
              console.log("El image de la baraja una vez cargado es: " + newBaraja.image);
              setBarajaLoaded(true);
          }
          
        } catch (e) {
            console.error("Error al pedir los datos de avatar. " + e.message);
        }
        
    };
    getBaraja(); // Llama a la función al cargar el componente

}, []); // El array de dependencias está vacío para que se ejecute solo una vez

// useEffect(() =>{
  
// }, [newAvatar]);

  const handleChange = (e) => {
    setNewBaraja({...newBaraja, [e.target.name]: e.target.value})
  }




  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('price', newBaraja.price) 
    formData.append('image', newBaraja.image) 

    try {
        const response = await axios.put('/card/update/' + id, formData)
        if (response.status !== 200) {
            console.log("Fallo al obtener Avatares: ", response.data);
            throw new Error('Error al obtener avatares');
        }
        else{
          navigate(constants.root + 'HomeAdmin');
        }
        console.log('Respuesta:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
  }


  return (
    <div>
      <div className="ModificarBaraja">
        <MyNavAdmin></MyNavAdmin>
        {barajaLoaded ? (
          <form  encType="multipart/form-data" className="questionnaire-container">
            <h2 className="questionnaire-tittle"> Modifcar baraja</h2>
              <div className="form-input">Card name</div>
              <Input
                  type="text"
                  //placeholder="Enter the avatar name"
                  name="image"
                  defaultValue={newBaraja.image}
                  onChange={handleChange}
                  required
              />
              
              <div className="form-input">Card price</div>
              <Input
                  type="number"
                  //placeholder="Enter the avatar price"
                  name="price"
                  defaultValue={newBaraja.price}
                  onChange={handleChange}
                  required
                  className="custom-input"
              />

              <Link to={constants.root} onClick={handleSubmit} className="submit-button">Confirmar</Link>

          </form>
        ) : (
          <CircularProgress aria-label="Loading..." />
        )}
      </div>
    </div>
  );
}

export default ModificarBaraja